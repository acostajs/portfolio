from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    FRONTEND_URL: str = "http://localhost:5173"
    DATABASE_URL: Optional[str] = None
    ENVIRONMENT: str = "development"
    # Mandatory in production, defaults to something safe/useless in dev
    ADMIN_PASSWORD: str = "CHANGE_ME_IN_ENV"  # nosec
    SECRET_SALT: str = "DEFAULT_SALT_CHANGE_ME"  # nosec

    # Telegram Bridge
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    TELEGRAM_CHAT_ID: Optional[str] = None
    TELEGRAM_SECRET_TOKEN: Optional[str] = None

    # Google Drive / OAuth2 Refresh Token
    GOOGLE_PROJECT_ID: Optional[str] = None
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REFRESH_TOKEN: Optional[str] = None
    GOOGLE_TOKEN_URI: str = "https://oauth2.googleapis.com/token"  # nosec
    GOOGLE_DRIVE_FOLDER_ID: str = (
        "17B-O-56_YJ0Xf2X8B79532rO4C_l0S6U"  # Default fallback or provided by user
    )


settings = Settings()
