from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel, create_engine, Session

class VisitorSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ip: str
    user_agent: Optional[str] = None
    path: str
    method: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: Optional[int] = Field(default=None, foreign_key="visitorsession.id")
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
