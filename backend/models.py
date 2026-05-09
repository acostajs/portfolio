from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import Field, SQLModel, Column, JSON


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


class PageContent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    section: str = Field(index=True)  # e.g., "about", "contact"
    key: str = Field(index=True)  # e.g., "p1", "title"
    en: str
    es: str
    fr: str


class ChatbotResponseModel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    module: str = Field(index=True)  # e.g., "about", "technical_core"
    category: Optional[str] = None  # For categorized responses
    triggers: List[str] = Field(default=[], sa_column=Column(JSON))
    answers_en: List[str] = Field(default=[], sa_column=Column(JSON))
    answers_es: List[str] = Field(default=[], sa_column=Column(JSON))
    answers_fr: List[str] = Field(default=[], sa_column=Column(JSON))


class BlogPostModel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(index=True, unique=True)
    date: str
    category: str
    title_en: str
    title_es: str
    title_fr: str
    excerpt_en: str
    excerpt_es: str
    excerpt_fr: str
    content_en: str
    content_es: str
    content_fr: str
