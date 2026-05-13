from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import About
from auth import verify_admin_password

router = APIRouter(prefix="/about", tags=["admin-about"])


@router.get("", response_model=About)
async def get_about(session: Session = Depends(get_session)):
    about = session.exec(select(About)).first()
    if not about:
        raise HTTPException(status_code=404, detail="About content not found")
    return about


@router.post("", response_model=About)
async def create_or_update_about(
    about_data: About,
    session: Session = Depends(get_session),
    admin_token: str = Depends(verify_admin_password),
):
    existing = session.exec(select(About)).first()
    if existing:
        for key, value in about_data.model_dump(exclude={"id"}).items():
            setattr(existing, key, value)
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing
    else:
        session.add(about_data)
        session.commit()
        session.refresh(about_data)
        return about_data
