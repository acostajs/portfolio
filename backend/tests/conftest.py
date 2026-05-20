import pytest
import os
from httpx import ASGITransport, AsyncClient
from alembic import command
from alembic.config import Config

# Set environment variables BEFORE importing app or database
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["ADMIN_PASSWORD"] = "testpass"
os.environ["ENVIRONMENT"] = "testing"

from main import app
from sqlmodel import Session, create_engine, SQLModel
from cache import clear_trigger_cache
from sqlalchemy.pool import StaticPool

# Re-initialize engine for testing with StaticPool for in-memory DB
# This ensures the connection stays open between different session uses in the same process
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


@pytest.fixture(autouse=True)
def clear_cache():
    clear_trigger_cache()


@pytest.fixture(autouse=True)
def setup_database(monkeypatch):
    # Patch the engine used in the app to use the test engine
    monkeypatch.setattr("database.engine", test_engine)
    # Patch all modules that import 'engine' from 'database'
    monkeypatch.setattr("routers.chat.engine", test_engine)
    monkeypatch.setattr("middleware.engine", test_engine)
    monkeypatch.setattr("seed.engine", test_engine)
    monkeypatch.setattr("cache.engine", test_engine)

    # Use Alembic to migrate the in-memory database
    alembic_cfg = Config("alembic.ini")

    # We need to use the existing connection from test_engine (StaticPool)
    with test_engine.connect() as connection:
        alembic_cfg.attributes["connection"] = connection
        command.upgrade(alembic_cfg, "head")

    yield

    # Optional: Clean up by dropping everything or downgrading
    # For in-memory StaticPool, we should drop everything to ensure isolation between test runs if needed,
    # but since it's a fresh connection for each test run usually, it might be fine.
    # However, conftest engine is global. So we MUST clean up.
    with test_engine.connect() as connection:
        alembic_cfg.attributes["connection"] = connection
        command.downgrade(alembic_cfg, "base")
        # command.downgrade to 'base' leaves the alembic_version table.
        # Alternatively, use SQLModel.metadata.drop_all(test_engine) to be thorough.
        SQLModel.metadata.drop_all(test_engine)


@pytest.fixture
async def client():
    # Manually trigger lifespan for AsyncClient
    from main import lifespan

    async with lifespan(app):
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as ac:
            yield ac


@pytest.fixture
def db_session():
    with Session(test_engine) as session:
        yield session
