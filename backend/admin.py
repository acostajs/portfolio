from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import Session, select, desc, col
import os
import shutil
import re
from typing import List
from database import engine
from models import (
    About,
    Experience,
    Project,
    BlogPost,
    ChatTriggerResponse,
    ChatMessage,
    ChatFeedback,
)
from auth import verify_admin_password

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])


@router.get("/verify")
async def verify_admin(admin_token: str = Depends(verify_admin_password)):
    return {"status": "authenticated"}


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[-\s]+", "-", text).strip("-")


# --- About CRUD ---
@router.get("/about", response_model=About)
async def get_about():
    with Session(engine) as session:
        about = session.exec(select(About)).first()
        if not about:
            raise HTTPException(status_code=404, detail="About content not found")
        return about


@router.post("/about", response_model=About)
async def create_or_update_about(
    about_data: About, admin_token: str = Depends(verify_admin_password)
):
    with Session(engine) as session:
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


# --- Experience CRUD ---
@router.get("/experience", response_model=List[Experience])
async def get_experience():
    with Session(engine) as session:
        return session.exec(select(Experience).order_by(col(Experience.order))).all()


@router.post("/experience", response_model=Experience)
async def create_experience(
    exp: Experience, admin_token: str = Depends(verify_admin_password)
):
    with Session(engine) as session:
        session.add(exp)
        session.commit()
        session.refresh(exp)
        return exp


@router.put("/experience/{exp_id}", response_model=Experience)
async def update_experience(
    exp_id: int, exp_data: Experience, admin_token: str = Depends(verify_admin_password)
):
    with Session(engine) as session:
        exp = session.get(Experience, exp_id)
        if not exp:
            raise HTTPException(status_code=404, detail="Experience not found")
        for key, value in exp_data.model_dump(exclude={"id"}).items():
            setattr(exp, key, value)
        session.add(exp)
        session.commit()
        session.refresh(exp)
        return exp


@router.delete("/experience/{exp_id}")
async def delete_experience(
    exp_id: int, admin_token: str = Depends(verify_admin_password)
):
    with Session(engine) as session:
        exp = session.get(Experience, exp_id)
        if not exp:
            raise HTTPException(status_code=404, detail="Experience not found")
        session.delete(exp)
        session.commit()
        return {"status": "success"}


# --- Project CRUD ---
@router.get("/projects", response_model=List[Project])
async def get_projects():
    with Session(engine) as session:
        return session.exec(select(Project).order_by(col(Project.order))).all()


@router.post("/projects", response_model=Project)
async def create_project(
    project: Project, admin_token: str = Depends(verify_admin_password)
):
    with Session(engine) as session:
        session.add(project)
        session.commit()
        session.refresh(project)
        return project


