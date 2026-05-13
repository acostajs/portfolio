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
    module: Optional[str] = None
    category: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class About(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    p1_en: str = Field(default="")
    p1_es: str = Field(default="")
    p1_fr: str = Field(default="")
    p2_en: str = Field(default="")
    p2_es: str = Field(default="")
    p2_fr: str = Field(default="")
    skills: List[str] = Field(default=[], sa_column=Column(JSON))


class Experience(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company: str
    role: str
    period: str
    description_en: List[str] = Field(default=[], sa_column=Column(JSON))
    description_es: List[str] = Field(default=[], sa_column=Column(JSON))
    description_fr: List[str] = Field(default=[], sa_column=Column(JSON))
    tech: List[str] = Field(default=[], sa_column=Column(JSON))
    order: int = Field(default=0)


class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description_en: str = Field(default="")
    description_es: str = Field(default="")
    description_fr: str = Field(default="")
    tech: List[str] = Field(default=[], sa_column=Column(JSON))
    link: Optional[str] = None
    github: Optional[str] = None
    image: Optional[str] = None
    order: int = Field(default=0)


class BlogPost(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(index=True, unique=True)
    date: str
    category: str
    title_en: str = Field(default="")
    title_es: str = Field(default="")
    title_fr: str = Field(default="")
    excerpt_en: str = Field(default="")
    excerpt_es: str = Field(default="")
    excerpt_fr: str = Field(default="")
    content_en: str = Field(default="")
    content_es: str = Field(default="")
    content_fr: str = Field(default="")
    published: bool = Field(default=True)


class ChatTriggerResponse(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    module: str = Field(index=True)  # e.g., "greetings", "technical_frontend"
    category: Optional[str] = None  # e.g., "React", "Vue"
    triggers: List[str] = Field(default=[], sa_column=Column(JSON))
    answers_en: List[str] = Field(default=[], sa_column=Column(JSON))
    answers_es: List[str] = Field(default=[], sa_column=Column(JSON))
    answers_fr: List[str] = Field(default=[], sa_column=Column(JSON))
