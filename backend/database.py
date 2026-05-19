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
    logger.info("Starting database initialization and migrations...")
    # First ensure basic tables exist
    SQLModel.metadata.create_all(engine)

    inspector = inspect(engine)
    tables = [t.lower() for t in inspector.get_table_names()]
    logger.info(f"Existing tables: {tables}")

    # We use engine.connect() for DDL operations to be more direct
    with engine.connect() as conn:
        # --- Migrate chatfeedback ---
        if "chatfeedback" in tables:
            cols = [c["name"].lower() for c in inspector.get_columns("chatfeedback")]
            if "module" not in cols:
                logger.info("Adding module column to chatfeedback")
                conn.execute(text("ALTER TABLE chatfeedback ADD COLUMN module VARCHAR"))
            if "category" not in cols:
                logger.info("Adding category column to chatfeedback")
                conn.execute(
                    text("ALTER TABLE chatfeedback ADD COLUMN category VARCHAR")
                )
            conn.commit()

        # --- Migrate chattriggerresponse ---
        if "chattriggerresponse" in tables:
            cols = [
                c["name"].lower() for c in inspector.get_columns("chattriggerresponse")
            ]
            if "priority" not in cols:
                logger.info("Adding priority column to chattriggerresponse")
                conn.execute(
                    text(
                        "ALTER TABLE chattriggerresponse ADD COLUMN priority INTEGER DEFAULT 0"
                    )
                )
            conn.commit()

        # --- Migrate livechatsession ---
        if "livechatsession" in tables:
            cols = inspector.get_columns("livechatsession")
            session_id_col = next(
                (c for c in cols if c["name"].lower() == "session_id"), None
            )
            if session_id_col:
                col_type = session_id_col["type"]
                logger.info(f"livechatsession.session_id type: {col_type}")
                if not isinstance(
                    col_type, (types.String, types.Unicode)
                ) and not database_url.startswith("sqlite"):
                    logger.info(
                        "Attempting to migrate livechatsession.session_id to VARCHAR"
                    )
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
                        logger.error(
                            f"Migration error (livechatsession.session_id): {e}"
                        )
                        conn.rollback()

        # --- Migrate chatmessage ---
        if "chatmessage" in tables:
            cols = inspector.get_columns("chatmessage")
            col_names = [c["name"].lower() for c in cols]

            # Drop blocking foreign key if it exists
            fks = inspector.get_foreign_keys("chatmessage")
            for fk in fks:
                if "session_id" in [c.lower() for c in fk["constrained_columns"]]:
                    fk_name = fk["name"]
                    logger.info(f"Dropping blocking foreign key: {fk_name}")
                    try:
                        conn.execute(
                            text(
                                f'ALTER TABLE chatmessage DROP CONSTRAINT IF EXISTS "{fk_name}"'
                            )
                        )
                        conn.commit()
                    except Exception as e:
                        logger.error(f"Failed to drop constraint {fk_name}: {e}")
                        conn.rollback()

            if "session_id" not in col_names:
                logger.info("Adding session_id column to chatmessage")
                conn.execute(
                    text(
                        "ALTER TABLE chatmessage ADD COLUMN session_id VARCHAR DEFAULT 'legacy'"
                    )
                )
                conn.commit()
            else:
                session_id_col = next(
                    c for c in cols if c["name"].lower() == "session_id"
                )
                col_type = session_id_col["type"]
                logger.info(f"chatmessage.session_id type: {col_type}")
                # Be more aggressive: if it's not a string type, convert it
                if not isinstance(
                    col_type, (types.String, types.Unicode)
                ) and not database_url.startswith("sqlite"):
                    logger.info(
                        "Attempting to migrate chatmessage.session_id to VARCHAR"
                    )
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
