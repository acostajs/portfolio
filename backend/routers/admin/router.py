from fastapi import APIRouter, Depends
from auth import verify_admin_password
from .about import router as about_router
from .experience import router as experience_router
from .projects import router as projects_router
from .blog import router as blog_router
from .chat import router as chat_router
from .analytics import router as analytics_router
from .uploads import router as uploads_router

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])


@router.get("/verify")
async def verify_admin(admin_token: str = Depends(verify_admin_password)):
    return {"status": "authenticated"}


router.include_router(about_router)
router.include_router(experience_router)
router.include_router(projects_router)
router.include_router(blog_router)
router.include_router(chat_router)
router.include_router(analytics_router)
router.include_router(uploads_router)
