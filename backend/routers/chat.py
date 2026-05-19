import logging
import random
import re
import httpx
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, BackgroundTasks, Request
from sqlmodel import Session, select, desc
from rapidfuzz import fuzz

from config import settings
from database import get_session, engine
from models import (
    ChatMessage,
    ChatFeedback,
    ChatTriggerResponse,
    LiveChatSession,
    SessionMetadata,
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
    session_id: str = Field("unknown", max_length=100)
    page_id: Optional[str] = Field("home", max_length=50)
    history: List[ChatMessageBase] = []


class ChatResponse(BaseModel):
    reply: str
    module: Optional[str] = None
    category: Optional[str] = None
    is_live: bool = False


class LiveSyncResponse(BaseModel):
    messages: List[ChatMessage]
    is_active: bool


class FeedbackRequest(BaseModel):
    user_message: str = Field(..., max_length=2000)
    assistant_reply: str = Field(..., max_length=10000)
    is_helpful: bool
    module: Optional[str] = None
    category: Optional[str] = None


# --- Background Tasks ---
def save_chat_interaction(role: str, content: str, session_id: str = "unknown"):
    try:
        with Session(engine) as session:
            msg_entry = ChatMessage(role=role, content=content, session_id=session_id)
            session.add(msg_entry)
            session.commit()
            logger.info(f"Chat message ({role}) saved for session {session_id}")
    except Exception as e:
        logger.error(f"Failed to save chat interaction: {e}")


async def send_telegram_message(text: str):
    if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_CHAT_ID:
        logger.warning("Telegram credentials not configured, skipping relay")
        return

    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": settings.TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": "Markdown",
    }

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=payload, timeout=10.0)
            resp.raise_for_status()
            logger.info("Message relayed to Telegram")
    except Exception as e:
        logger.error(f"Failed to send Telegram message: {e}")


async def notify_telegram_live_chat(session_id: str, status: str = "started"):
    msg = f"🔔 *Live Chat {status}*\nSession ID: `{session_id}`\n\nReply to any message from this user to chat back."
    if status == "closed":
        msg = f"📴 *Live Chat closed*\nSession ID: `{session_id}`"

    await send_telegram_message(msg)


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


