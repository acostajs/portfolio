import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from sqlmodel import Session
from database import get_session
import storage
from models import Project, ProjectCreate, ProjectUpdate
from limiter import limiter

router = APIRouter(prefix="/projects", tags=["admin-projects"])


@router.post("", response_model=Project)
@limiter.limit("10/minute")
async def create_project(
    request: Request,
    project_data: ProjectCreate,
    session: Session = Depends(get_session),
):
    project = Project.model_validate(project_data)
    session.add(project)
    session.commit()
    session.refresh(project)
    return project


@router.put("/{project_id}", response_model=Project)
@limiter.limit("10/minute")
async def update_project(
    request: Request,
    project_id: int,
    project_data: ProjectUpdate,
    session: Session = Depends(get_session),
):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Update only provided fields
    data = project_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(project, key, value)

    session.add(project)
    session.commit()
    session.refresh(project)
    return project


@router.delete("/{project_id}")
@limiter.limit("10/minute")
async def delete_project(
    request: Request,
    project_id: int,
    session: Session = Depends(get_session),
):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Delete image from Drive if it exists
    if project.image:
        storage.delete_file(project.image)

    session.delete(project)
    session.commit()
    return {"status": "success"}


@router.post("/{project_id}/upload-image")
@limiter.limit("10/minute")
async def upload_project_image(
    request: Request,
    project_id: int,
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # 1. Validate File Extension
    ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"}
    ext = os.path.splitext(file.filename or "image.jpg")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file extension. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # 2. Validate File Size (max 5MB)
    MAX_SIZE = 5 * 1024 * 1024
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)
    if file_size > MAX_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size allowed is {MAX_SIZE / 1024 / 1024}MB",
        )

    # Delete old image if it exists
    if project.image:
        storage.delete_file(project.image)

    # Upload to Drive
    image_url = await storage.upload_file(file, folder="projects")

    # Update project in DB
    project.image = image_url
    session.add(project)
    session.commit()
    session.refresh(project)

    return {"image_url": image_url}
