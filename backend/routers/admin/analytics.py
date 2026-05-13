from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, desc
from database import get_session
from models import ChatMessage, ChatFeedback
from auth import verify_admin_password

router = APIRouter(prefix="/analytics", tags=["admin-analytics"])


@router.get("/messages", response_model=List[ChatMessage])
async def get_analytics_messages(
    session: Session = Depends(get_session),
    admin_token: str = Depends(verify_admin_password),
):
    return session.exec(
        select(ChatMessage).order_by(desc(ChatMessage.timestamp)).limit(100)
    ).all()


@router.get("/feedback", response_model=List[ChatFeedback])
async def get_analytics_feedback(
    session: Session = Depends(get_session),
    admin_token: str = Depends(verify_admin_password),
):
    return session.exec(
        select(ChatFeedback).order_by(desc(ChatFeedback.timestamp)).limit(100)
    ).all()
