from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import ChatTriggerResponse
from auth import verify_admin_password
from cache import clear_trigger_cache

router = APIRouter(prefix="/chat-triggers", tags=["admin-chat"])


# --- Chat Trigger CRUD ---
@router.get("", response_model=List[ChatTriggerResponse])
async def get_chat_triggers(session: Session = Depends(get_session)):
    return session.exec(select(ChatTriggerResponse)).all()


@router.post("", response_model=ChatTriggerResponse)
async def create_chat_trigger(
    trigger: ChatTriggerResponse,
    session: Session = Depends(get_session),
    admin_token: str = Depends(verify_admin_password),
):
    session.add(trigger)
    session.commit()
    session.refresh(trigger)
    clear_trigger_cache()
    return trigger


@router.put("/{trigger_id}", response_model=ChatTriggerResponse)
async def update_chat_trigger(
    trigger_id: int,
    trigger_data: ChatTriggerResponse,
    session: Session = Depends(get_session),
    admin_token: str = Depends(verify_admin_password),
):
    trigger = session.get(ChatTriggerResponse, trigger_id)
    if not trigger:
        raise HTTPException(status_code=404, detail="Chat trigger not found")
    for key, value in trigger_data.model_dump(exclude={"id"}).items():
        setattr(trigger, key, value)
    session.add(trigger)
    session.commit()
    session.refresh(trigger)
    clear_trigger_cache()
    return trigger


@router.delete("/{trigger_id}")
async def delete_chat_trigger(
    trigger_id: int,
    session: Session = Depends(get_session),
    admin_token: str = Depends(verify_admin_password),
):
    trigger = session.get(ChatTriggerResponse, trigger_id)
    if not trigger:
        raise HTTPException(status_code=404, detail="Chat trigger not found")
    session.delete(trigger)
    session.commit()
    clear_trigger_cache()
    return {"status": "success"}