@router.get("/hints", response_model=List[str])
async def get_chat_hints(page_id: str = "home", lang: str = "en"):
    """Returns proactive NLU hints based on the current page."""
    lang = lang if lang in ["en", "es", "fr"] else "en"

    # Map PageId to relevant modules
    page_map = {
        "home": ["greetings", "about", "technical_core"],
        "about": ["about", "fun"],
        "experience": ["experience", "hr_assessment"],
        "projects": ["projects", "technical_backend", "technical_frontend"],
        "blog": ["technical_core", "fun"],
        "contact": ["contact", "thanks"],
    }

    target_modules = page_map.get(page_id, page_map["home"])

    # Fetch triggers for these modules from cache
    cached_triggers, _ = get_cached_triggers()

    relevant_triggers = [t for t in cached_triggers if t.module in target_modules]

    if not relevant_triggers:
        # Fallback to some high-value generic ones for recruiters
        return [
            "View project architecture deep-dives"
            if lang == "en"
            else "Ver análisis profundo de arquitectura"
            if lang == "es"
            else "Voir les analyses d'architecture",
            "Discuss a specific full-stack role"
            if lang == "en"
            else "Discutir una posición full-stack"
            if lang == "es"
            else "Discuter d'un poste full-stack",
            "Get availability for a technical interview"
            if lang == "en"
            else "Ver disponibilidad para entrevista"
            if lang == "es"
            else "Voir la disponibilité pour entretien",
        ]

    # Pick 3 random triggers (from the list of all triggers in the relevant items)
    all_triggers = []
    for item in relevant_triggers:
        # We prefer shorter triggers for chips
        all_triggers.extend([t for t in item.triggers if len(t) < 40])

    if len(all_triggers) < 3:
        # Just return what we have
        return all_triggers

    return random.sample(all_triggers, 3)


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
):
    user_message = request.message
    lang = request.language if request.language in ["en", "es", "fr"] else "en"
    session_id = request.session_id
    page_id = request.page_id or "home"

    # --- Session & Metadata Logic ---
    # Find or create session record
    stmt = select(LiveChatSession).where(LiveChatSession.session_id == session_id)
    chat_session = session.exec(stmt).first()

    if not chat_session:
        chat_session = LiveChatSession(session_id=session_id, is_active=False)
        session.add(chat_session)

    # Update Metadata
    current_metadata = chat_session.session_metadata or {}
    structured_metadata = SessionMetadata(**current_metadata)

    if page_id not in structured_metadata.visited_pages:
        structured_metadata.visited_pages.append(page_id)

    structured_metadata.last_interaction = datetime.now(timezone.utc).isoformat()
    structured_metadata.interaction_count += 1

    chat_session.session_metadata = structured_metadata.model_dump()
    chat_session.updated_at = datetime.now(timezone.utc)
    session.add(chat_session)
    session.commit()

    reply = None
    module = None
    category = None

    # Check for live chat commands
    if user_message.strip().lower() == "/live-chat":
        if not chat_session.is_active:
            chat_session.is_active = True
            session.add(chat_session)
            session.commit()
            background_tasks.add_task(notify_telegram_live_chat, session_id, "started")

        reply = (
            "Live chat requested! I'm notifying the developer. Please wait a moment..."
            if lang == "en"
            else "¡Chat en vivo solicitado! Estoy notificando al desarrollador. Por favor, espera un momento..."
            if lang == "es"
            else "Chat en direct demandé ! J'en informe le développeur. Veuillez patienter un instant..."
        )
        module = "live_chat"
        background_tasks.add_task(
            save_chat_interaction, "user", user_message, session_id
        )
        background_tasks.add_task(save_chat_interaction, "assistant", reply, session_id)
        return ChatResponse(reply=reply, module=module, is_live=True)

    if user_message.strip().lower() == "/close-live-chat":
        if chat_session.is_active:
            chat_session.is_active = False
            session.add(chat_session)
            session.commit()
            background_tasks.add_task(notify_telegram_live_chat, session_id, "closed")

        reply = (
            "Live chat closed. I'm back to being your AI assistant!"
            if lang == "en"
            else "Chat en vivo cerrado. ¡Vuelvo a ser tu asistente de IA!"
            if lang == "es"
            else "Chat en direct fermé. Je redeviens votre assistant IA !"
        )
        module = "live_chat"
        background_tasks.add_task(
            save_chat_interaction, "user", user_message, session_id
        )
        background_tasks.add_task(save_chat_interaction, "assistant", reply, session_id)
        return ChatResponse(reply=reply, module=module, is_live=False)

    # Check if session is in live mode
    if chat_session.is_active:
        # Relay to Telegram
        background_tasks.add_task(
            send_telegram_message, f"💬 *Message from {session_id}*:\n{user_message}"
        )
        background_tasks.add_task(
            save_chat_interaction, "user", user_message, session_id
        )
        # We don't return a reply here yet, as the developer will reply later
        # But we must return something to the frontend
        return ChatResponse(reply="", module="live_chat", is_live=True)

    # --- Regular AI Persona Logic ---

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
    background_tasks.add_task(save_chat_interaction, "user", user_message, session_id)
    # Save assistant reply to history in background
    background_tasks.add_task(save_chat_interaction, "assistant", reply, session_id)

    return ChatResponse(reply=reply, module=module, category=category, is_live=False)


@router.get("/sync/{session_id}", response_model=LiveSyncResponse)
async def sync_chat(session_id: str, db: Session = Depends(get_session)):
    # Get active status
    stmt_session = select(LiveChatSession).where(
        LiveChatSession.session_id == session_id, LiveChatSession.is_active
    )
    active_session = db.exec(stmt_session).first()

    # Get last 10 messages for this session
    stmt_msgs = (
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(desc(ChatMessage.timestamp))
        .limit(20)
    )
    results = db.exec(stmt_msgs).all()

    return LiveSyncResponse(
        messages=list(reversed(results)), is_active=bool(active_session)
    )


@router.post("/telegram-webhook")
async def telegram_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_session),
):
    """
    Handles incoming messages from Telegram.
    For simplicity, we assume any reply is for the LAST active live session.
    A more robust version would use message mapping or thread IDs.
    """
    # Security: Verify Secret Token if configured
    if settings.TELEGRAM_SECRET_TOKEN:
        secret_header = request.headers.get("X-Telegram-Bot-Api-Secret-Token")
        if secret_header != settings.TELEGRAM_SECRET_TOKEN:
            logger.warning(
                "Unauthorized Telegram webhook attempt (invalid secret token)"
            )
            return {"status": "unauthorized"}

    data = await request.json()
    logger.info(f"Received Telegram webhook: {data}")

    if "message" not in data:
        return {"status": "ignored"}

    msg = data["message"]
    text = msg.get("text")
    if not text:
        return {"status": "no text"}

    # Find the most recently updated active session
    stmt = (
        select(LiveChatSession)
        .where(LiveChatSession.is_active)
        .order_by(desc(LiveChatSession.updated_at))
    )
    active_session = db.exec(stmt).first()

    if not active_session:
        logger.warning("Telegram message received but no active live session found")
        return {"status": "no active session"}

    # Save as assistant message for that session
    background_tasks.add_task(
        save_chat_interaction, "assistant", text, active_session.session_id
    )

    # Update session's updated_at
    active_session.updated_at = datetime.now(timezone.utc)
    db.add(active_session)
    db.commit()

    return {"status": "success"}


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
