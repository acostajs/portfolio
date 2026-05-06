import logging
import random
import time
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import BackgroundTasks, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import Session

from config import settings
from database import create_db_and_tables, engine
from models import VisitorSession, ChatMessage
from responses import about, experience, projects, contact, fallback

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


def save_chat_interaction(user_msg: str, bot_msg: str):
    try:
        with Session(engine) as session:
            # We don't have a session_id linked yet in this simple mock
            # but we can log them.
            user_entry = ChatMessage(role="user", content=user_msg)
            bot_entry = ChatMessage(role="assistant", content=bot_msg)
            session.add(user_entry)
            session.add(bot_entry)
            session.commit()
            logger.info("Chat interaction saved to database")
    except Exception as e:
        logger.error(f"Failed to save chat interaction: {e}")


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

    # Determine response based on triggers
    if any(t in user_message for t in about.data["triggers"]):
        reply = random.choice(about.data["answers"])
    elif any(t in user_message for t in experience.data["triggers"]):
        reply = random.choice(experience.data["answers"])
    elif any(t in user_message for t in projects.data["triggers"]):
        reply = random.choice(projects.data["answers"])
    elif any(t in user_message for t in contact.data["triggers"]):
        reply = random.choice(contact.data["answers"])
    else:
        reply = random.choice(fallback.data["answers"])

    # Save to history in background
    background_tasks.add_task(save_chat_interaction, request.message, reply)

    return ChatResponse(reply=reply)


# Optional: Endpoint to retrieve history as mentioned in API.md
@app.get("/api/v1/chat/history")
async def get_chat_history():
    with Session(engine) as session:
        from sqlmodel import select

        statement = select(ChatMessage).order_by(ChatMessage.timestamp.desc()).limit(50)
        results = session.exec(statement).all()
        return results
