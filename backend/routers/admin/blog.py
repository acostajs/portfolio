from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select, desc
from database import get_session
from models import BlogPost, BlogPostCreate, BlogPostUpdate
from limiter import limiter

router = APIRouter(prefix="/blog", tags=["admin-blog"])


@router.get("", response_model=List[BlogPost])
@limiter.limit("30/minute")
async def get_blog_posts(request: Request, session: Session = Depends(get_session)):
    return session.exec(select(BlogPost).order_by(desc(BlogPost.date))).all()


@router.post("", response_model=BlogPost)
@limiter.limit("10/minute")
async def create_blog_post(
    request: Request,
    post_data: BlogPostCreate,
    session: Session = Depends(get_session),
):
    post = BlogPost.model_validate(post_data)
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@router.put("/{post_id}", response_model=BlogPost)
@limiter.limit("10/minute")
async def update_blog_post(
    request: Request,
    post_id: int,
    post_data: BlogPostUpdate,
    session: Session = Depends(get_session),
):
    post = session.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")

    # Update only provided fields
    data = post_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(post, key, value)

    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@router.delete("/{post_id}")
@limiter.limit("10/minute")
async def delete_blog_post(
    request: Request,
    post_id: int,
    session: Session = Depends(get_session),
):
    post = session.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    session.delete(post)
    session.commit()
    return {"status": "success"}
