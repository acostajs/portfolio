from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, SQLModel


class ChatMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ChatFeedback(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_message: str
    assistant_reply: str
    is_helpful: bool
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
