import hashlib
import logging
import asyncio
from typing import Any
from fastapi import Request
from sqlmodel import Session
from database import engine
from models import VisitorLog
from config import settings
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("backend")

# Singleton queue for background tasks
background_task_queue: asyncio.Queue[dict[str, Any]] = asyncio.Queue()


async def visitor_log_worker():
    """Consumes visitor logs from the queue and saves them to the database."""
    logger.info("Visitor log worker started.")
    while True:
        try:
            log_data = await background_task_queue.get()
            if log_data is None:  # Sentinel value to stop worker
                break

            await asyncio.to_thread(save_log_to_db, log_data)
            background_task_queue.task_done()
        except Exception as e:
            logger.error(f"Worker error: {e}")
            await asyncio.sleep(1)


def save_log_to_db(data: dict[str, Any]):
    """Sync function to save log entry using a new session."""
    try:
        with Session(engine) as session:
            log_entry = VisitorLog(
                path=data["path"],
                method=data["method"],
                locale=data["locale"],
                user_agent=data["user_agent"],
                referrer=data["referrer"],
                ip_hash=data["ip_hash"],
            )
            session.add(log_entry)
            session.commit()
            logger.debug(f"Visitor logged: {data['path']} ({data['method']})")
    except Exception as e:
        logger.error(f"Database logging error: {e}")


class VisitorTrackingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        method = request.method

        # Exclusions: static, admin, docs, etc.
        excluded_prefixes = [
            "/api/v1/admin",
            "/docs",
            "/openapi.json",
            "/favicon.ico",
            "/sitemap.xml",
            "/robots.txt",
        ]
        if any(path.startswith(prefix) for prefix in excluded_prefixes):
            return await call_next(request)

        # Basic filtering: ignore asset paths
        if any(
            path.endswith(ext)
            for ext in [".png", ".jpg", ".jpeg", ".svg", ".css", ".js", ".pdf"]
        ):
            return await call_next(request)

        # Extract data
        user_agent = request.headers.get("user-agent")
        referrer = request.headers.get("referrer")
        locale = (
            request.headers.get("x-portfolio-locale")
            or request.headers.get("accept-language", "en")[:2]
        )

        # Get client IP
        client_ip = request.client.host if request.client else "unknown"

        # Anonymize IP
        ip_hash = hashlib.sha256(
            (client_ip + settings.SECRET_SALT).encode()
        ).hexdigest()

        # Call next to get response
        response = await call_next(request)

        # Add background task to response if it's not an internal error
        if response.status_code < 500:
            # Push to the in-memory queue instead of spawning an unmanaged task
            log_item = {
                "path": path,
                "method": method,
                "locale": locale,
                "user_agent": user_agent,
                "referrer": referrer,
                "ip_hash": ip_hash,
            }
            background_task_queue.put_nowait(log_item)

        return response
