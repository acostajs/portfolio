from typing import List
from fastapi import APIRouter, Depends, Request
from sqlmodel import Session, select, desc
from database import get_session
from models import ChatMessage, ChatFeedback
from limiter import limiter

router = APIRouter(prefix="/analytics", tags=["admin-analytics"])


@router.get("/messages", response_model=List[ChatMessage])
@limiter.limit("30/minute")
async def get_analytics_messages(
    request: Request,
    session: Session = Depends(get_session),
):
    return session.exec(
        select(ChatMessage).order_by(desc(ChatMessage.timestamp)).limit(100)
    ).all()


@router.get("/feedback", response_model=List[ChatFeedback])
@limiter.limit("30/minute")
async def get_analytics_feedback(
    request: Request,
    session: Session = Depends(get_session),
):
    return session.exec(
        select(ChatFeedback).order_by(desc(ChatFeedback.timestamp)).limit(100)
    ).all()
