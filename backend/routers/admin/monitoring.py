import time
import os
import psutil
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlmodel import Session, text
from database import get_session
from cache import get_cached_triggers
from config import settings

router = APIRouter(prefix="/monitoring", tags=["admin-monitoring"])


@router.get("/health/details")
async def health_details(session: Session = Depends(get_session)):
    """Detailed health check for administration."""
    start_time = time.time()

    # 1. Database Check
    db_status = "up"
    db_latency = 0
    db_message = None
    try:
        db_start = time.time()
        session.execute(text("SELECT 1")).first()
        db_latency = (time.time() - db_start) * 1000
    except Exception as e:
        db_status = "down"
        db_message = str(e)

    # 2. Cache Check
    cache_status = "up"
    cache_size = 0
    try:
        triggers, _ = get_cached_triggers()
        cache_size = len(triggers)
    except Exception:
        cache_status = "down"

    # 3. Telegram Bridge Check
    telegram_status = "up"
    telegram_message = None
    if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_CHAT_ID:
        telegram_status = "disabled"
        telegram_message = "Credentials missing"

    # 4. System Info
    try:
        process = psutil.Process(os.getpid())
        memory_info = process.memory_info().rss / (1024 * 1024)  # MB
        disk_usage = psutil.disk_usage("/").percent
    except Exception:
        memory_info = 0
        disk_usage = 0

    return {
        "status": "healthy" if db_status == "up" else "degraded",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "0.2.4",
        "components": {
            "database": {
                "status": db_status,
                "latency_ms": round(db_latency, 2),
                "message": db_message,
            },
            "cache": {"status": cache_status, "size": cache_size},
            "telegram_bridge": {"status": telegram_status, "message": telegram_message},
            "system": {
                "memory_usage_mb": round(memory_info, 2),
                "disk_usage_percent": disk_usage,
            },
        },
        "total_latency_ms": round((time.time() - start_time) * 1000, 2),
    }
