import pytest
import os
from httpx import ASGITransport, AsyncClient

# Set environment variables BEFORE importing app or database
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["ADMIN_PASSWORD"] = "testpass"
os.environ["ENVIRONMENT"] = "testing"

from database import engine, create_db_and_tables
from main import app
from sqlmodel import Session, create_engine
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
    monkeypatch.setattr("main.engine", test_engine)
    monkeypatch.setattr("admin.engine", test_engine)
    monkeypatch.setattr("seed.engine", test_engine)
    monkeypatch.setattr("cache.engine", test_engine)

    create_db_and_tables()
    yield
    from sqlmodel import SQLModel

    SQLModel.metadata.drop_all(test_engine)


@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


@pytest.fixture
def db_session():
    with Session(test_engine) as session:
        yield session
