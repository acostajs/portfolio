import logging
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
                method=data.method
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
            timestamp=start_time
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
    # Mock AI logic
    user_message = request.message.lower()
    
    if "skill" in user_message or "tech" in user_message:
        reply = "Juan is proficient in TypeScript, React, Bun, FastAPI, and Python. He loves building full-stack applications!"
    elif "experience" in user_message or "work" in user_message:
        reply = "Juan has experience as a Full-Stack Developer, working on AI-driven portfolios and high-performance web apps."
    elif "contact" in user_message or "email" in user_message:
        reply = "You can contact Juan at acosta.juan@icloud.com or through the contact form on this site."
    else:
        reply = f"That's an interesting question about Juan! Currently, I'm a mock assistant, but I can tell you that he's a passionate developer based in Montréal."

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
