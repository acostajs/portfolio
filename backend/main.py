import logging
import random
import sys
import os
import re
from contextlib import asynccontextmanager
from typing import List, Optional

from rapidfuzz import fuzz

# Add the current directory to sys.path to ensure local imports work on Vercel
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import BackgroundTasks, FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import Session, select, desc, col

from config import settings
from database import create_db_and_tables, engine
from models import (
    ChatMessage,
    ChatFeedback,
    About,
    Experience,
    Project,
    BlogPost,
    ChatTriggerResponse,
)
from responses import fallback
from auth import verify_admin_password
import admin as admin_api
from seed import seed

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("backend")


# --- Lifecycle ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    create_db_and_tables()
    # Seed the database if empty
    seed()
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
app.include_router(admin_api.router)


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


# --- Public CMS Endpoints ---
@app.get("/api/v1/about", response_model=Optional[About])
async def get_public_about():
    with Session(engine) as session:
        return session.exec(select(About)).first()


@app.get("/api/v1/experience", response_model=List[Experience])
async def get_public_experience():
    with Session(engine) as session:
        return session.exec(select(Experience).order_by(col(Experience.order))).all()


@app.get("/api/v1/projects", response_model=List[Project])
async def get_public_projects():
    with Session(engine) as session:
        return session.exec(select(Project).order_by(col(Project.order))).all()


@app.get("/api/v1/blog", response_model=List[BlogPost])
async def get_public_blog():
    with Session(engine) as session:
        return session.exec(
            select(BlogPost).where(BlogPost.published).order_by(desc(BlogPost.date))
        ).all()


@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, background_tasks: BackgroundTasks):
    user_message = request.message.lower()
    lang = request.language if request.language in ["en", "es", "fr"] else "en"

    reply = None

    with Session(engine) as session:
        # Fetch all triggers from database, ordered by ID to maintain priority
        db_triggers = session.exec(
            select(ChatTriggerResponse).order_by(col(ChatTriggerResponse.id))
        ).all()

        # Priority-based matching
        for item in db_triggers:
            if is_trigger_match(user_message, item.triggers):
                logger.info(
                    f"Matched trigger: module={item.module}, category={item.category}"
                )
                answers = getattr(item, f"answers_{lang}")
                if answers:
                    reply = random.choice(answers)
                    break

    # If no trigger matched, use fallback
    if not reply:
        logger.info("No trigger matched, using fallback")
        reply = random.choice(fallback.data["answers"][lang])

    # Save user message to history in background
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
async def get_chat_history(password: str = Depends(verify_admin_password)):
    with Session(engine) as session:
        statement = select(ChatMessage).order_by(desc(ChatMessage.timestamp)).limit(50)
        results = session.exec(statement).all()
        return results
