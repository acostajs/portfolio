from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session
from database import get_session
from models import Experience, ExperienceCreate, ExperienceUpdate
from limiter import limiter

router = APIRouter(prefix="/experience", tags=["admin-experience"])


@router.post("", response_model=Experience)
@limiter.limit("10/minute")
async def create_experience(
    request: Request,
    exp_data: ExperienceCreate,
    session: Session = Depends(get_session),
):
    exp = Experience.model_validate(exp_data)
    session.add(exp)
    session.commit()
    session.refresh(exp)
    return exp


@router.put("/{exp_id}", response_model=Experience)
@limiter.limit("10/minute")
async def update_experience(
    request: Request,
    exp_id: int,
    exp_data: ExperienceUpdate,
    session: Session = Depends(get_session),
):
    exp = session.get(Experience, exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")

    # Update only provided fields
    data = exp_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(exp, key, value)

    session.add(exp)
    session.commit()
    session.refresh(exp)
    return exp


@router.delete("/{exp_id}")
@limiter.limit("10/minute")
async def delete_experience(
    request: Request,
    exp_id: int,
    session: Session = Depends(get_session),
):
    exp = session.get(Experience, exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    session.delete(exp)
    session.commit()
    return {"status": "success"}
