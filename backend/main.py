import logging
import random
import sys
import os
import re
from contextlib import asynccontextmanager
from typing import List

from rapidfuzz import fuzz

# Add the current directory to sys.path to ensure local imports work on Vercel
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import BackgroundTasks, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import Session, select, desc

from config import settings
from database import create_db_and_tables, engine
from models import ChatMessage, ChatFeedback
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
class ChatMessageBase(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    history: List[ChatMessageBase] = []


class ChatResponse(BaseModel):
    reply: str


class FeedbackRequest(BaseModel):
    user_message: str
    assistant_reply: str
    is_helpful: bool


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


def save_chat_feedback(user_msg: str, assistant_reply: str, is_helpful: bool):
    try:
        with Session(engine) as session:
            feedback_entry = ChatFeedback(
                user_message=user_msg,
                assistant_reply=assistant_reply,
                is_helpful=is_helpful,
            )
            session.add(feedback_entry)
            session.commit()
            logger.info(f"Chat feedback saved: {is_helpful}")
    except Exception as e:
        logger.error(f"Failed to save chat feedback: {e}")


def is_trigger_match(
    user_message: str, triggers: List[str], threshold: int = 85
) -> bool:
    """Helper to check if any trigger matches the user message with fuzzy matching."""
    user_message = user_message.lower()

    # 1. Priority: Exact word/phrase match with word boundaries
    for trigger in triggers:
        pattern = rf"\b{re.escape(trigger.lower())}\b"
        if re.search(pattern, user_message):
            return True

    # 2. Secondary: Fuzzy matching to handle typos and varied phrasing
    for trigger in triggers:
        # token_set_ratio is excellent for checking if a trigger (even a multi-word one)
        # exists within a larger sentence, ignoring order and extra words.
        score = fuzz.token_set_ratio(trigger.lower(), user_message)
        if score >= threshold:
            return True

    return False


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

    # List of response modules to check against in priority order (Specific -> General)
    response_modules = [
        technical_core,
        technical_frontend,
        technical_backend,
        technical_devops,
        technical_behavioral,
        hr_assessment,
        experience,
        projects,
        contact,
        greetings,
        thanks,
        about,
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


@app.post("/api/v1/chat/feedback")
async def chat_feedback(request: FeedbackRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(
        save_chat_feedback,
        request.user_message,
        request.assistant_reply,
        request.is_helpful,
    )
    return {"status": "success"}


# Optional: Endpoint to retrieve history as mentioned in API.md
@app.get("/api/v1/chat/history")
async def get_chat_history():
    with Session(engine) as session:
        statement = select(ChatMessage).order_by(desc(ChatMessage.timestamp)).limit(50)
        results = session.exec(statement).all()
        return results
