from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from database import get_session
from models import Experience

router = APIRouter(prefix="/experience", tags=["admin-experience"])


@router.post("", response_model=Experience)
async def create_experience(
    exp: Experience,
    session: Session = Depends(get_session),
):
    session.add(exp)
    session.commit()
    session.refresh(exp)
    return exp


@router.put("/{exp_id}", response_model=Experience)
async def update_experience(
    exp_id: int,
    exp_data: Experience,
    session: Session = Depends(get_session),
):
    exp = session.get(Experience, exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    for key, value in exp_data.model_dump(exclude={"id"}).items():
        setattr(exp, key, value)
    session.add(exp)
    session.commit()
    session.refresh(exp)
    return exp


@router.delete("/{exp_id}")
async def delete_experience(
    exp_id: int,
    session: Session = Depends(get_session),
):
    exp = session.get(Experience, exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    session.delete(exp)
    session.commit()
    return {"status": "success"}
