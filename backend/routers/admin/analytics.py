from typing import List
from fastapi import APIRouter, Depends, Request
from sqlmodel import Session, select, desc, func, col
from database import get_session
from models import ChatMessage, ChatFeedback, VisitorLog, LiveChatSession
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


@router.get("/visitors", response_model=List[VisitorLog])
@limiter.limit("30/minute")
async def get_analytics_visitors(
    request: Request,
    session: Session = Depends(get_session),
):
    return session.exec(
        select(VisitorLog).order_by(desc(VisitorLog.timestamp)).limit(200)
    ).all()


@router.get("/summary")
@limiter.limit("30/minute")
async def get_analytics_summary(
    request: Request,
    session: Session = Depends(get_session),
):
    """Returns aggregated stats for the dashboard."""
    total_visitors = session.exec(select(func.count(col(VisitorLog.id)))).one()
    unique_ips = session.exec(
        select(func.count(func.distinct(col(VisitorLog.ip_hash))))
    ).one()
    total_sessions = session.exec(select(func.count(col(LiveChatSession.id)))).one()

    # Popular pages
    popular_pages = session.exec(
        select(col(VisitorLog.path), func.count(col(VisitorLog.id)))
        .group_by(col(VisitorLog.path))
        .order_by(desc(func.count(col(VisitorLog.id))))
        .limit(5)
    ).all()

    return {
        "total_visitors": total_visitors,
        "unique_visitors": unique_ips,
        "total_sessions": total_sessions,
        "popular_pages": [{"path": p[0], "count": p[1]} for p in popular_pages],
    }