@router.put("/projects/{project_id}", response_model=Project)
async def update_project(
    project_id: int,
    project_data: Project,
    admin_token: str = Depends(verify_admin_password),
):
    with Session(engine) as session:
        project = session.get(Project, project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        for key, value in project_data.model_dump(exclude={"id"}).items():
            setattr(project, key, value)
        session.add(project)
        session.commit()
        session.refresh(project)
        return project


@router.delete("/projects/{project_id}")
async def delete_project(
    project_id: int, admin_token: str = Depends(verify_admin_password)
):
    with Session(engine) as session:
        project = session.get(Project, project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        session.delete(project)
        session.commit()
        return {"status": "success"}


@router.post("/projects/{project_id}/upload-image")
async def upload_project_image(
    project_id: int,
    file: UploadFile = File(...),
    admin_token: str = Depends(verify_admin_password),
):
    with Session(engine) as session:
        project = session.get(Project, project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        # 1. Validate File Extension
        ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"}
        original_filename = file.filename or "image.jpg"
        ext = os.path.splitext(original_filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file extension. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
            )

        # 2. Validate File Size (e.g., max 5MB)
        MAX_SIZE = 5 * 1024 * 1024  # 5MB
        file.file.seek(0, os.SEEK_END)
        file_size = file.file.tell()
        file.file.seek(0)  # Reset for saving
        if file_size > MAX_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size allowed is {MAX_SIZE / 1024 / 1024}MB",
            )

        # Create directory if it doesn't exist
        upload_dir = os.path.abspath(
            os.path.join(os.getcwd(), "..", "frontend", "public", "images", "projects")
        )
        os.makedirs(upload_dir, exist_ok=True)

        # Generate filename
        filename = f"{slugify(project.title)}{ext}"
        file_path = os.path.join(upload_dir, filename)

        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Update project in DB
        relative_path = f"/images/projects/{filename}"
        project.image = relative_path
        session.add(project)
        session.commit()
        session.refresh(project)

        return {"image_url": relative_path}


# --- Blog CRUD ---
@router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts():
    with Session(engine) as session:
        return session.exec(select(BlogPost).order_by(desc(BlogPost.date))).all()


@router.post("/blog", response_model=BlogPost)
async def create_blog_post(
    post: BlogPost, admin_token: str = Depends(verify_admin_password)
):
    with Session(engine) as session:
        session.add(post)
        session.commit()
        session.refresh(post)
        return post


@router.put("/blog/{post_id}", response_model=BlogPost)
async def update_blog_post(
    post_id: int, post_data: BlogPost, admin_token: str = Depends(verify_admin_password)
):
    with Session(engine) as session:
        post = session.get(BlogPost, post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Blog post not found")
        for key, value in post_data.model_dump(exclude={"id"}).items():
            setattr(post, key, value)
        session.add(post)
        session.commit()
        session.refresh(post)
        return post


@router.delete("/blog/{post_id}")
async def delete_blog_post(
    post_id: int, admin_token: str = Depends(verify_admin_password)
):
    with Session(engine) as session:
        post = session.get(BlogPost, post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Blog post not found")
        session.delete(post)
        session.commit()
        return {"status": "success"}


# --- Chat Trigger CRUD ---
@router.get("/chat-triggers", response_model=List[ChatTriggerResponse])
async def get_chat_triggers():
    with Session(engine) as session:
        return session.exec(select(ChatTriggerResponse)).all()


@router.post("/chat-triggers", response_model=ChatTriggerResponse)
async def create_chat_trigger(
    trigger: ChatTriggerResponse, admin_token: str = Depends(verify_admin_password)
):
    with Session(engine) as session:
        session.add(trigger)
        session.commit()
        session.refresh(trigger)
        return trigger


@router.put("/chat-triggers/{trigger_id}", response_model=ChatTriggerResponse)
async def update_chat_trigger(
    trigger_id: int,
    trigger_data: ChatTriggerResponse,
    admin_token: str = Depends(verify_admin_password),
):
    with Session(engine) as session:
        trigger = session.get(ChatTriggerResponse, trigger_id)
        if not trigger:
            raise HTTPException(status_code=404, detail="Chat trigger not found")
        for key, value in trigger_data.model_dump(exclude={"id"}).items():
            setattr(trigger, key, value)
        session.add(trigger)
        session.commit()
        session.refresh(trigger)
        return trigger


@router.delete("/chat-triggers/{trigger_id}")
async def delete_chat_trigger(
    trigger_id: int, admin_token: str = Depends(verify_admin_password)
):
    with Session(engine) as session:
        trigger = session.get(ChatTriggerResponse, trigger_id)
        if not trigger:
            raise HTTPException(status_code=404, detail="Chat trigger not found")
        session.delete(trigger)
        session.commit()
        return {"status": "success"}


# --- Analytics ---
@router.get("/analytics/messages", response_model=List[ChatMessage])
async def get_analytics_messages(admin_token: str = Depends(verify_admin_password)):
    with Session(engine) as session:
        return session.exec(
            select(ChatMessage).order_by(desc(ChatMessage.timestamp)).limit(100)
        ).all()


@router.get("/analytics/feedback", response_model=List[ChatFeedback])
async def get_analytics_feedback(admin_token: str = Depends(verify_admin_password)):
    with Session(engine) as session:
        return session.exec(
            select(ChatFeedback).order_by(desc(ChatFeedback.timestamp)).limit(100)
        ).all()
