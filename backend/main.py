import logging
import random
import time
import sys
import os
import re
from contextlib import asynccontextmanager
from typing import List, Optional

# Add the current directory to sys.path to ensure local imports work on Vercel
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import BackgroundTasks, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import Session

from config import settings
from database import create_db_and_tables, engine
from models import VisitorSession, ChatMessage
from responses import (
    about,
    experience,
    projects,
    contact,
    fallback,
    greetings,
    thanks,
    fun,
    technical_core,
    technical_frontend,
    technical_backend,
    technical_devops,
    technical_behavioral,
    hr_assessment,
)

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("backend")


# --- Lifecycle ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    create_db_and_tables()
    yield


# --- Models ---
class TelemetryData(BaseModel):
    ip: str
    user_agent: Optional[str] = None
    path: str
    method: str
    timestamp: float


class ChatMessageBase(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    history: List[ChatMessageBase] = []


class ChatResponse(BaseModel):
    reply: str


# --- App Initialization ---
app = FastAPI(title="Portfolio Backend", lifespan=lifespan)

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Background Tasks ---
def save_telemetry(data: TelemetryData):
    try:
        with Session(engine) as session:
            visitor = VisitorSession(
                ip=data.ip,
                user_agent=data.user_agent,
                path=data.path,
                method=data.method,
            )
            session.add(visitor)
            session.commit()
            logger.info(f"Telemetry saved for path: {data.path}")
    except Exception as e:
        logger.error(f"Failed to save telemetry: {e}")


def save_chat_interaction(user_msg: str):
    try:
        with Session(engine) as session:
            # Only save the user message to streamline database usage
            user_entry = ChatMessage(role="user", content=user_msg)
            session.add(user_entry)
            session.commit()
            logger.info("User chat message saved to database")
    except Exception as e:
        logger.error(f"Failed to save chat interaction: {e}")


def is_trigger_match(user_message: str, triggers: List[str]) -> bool:
    """Helper to check if any trigger matches the user message with word boundaries."""
    user_message = user_message.lower()
    for trigger in triggers:
        # Use regex to match trigger as a whole word/phrase to avoid false positives
        pattern = rf"\b{re.escape(trigger.lower())}\b"
        if re.search(pattern, user_message):
            return True
    return False


# --- Global Middleware for Telemetry ---
@app.middleware("http")
async def telemetry_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)

    if not request.url.path.startswith("/health"):
        data = TelemetryData(
            ip=request.client.host if request.client else "unknown",
            user_agent=request.headers.get("user-agent"),
            path=request.url.path,
            method=request.method,
            timestamp=start_time,
        )
        if response.background is None:
            response.background = BackgroundTasks()
        response.background.add_task(save_telemetry, data)

    return response


# --- Routes ---
@app.get("/")
async def root():
    return {"message": "Portfolio API is running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, background_tasks: BackgroundTasks):
    user_message = request.message.lower()
    lang = request.language if request.language in ["en", "es", "fr"] else "en"

    # List of response modules to check against in priority order
    response_modules = [
        technical_core,
        technical_frontend,
        technical_backend,
        technical_devops,
        technical_behavioral,
        hr_assessment,
        greetings,
        thanks,
        about,
        experience,
        projects,
        contact,
        fun,
    ]

    reply = None
    # Determine response based on triggers with improved NLU matching
    for module in response_modules:
        # Check if the module has categorized responses (for expert-level technical answers)
        if "categories" in module.data:
            for category in module.data["categories"]:
                if is_trigger_match(user_message, category["triggers"]):
                    reply = random.choice(category["answers"][lang])
                    break
            if reply:
                break
        # Fallback to flat trigger matching
        elif "triggers" in module.data and is_trigger_match(
            user_message, module.data["triggers"]
        ):
            reply = random.choice(module.data["answers"][lang])
            break

    # If no trigger matched, use fallback
    if not reply:
        reply = random.choice(fallback.data["answers"][lang])

    # Save user message to history in background (excluding assistant response)
    background_tasks.add_task(save_chat_interaction, request.message)

    return ChatResponse(reply=reply)


# Optional: Endpoint to retrieve history as mentioned in API.md
@app.get("/api/v1/chat/history")
async def get_chat_history():
    with Session(engine) as session:
        from sqlmodel import select, desc

        statement = select(ChatMessage).order_by(desc(ChatMessage.timestamp)).limit(50)
        results = session.exec(statement).all()
        return results
