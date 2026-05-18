from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select
from database import get_session
from models import (
    ChatTriggerResponse,
    ChatTriggerResponseCreate,
    ChatTriggerResponseUpdate,
)
from cache import clear_trigger_cache
from limiter import limiter

router = APIRouter(prefix="/chat-triggers", tags=["admin-chat"])


# --- Chat Trigger CRUD ---
@router.get("", response_model=List[ChatTriggerResponse])
@limiter.limit("30/minute")
async def get_chat_triggers(request: Request, session: Session = Depends(get_session)):
    return session.exec(select(ChatTriggerResponse)).all()


@router.post("", response_model=ChatTriggerResponse)
@limiter.limit("10/minute")
async def create_chat_trigger(
    request: Request,
    trigger_data: ChatTriggerResponseCreate,
    session: Session = Depends(get_session),
):
    trigger = ChatTriggerResponse.model_validate(trigger_data)
    session.add(trigger)
    session.commit()
    session.refresh(trigger)
    clear_trigger_cache()
    return trigger


@router.put("/{trigger_id}", response_model=ChatTriggerResponse)
@limiter.limit("10/minute")
async def update_chat_trigger(
    request: Request,
    trigger_id: int,
    trigger_data: ChatTriggerResponseUpdate,
    session: Session = Depends(get_session),
):
    trigger = session.get(ChatTriggerResponse, trigger_id)
    if not trigger:
        raise HTTPException(status_code=404, detail="Chat trigger not found")

    # Update only provided fields
    data = trigger_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(trigger, key, value)

    session.add(trigger)
    session.commit()
    session.refresh(trigger)
    clear_trigger_cache()
    return trigger


@router.delete("/{trigger_id}")
@limiter.limit("10/minute")
async def delete_chat_trigger(
    request: Request,
    trigger_id: int,
    session: Session = Depends(get_session),
):
    trigger = session.get(ChatTriggerResponse, trigger_id)
    if not trigger:
        raise HTTPException(status_code=404, detail="Chat trigger not found")
    session.delete(trigger)
    session.commit()
    clear_trigger_cache()
    return {"status": "success"}
