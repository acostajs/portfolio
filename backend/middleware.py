import hashlib
import logging
from typing import Optional
from fastapi import Request
from sqlmodel import Session
from database import engine
from models import VisitorLog
from config import settings
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("backend")


def log_visitor(
    path: str,
    method: str,
    locale: str,
    user_agent: Optional[str],
    referrer: Optional[str],
    ip_hash: str,
):
    """Background task to save visitor logs."""
    try:
        with Session(engine) as session:
            log_entry = VisitorLog(
                path=path,
                method=method,
                locale=locale,
                user_agent=user_agent,
                referrer=referrer,
                ip_hash=ip_hash,
            )
            session.add(log_entry)
            session.commit()
            logger.debug(f"Visitor logged: {path} ({method})")
    except Exception as e:
        logger.error(f"Failed to log visitor: {e}")


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
            if hasattr(response, "background") and response.background is not None:
                # Merge if it already exists (BaseHTTPMiddleware limitation)
                # Actually, in BaseHTTPMiddleware, we can't easily add to BackgroundTasks
                # because response is already generated.
                # Instead, we'll use a direct background task if possible or just log it here.
                # However, for true non-blocking, we'll use the FastAPI BackgroundTasks in a route
                # OR we'll just run it in a separate thread/executor if we want to be safe.
                pass

            # Since BaseHTTPMiddleware is a bit tricky with BackgroundTasks,
            # we'll use a simple manual fire-and-forget or just log it
            # (In production, a proper queue would be better, but for this portfolio, this is fine).
            # We'll import BackgroundTasks and use it if we were in a route.
            # Here, we'll just call log_visitor directly for now or use asyncio.create_task.
            import asyncio

            asyncio.create_task(
                asyncio.to_thread(
                    log_visitor, path, method, locale, user_agent, referrer, ip_hash
                )
            )

        return response
