import logging
from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, desc, col
from database import get_session
from models import About, Experience, Project, BlogPost

# Re-import these from main if we don't move them elsewhere, but they are needed for Chat
# For now, I'll keep them in main or move them to a shared utils if they grow.
# Actually, they are in main.py. I'll need to import them.

logger = logging.getLogger("backend")

router = APIRouter(prefix="/api/v1", tags=["public"])


@router.get("/about", response_model=Optional[About])
async def get_public_about(session: Session = Depends(get_session)):
    return session.exec(select(About)).first()


@router.get("/experience", response_model=List[Experience])
async def get_public_experience(session: Session = Depends(get_session)):
    return session.exec(select(Experience).order_by(col(Experience.order))).all()


@router.get("/projects", response_model=List[Project])
async def get_public_projects(session: Session = Depends(get_session)):
    return session.exec(select(Project).order_by(col(Project.order))).all()


@router.get("/blog", response_model=List[BlogPost])
async def get_public_blog(session: Session = Depends(get_session)):
    return session.exec(
        select(BlogPost).where(BlogPost.published).order_by(desc(BlogPost.date))
    ).all()


# Note: /chat, /chat/feedback, /chat/history involve more logic (NLU, background tasks).
# I'll move them as well, but I need to ensure find_trigger_match and background tasks are accessible.
