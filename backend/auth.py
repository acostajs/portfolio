from fastapi import HTTPException, Header
from typing import Optional
from config import settings


import logging

logger = logging.getLogger("backend")


def verify_admin_password(x_admin_token: Optional[str] = Header(None)):
    # Trim whitespace from token and password for robustness
    token = x_admin_token.strip() if x_admin_token else ""
    expected = settings.ADMIN_PASSWORD.strip() if settings.ADMIN_PASSWORD else ""

    if settings.ENVIRONMENT != "development" and expected == "CHANGE_ME_IN_ENV":
        # In production/testing, we should not allow the default password
        raise HTTPException(
            status_code=500,
            detail="Server security misconfiguration: ADMIN_PASSWORD not set",
        )

    if token != expected:
        logger.warning(
            f"Auth failed: received length {len(token)}, expected length {len(expected)}"
        )
        raise HTTPException(status_code=401, detail="Invalid admin token")
    return token
