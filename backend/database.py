import logging
from typing import Generator
from sqlmodel import Session, create_engine
from config import settings

logger = logging.getLogger("backend")

# Default to SQLite for local development if no DATABASE_URL is provided
sqlite_url = "sqlite:///./database.db"
database_url = settings.DATABASE_URL or sqlite_url

# For Postgres (Production), we don't need check_same_thread
if database_url.startswith("sqlite"):
    engine = create_engine(
        database_url,
        echo=True if settings.ENVIRONMENT == "development" else False,
        connect_args={"check_same_thread": False},
    )
else:
    # Postgres configuration (Neon/Vercel)
    # SQLAlchemy 2.0 requires postgresql:// instead of postgres://
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    engine = create_engine(
        database_url,
        echo=True if settings.ENVIRONMENT == "development" else False,
        pool_pre_ping=True,
    )


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
