from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, desc
from database import get_session
from models import BlogPost
from auth import verify_admin_password

router = APIRouter(prefix="/blog", tags=["admin-blog"])


@router.get("", response_model=List[BlogPost])
async def get_blog_posts(session: Session = Depends(get_session)):
    return session.exec(select(BlogPost).order_by(desc(BlogPost.date))).all()


@router.post("", response_model=BlogPost)
async def create_blog_post(
    post: BlogPost,
    session: Session = Depends(get_session),
    admin_token: str = Depends(verify_admin_password),
):
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@router.put("/{post_id}", response_model=BlogPost)
async def update_blog_post(
    post_id: int,
    post_data: BlogPost,
    session: Session = Depends(get_session),
    admin_token: str = Depends(verify_admin_password),
):
    post = session.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    for key, value in post_data.model_dump(exclude={"id"}).items():
        setattr(post, key, value)
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@router.delete("/{post_id}")
async def delete_blog_post(
    post_id: int,
    session: Session = Depends(get_session),
    admin_token: str = Depends(verify_admin_password),
):
    post = session.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    session.delete(post)
    session.commit()
    return {"status": "success"}
