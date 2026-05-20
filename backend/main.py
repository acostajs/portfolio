import logging
import sys
import os
import asyncio
from contextlib import asynccontextmanager

# Add the current directory to sys.path to ensure local imports work on Vercel
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from seed import seed
from cache import get_cached_triggers

from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from limiter import limiter

# Import Routers
from routers import public, chat
from routers.admin.router import router as admin_router
import middleware
from middleware import (
    VisitorTrackingMiddleware,
    visitor_log_worker,
)

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("backend")


# --- Lifecycle ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Security Check: Ensure sensitive settings are configured in non-dev environments
    if settings.ENVIRONMENT != "development" and settings.ENVIRONMENT != "testing":
        if settings.ADMIN_PASSWORD == "CHANGE_ME_IN_ENV":
            logger.error(
                "CRITICAL SECURITY ALERT: ADMIN_PASSWORD is set to default in production!"
            )
        if settings.SECRET_SALT == "DEFAULT_SALT_CHANGE_ME":
            logger.error(
                "CRITICAL SECURITY ALERT: SECRET_SALT is set to default in production!"
            )

    # Re-initialize the background task queue for the current event loop.
    # This is critical for tests where pytest-asyncio creates a new event loop per test,
    # preventing event loop mismatch hangs.
    middleware.background_task_queue = asyncio.Queue()

    # Start the background log worker
    worker_task = asyncio.create_task(visitor_log_worker())

    # Seed the database if empty (skip in tests to avoid interference)
    if settings.ENVIRONMENT != "testing":
        seed()

    # Pre-populate trigger cache (skip in tests)
    if settings.ENVIRONMENT != "testing":
        get_cached_triggers()

    yield

    # Cleanup: Stop the worker
    await middleware.drain_background_task_queue()
    await middleware.background_task_queue.put(None)
    await worker_task



# --- App Initialization ---
app = FastAPI(title="Portfolio Backend", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore

# --- Middleware ---
# Strictly sanitized CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(VisitorTrackingMiddleware)

# --- Include Routers ---
app.include_router(public.router)
app.include_router(chat.router)
app.include_router(admin_router)


# --- Basic Routes ---
@app.get("/")
async def root():
    return {"message": "Portfolio API is running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
