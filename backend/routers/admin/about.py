from fastapi import APIRouter, Depends, Request
from sqlmodel import Session, select
from database import get_session
from models import About, AboutCreate
from limiter import limiter

router = APIRouter(prefix="/about", tags=["admin-about"])


@router.post("", response_model=About)
@limiter.limit("10/minute")
async def create_or_update_about(
    request: Request,
    about_data: AboutCreate,
    session: Session = Depends(get_session),
):
    existing = session.exec(select(About)).first()
    if existing:
        for key, value in about_data.model_dump().items():
            setattr(existing, key, value)
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing
    else:
        about = About.model_validate(about_data)
        session.add(about)
        session.commit()
        session.refresh(about)
        return about
