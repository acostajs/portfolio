import logging
import random
import re
from typing import List, Optional
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlmodel import Session, select, desc
from rapidfuzz import fuzz

from database import get_session, engine
from models import (
    ChatMessage,
    ChatFeedback,
    ChatTriggerResponse,
)
from responses import fallback
from auth import verify_admin_password
from cache import get_cached_triggers
from pydantic import BaseModel, Field

logger = logging.getLogger("backend")

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])

# --- Models ---


class ChatMessageBase(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., max_length=1000)
    language: str = Field("en", max_length=5)
    history: List[ChatMessageBase] = []


class ChatResponse(BaseModel):
    reply: str
    module: Optional[str] = None
    category: Optional[str] = None


class FeedbackRequest(BaseModel):
    user_message: str = Field(..., max_length=2000)
    assistant_reply: str = Field(..., max_length=10000)
    is_helpful: bool
    module: Optional[str] = None
    category: Optional[str] = None


# --- Background Tasks ---
def save_chat_interaction(role: str, content: str):
    try:
        with Session(engine) as session:
            msg_entry = ChatMessage(role=role, content=content)
            session.add(msg_entry)
            session.commit()
            logger.info(f"Chat message ({role}) saved to database")
    except Exception as e:
        logger.error(f"Failed to save chat interaction: {e}")


def save_chat_feedback(
    user_msg: str,
    assistant_reply: str,
    is_helpful: bool,
    module: Optional[str] = None,
    category: Optional[str] = None,
):
    try:
        with Session(engine) as session:
            feedback_entry = ChatFeedback(
                user_message=user_msg,
                assistant_reply=assistant_reply,
                is_helpful=is_helpful,
                module=module,
                category=category,
            )
            session.add(feedback_entry)
            session.commit()
            logger.info(f"Chat feedback saved: {is_helpful} (module={module})")
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
        # Return the one with the highest priority (lowest id as tie-breaker)
        return min(matches, key=lambda x: (-x.priority, x.id))

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


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest, background_tasks: BackgroundTasks):
    user_message = request.message
    lang = request.language if request.language in ["en", "es", "fr"] else "en"

    reply = None
    module = None
    category = None

    # Priority-based matching using the Two-Tier system
    matched_item = find_trigger_match(user_message)

    if matched_item:
        logger.info(
            f"Matched trigger: module={matched_item.module}, category={matched_item.category}"
        )
        module = matched_item.module
        category = matched_item.category
        answers = getattr(matched_item, f"answers_{lang}")
        if answers:
            reply = random.choice(answers)  # nosec

    # If no trigger matched, use fallback
    if not reply:
        logger.info("No trigger matched, using fallback")
        reply = random.choice(fallback.data["answers"][lang])  # nosec
        module = "fallback"

    # Save user message to history in background
    background_tasks.add_task(save_chat_interaction, "user", user_message)
    # Save assistant reply to history in background
    background_tasks.add_task(save_chat_interaction, "assistant", reply)

    return ChatResponse(reply=reply, module=module, category=category)


@router.post("/feedback")
async def chat_feedback(request: FeedbackRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(
        save_chat_feedback,
        request.user_message,
        request.assistant_reply,
        request.is_helpful,
        request.module,
        request.category,
    )
    return {"status": "success"}


@router.get("/history")
async def get_chat_history(
    session: Session = Depends(get_session),
    admin_token: str = Depends(verify_admin_password),
):
    statement = select(ChatMessage).order_by(desc(ChatMessage.timestamp)).limit(50)
    results = session.exec(statement).all()
    return results
