from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from sqlmodel import Field, SQLModel, Column, JSON


class SessionMetadata(BaseModel):
    visited_pages: List[str] = []
    last_interaction: Optional[str] = None
    interaction_count: int = 0


class ChatMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: str = Field(index=True, default="legacy")
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LiveChatSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: str = Field(index=True, unique=True)
    is_active: bool = Field(default=True)
    session_metadata: Dict[str, Any] = Field(
        default_factory=dict, sa_column=Column(JSON)
    )
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ChatFeedback(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_message: str
    assistant_reply: str
    is_helpful: bool
    module: Optional[str] = None
    category: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class VisitorLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    path: str = Field(index=True)
    method: str
    locale: str = Field(default="en")
    user_agent: Optional[str] = None
    referrer: Optional[str] = None
    ip_hash: str = Field(index=True)  # SHA-256 hash of the IP for privacy
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# --- About ---
class AboutBase(SQLModel):
    p1_en: str = Field(default="")
    p1_es: str = Field(default="")
    p1_fr: str = Field(default="")
    p2_en: str = Field(default="")
    p2_es: str = Field(default="")
    p2_fr: str = Field(default="")
    skills: List[str] = Field(default=[], sa_column=Column(JSON))


class AboutCreate(AboutBase):
    pass


class AboutUpdate(SQLModel):
    p1_en: Optional[str] = None
    p1_es: Optional[str] = None
    p1_fr: Optional[str] = None
    p2_en: Optional[str] = None
    p2_es: Optional[str] = None
    p2_fr: Optional[str] = None
    skills: Optional[List[str]] = None


class About(AboutBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


# --- Experience ---
class ExperienceBase(SQLModel):
    company: str
    role: str
    period: str
    description_en: List[str] = Field(default=[], sa_column=Column(JSON))
    description_es: List[str] = Field(default=[], sa_column=Column(JSON))
    description_fr: List[str] = Field(default=[], sa_column=Column(JSON))
    tech: List[str] = Field(default=[], sa_column=Column(JSON))
    order: int = Field(default=0)


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(SQLModel):
    company: Optional[str] = None
    role: Optional[str] = None
    period: Optional[str] = None
    description_en: Optional[List[str]] = None
    description_es: Optional[List[str]] = None
    description_fr: Optional[List[str]] = None
    tech: Optional[List[str]] = None
    order: Optional[int] = None


class Experience(ExperienceBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


# --- Project ---
class ProjectBase(SQLModel):
    title: str
    description_en: str = Field(default="")
    description_es: str = Field(default="")
    description_fr: str = Field(default="")
    tech: List[str] = Field(default=[], sa_column=Column(JSON))
    link: Optional[str] = None
    github: Optional[str] = None
    image: Optional[str] = None
    order: int = Field(default=0)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(SQLModel):
    title: Optional[str] = None
    description_en: Optional[str] = None
    description_es: Optional[str] = None
    description_fr: Optional[str] = None
    tech: Optional[List[str]] = None
    link: Optional[str] = None
    github: Optional[str] = None
    image: Optional[str] = None
    order: Optional[int] = None


class Project(ProjectBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


# --- BlogPost ---
class BlogPostBase(SQLModel):
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


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(SQLModel):
    slug: Optional[str] = None
    date: Optional[str] = None
    category: Optional[str] = None
    title_en: Optional[str] = None
    title_es: Optional[str] = None
    title_fr: Optional[str] = None
    excerpt_en: Optional[str] = None
    excerpt_es: Optional[str] = None
    excerpt_fr: Optional[str] = None
    content_en: Optional[str] = None
    content_es: Optional[str] = None
    content_fr: Optional[str] = None
    published: Optional[bool] = None


class BlogPost(BlogPostBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


# --- ChatTriggerResponse ---
class ChatTriggerResponseBase(SQLModel):
    module: str = Field(index=True)  # e.g., "greetings", "technical_backend"
    category: Optional[str] = None  # e.g., "React", "Vue"
    priority: int = Field(default=0)  # Manual override control
    triggers: List[str] = Field(default=[], sa_column=Column(JSON))
    answers_en: List[str] = Field(default=[], sa_column=Column(JSON))
    answers_es: List[str] = Field(default=[], sa_column=Column(JSON))
    answers_fr: List[str] = Field(default=[], sa_column=Column(JSON))


class ChatTriggerResponseCreate(ChatTriggerResponseBase):
    pass


class ChatTriggerResponseUpdate(SQLModel):
    module: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[int] = None
    triggers: Optional[List[str]] = None
    answers_en: Optional[List[str]] = None
    answers_es: Optional[List[str]] = None
    answers_fr: Optional[List[str]] = None


class ChatTriggerResponse(ChatTriggerResponseBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
