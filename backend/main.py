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
from cache import get_cached_triggers

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
    # Pre-populate trigger cache
    get_cached_triggers()
    yield


# --- Models ---
from pydantic import BaseModel, Field


class ChatMessageBase(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., max_length=1000)
    language: str = Field("en", max_length=5)
    history: List[ChatMessageBase] = []


class ChatResponse(BaseModel):
    reply: str


class FeedbackRequest(BaseModel):
    user_message: str = Field(..., max_length=1000)
    assistant_reply: str = Field(..., max_length=5000)
    is_helpful: bool


# --- Global Cache logic moved to cache.py ---


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


def find_trigger_match(
    user_message: str, threshold: int = 85
) -> Optional[ChatTriggerResponse]:
    """
    Two-tier matching system for NLU.
    Tier 1: Exact lookup via Hash-Map (fast) or substring for multi-word.
    Tier 2: Fuzzy matching fallback (accurate but slower).
    """
    cached_triggers, flat_map = get_cached_triggers()
    user_message_lower = user_message.lower()

    matches = []

    # --- Tier 1: Exact Hash-Map & Substring ---
    # 1.1 Tokenized exact lookup
    tokens = re.findall(r"\b\w+\b", user_message_lower)
    for token in tokens:
        if token in flat_map:
            matches.append(flat_map[token])

    # 1.2 Multi-word substring matching (exact boundary)
    for t_text, item in flat_map.items():
        if " " in t_text and t_text in user_message_lower:
            if re.search(rf"\b{re.escape(t_text)}\b", user_message_lower):
                matches.append(item)

    if matches:
        # Return the one with the lowest ID (highest priority)
        return min(matches, key=lambda x: x.id)

    # --- Tier 2: Fuzzy Matching Fallback ---
    for item in cached_triggers:
        for trigger in item.triggers:
            trigger_lower = trigger.lower()
            # 2.1 token_set_ratio: handles keyword in sentence (exact tokens)
            score = fuzz.token_set_ratio(trigger_lower, user_message_lower)
            if score >= threshold:
                return item
            
            # 2.2 partial_ratio: handles typo-ed keyword in sentence
            # Only for triggers >= 4 chars to avoid false positives for very short words
            if len(trigger_lower) >= 4:
                score = fuzz.partial_ratio(trigger_lower, user_message_lower)
                if score >= threshold:
                    return item

    return None


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
    user_message = request.message
    lang = request.language if request.language in ["en", "es", "fr"] else "en"

    reply = None

    # Priority-based matching using the Two-Tier system
    matched_item = find_trigger_match(user_message)

    if matched_item:
        logger.info(
            f"Matched trigger: module={matched_item.module}, category={matched_item.category}"
        )
        answers = getattr(matched_item, f"answers_{lang}")
        if answers:
            reply = random.choice(answers)

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
async def get_chat_history(admin_token: str = Depends(verify_admin_password)):
    with Session(engine) as session:
        statement = select(ChatMessage).order_by(desc(ChatMessage.timestamp)).limit(50)
        results = session.exec(statement).all()
        return results
