from typing import Generator
from sqlmodel import SQLModel, create_engine, Session
from config import settings

# Default to SQLite for local development if no DATABASE_URL is provided
sqlite_url = "sqlite:///./database.db"
database_url = settings.DATABASE_URL or sqlite_url

# connect_args={"check_same_thread": False} is required for SQLite
# For Postgres (Production), we don't need it.
if database_url.startswith("sqlite"):
    engine = create_engine(
        database_url,
        echo=True if settings.ENVIRONMENT == "development" else False,
        connect_args={"check_same_thread": False},
    )
else:
    # Postgres configuration (Neon/Vercel)
    engine = create_engine(
        database_url,
        echo=True if settings.ENVIRONMENT == "development" else False,
        # Ensure we use a pool size that fits serverless limits if needed
        pool_pre_ping=True,
    )


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    # Manual migration for chatfeedback columns if they are missing
    from sqlalchemy import inspect, text

    inspector = inspect(engine)
    columns = [c["name"] for c in inspector.get_columns("chatfeedback")]
    if "module" not in columns:
        with Session(engine) as session:
            session.execute(text("ALTER TABLE chatfeedback ADD COLUMN module VARCHAR"))
            session.commit()
    if "category" not in columns:
        with Session(engine) as session:
            session.execute(
                text("ALTER TABLE chatfeedback ADD COLUMN category VARCHAR")
            )
            session.commit()


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
