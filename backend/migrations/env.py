from logging.config import fileConfig

import sqlalchemy as sa
from alembic import context
from sqlmodel import SQLModel, create_engine
from models import (
    ChatMessage,  # noqa: F401
    LiveChatSession,  # noqa: F401
    ChatFeedback,  # noqa: F401
    VisitorLog,  # noqa: F401
    About,  # noqa: F401
    Experience,  # noqa: F401
    Project,  # noqa: F401
    BlogPost,  # noqa: F401
    ChatTriggerResponse,  # noqa: F401
)
from config import settings

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = SQLModel.metadata

# Set the sqlalchemy.url from our application settings
database_url = settings.DATABASE_URL or "sqlite:///./database.db"
# Alembic expects 'driver://' not 'driver+asyncpg://' or similar if not using async
# But our models use synchronous sqlmodel/sqlalchemy for now in database.py
# If it starts with postgres:// we might need to fix it for sqlalchemy 2.0
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

config.set_main_option("sqlalchemy.url", database_url)

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        render_as_batch=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    # Use create_engine directly to avoid alembic.ini static URL
    # or use provided connection (for testing)
    connectable = config.attributes.get("connection", None)

    if connectable is None:
        url = config.get_main_option("sqlalchemy.url")
        if url is None:
            raise ValueError("sqlalchemy.url not set in alembic config")
        connectable = create_engine(url)

    if isinstance(connectable, sa.engine.Connection):
        # Already a connection
        context.configure(
            connection=connectable,
            target_metadata=target_metadata,
            render_as_batch=True,
        )
        with context.begin_transaction():
            context.run_migrations()
    else:
        # It's an engine
        with connectable.connect() as connection:
            context.configure(
                connection=connection,
                target_metadata=target_metadata,
                render_as_batch=True,
            )

            with context.begin_transaction():
                context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
