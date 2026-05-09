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

from fastapi import BackgroundTasks, FastAPI, Header, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import Session, select, desc

from config import settings
from database import create_db_and_tables, engine
from models import (
    ChatMessage,
    ChatFeedback,
    ChatbotResponseModel,
    BlogPostModel,
    PageContent,
)
from responses import fallback

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

    reply = None

    with Session(engine) as session:
        # Fetch all responses (in a real app, we might want to optimize this,
        # but for a portfolio it's fine to check them all or use a smarter query)
        statement = select(ChatbotResponseModel)
        db_responses = session.exec(statement).all()

        # Iterate through db responses and check for trigger matches
        for resp in db_responses:
            if is_trigger_match(user_message, resp.triggers):
                # Select correct language field
                answers = []
                if lang == "en":
                    answers = resp.answers_en
                elif lang == "es":
                    answers = resp.answers_es
                elif lang == "fr":
                    answers = resp.answers_fr

                if answers:
                    reply = random.choice(answers)
                    break

    # If no trigger matched, use fallback from the hardcoded module for now
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


# --- Auth ---
def verify_admin(x_admin_password: str = Header(None)):
    if x_admin_password != settings.ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin password")


# --- CMS Routes ---
@app.get("/api/v1/cms/chatbot", dependencies=[Depends(verify_admin)])
async def get_cms_chatbot():
    with Session(engine) as session:
        return session.exec(select(ChatbotResponseModel)).all()


@app.post("/api/v1/cms/chatbot", dependencies=[Depends(verify_admin)])
async def update_cms_chatbot(response: ChatbotResponseModel):
    with Session(engine) as session:
        if response.id:
            db_resp = session.get(ChatbotResponseModel, response.id)
            if db_resp:
                # Update existing
                for key, value in response.model_dump(exclude={"id"}).items():
                    setattr(db_resp, key, value)
                session.add(db_resp)
                session.commit()
                return {"status": "updated", "id": db_resp.id}

        # Create new
        session.add(response)
        session.commit()
        session.refresh(response)
        return {"status": "created", "id": response.id}


@app.get("/api/v1/cms/blog", dependencies=[Depends(verify_admin)])
async def get_cms_blog():
    with Session(engine) as session:
        return session.exec(select(BlogPostModel)).all()


@app.post("/api/v1/cms/blog", dependencies=[Depends(verify_admin)])
async def update_cms_blog(post: BlogPostModel):
    with Session(engine) as session:
        if post.id:
            db_post = session.get(BlogPostModel, post.id)
            if db_post:
                for key, value in post.model_dump(exclude={"id"}).items():
                    setattr(db_post, key, value)
                session.add(db_post)
                session.commit()
                return {"status": "updated", "id": db_post.id}

        session.add(post)
        session.commit()
        session.refresh(post)
        return {"status": "created", "id": post.id}


@app.get("/api/v1/cms/pages", dependencies=[Depends(verify_admin)])
async def get_cms_pages():
    with Session(engine) as session:
        return session.exec(select(PageContent)).all()


@app.post("/api/v1/cms/pages", dependencies=[Depends(verify_admin)])
async def update_cms_pages(content: PageContent):
    with Session(engine) as session:
        if content.id:
            db_content = session.get(PageContent, content.id)
            if db_content:
                for key, value in content.model_dump(exclude={"id"}).items():
                    setattr(db_content, key, value)
                session.add(db_content)
                session.commit()
                return {"status": "updated", "id": db_content.id}

        session.add(content)
        session.commit()
        session.refresh(content)
        return {"status": "created", "id": content.id}


# --- Public CMS Routes ---
@app.get("/api/v1/blog")
async def get_blog():
    with Session(engine) as session:
        return session.exec(
            select(BlogPostModel).order_by(desc(BlogPostModel.date))
        ).all()


# Optional: Endpoint to retrieve history as mentioned in API.md
@app.get("/api/v1/chat/history")
async def get_chat_history():
    with Session(engine) as session:
        statement = select(ChatMessage).order_by(desc(ChatMessage.timestamp)).limit(50)
        results = session.exec(statement).all()
        return results
