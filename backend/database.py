import logging
from typing import Generator
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import inspect, text, types
from config import settings

logger = logging.getLogger("backend")

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
    # First ensure basic tables exist
    SQLModel.metadata.create_all(engine)

    inspector = inspect(engine)
    tables = inspector.get_table_names()

    # We use engine.connect() for DDL operations to be more direct
    with engine.connect() as conn:
        # --- Migrate chatfeedback ---
        if "chatfeedback" in tables:
            cols = [c["name"] for c in inspector.get_columns("chatfeedback")]
            if "module" not in cols:
                conn.execute(text("ALTER TABLE chatfeedback ADD COLUMN module VARCHAR"))
            if "category" not in cols:
                conn.execute(
                    text("ALTER TABLE chatfeedback ADD COLUMN category VARCHAR")
                )
            conn.commit()

        # --- Migrate chattriggerresponse ---
        if "chattriggerresponse" in tables:
            cols = [c["name"] for c in inspector.get_columns("chattriggerresponse")]
            if "priority" not in cols:
                conn.execute(
                    text(
                        "ALTER TABLE chattriggerresponse ADD COLUMN priority INTEGER DEFAULT 0"
                    )
                )
            conn.commit()

        # --- Migrate livechatsession ---
        if "livechatsession" in tables:
            cols = inspector.get_columns("livechatsession")
            session_id_col = next((c for c in cols if c["name"] == "session_id"), None)
            if (
                session_id_col
                and not isinstance(
                    session_id_col["type"], (types.String, types.Unicode)
                )
                and not database_url.startswith("sqlite")
            ):
                try:
                    conn.execute(
                        text(
                            "ALTER TABLE livechatsession ALTER COLUMN session_id TYPE VARCHAR USING session_id::varchar"
                        )
                    )
                    conn.commit()
                    logger.info(
                        "Successfully migrated livechatsession.session_id to VARCHAR"
                    )
                except Exception as e:
                    logger.error(f"Migration error (livechatsession.session_id): {e}")
                    conn.rollback()

        # --- Migrate chatmessage ---
        if "chatmessage" in tables:
            cols = inspector.get_columns("chatmessage")
            col_names = [c["name"] for c in cols]
            if "session_id" not in col_names:
                conn.execute(
                    text(
                        "ALTER TABLE chatmessage ADD COLUMN session_id VARCHAR DEFAULT 'legacy'"
                    )
                )
                conn.commit()
            else:
                session_id_col = next(c for c in cols if c["name"] == "session_id")
                if not isinstance(
                    session_id_col["type"], (types.String, types.Unicode)
                ) and not database_url.startswith("sqlite"):
                    try:
                        conn.execute(
                            text(
                                "ALTER TABLE chatmessage ALTER COLUMN session_id TYPE VARCHAR USING session_id::varchar"
                            )
                        )
                        conn.commit()
                        logger.info(
                            "Successfully migrated chatmessage.session_id to VARCHAR"
                        )
                    except Exception as e:
                        logger.error(f"Migration error (chatmessage.session_id): {e}")
                        conn.rollback()


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
