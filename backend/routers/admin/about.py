from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import About

router = APIRouter(prefix="/about", tags=["admin-about"])


@router.post("", response_model=About)
async def create_or_update_about(
    about_data: About,
    session: Session = Depends(get_session),
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
