import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import storage
from auth import verify_admin_password

router = APIRouter(prefix="/upload", tags=["admin-uploads"])


@router.post("")
async def upload_general_image(
    file: UploadFile = File(...),
    admin_token: str = Depends(verify_admin_password),
):
    """
    General purpose upload endpoint for images (e.g., used in Blog posts).
    """
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

    # Upload to Drive
    image_url = await storage.upload_file(file, folder="general")
    return {"image_url": image_url}
