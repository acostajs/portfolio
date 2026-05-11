from fastapi import HTTPException, Header
from typing import Optional
from config import settings


def verify_admin_password(x_admin_token: Optional[str] = Header(None)):
    if (
        settings.ENVIRONMENT != "development"
        and settings.ADMIN_PASSWORD == "CHANGE_ME_IN_ENV"
    ):
        # In production/testing, we should not allow the default password
        raise HTTPException(
            status_code=500,
            detail="Server security misconfiguration: ADMIN_PASSWORD not set",
        )

    if x_admin_token != settings.ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin token")
    return x_admin_token
