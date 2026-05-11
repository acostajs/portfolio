import pytest
import os
from httpx import ASGITransport, AsyncClient

# Set environment variables BEFORE importing app or database
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["ADMIN_PASSWORD"] = "testpass"
os.environ["ENVIRONMENT"] = "testing"

from database import engine, create_db_and_tables
from main import app
from sqlmodel import Session
from cache import clear_trigger_cache


@pytest.fixture(autouse=True)
def clear_cache():
    clear_trigger_cache()


@pytest.fixture(autouse=True)
def setup_database():
    create_db_and_tables()
    yield
    # No need to drop for in-memory, but good practice if it was a file
    from sqlmodel import SQLModel

    SQLModel.metadata.drop_all(engine)


@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


@pytest.fixture
def db_session():
    with Session(engine) as session:
        yield session
