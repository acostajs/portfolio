from fastapi import HTTPException, Header
from typing import Optional
from config import settings


def verify_admin_password(x_admin_password: Optional[str] = Header(None)):
    if x_admin_password != settings.ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin password")
    return x_admin_password
