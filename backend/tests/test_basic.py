import pytest
from httpx import AsyncClient
from sqlmodel import Session, select, SQLModel
from seed import seed
from models import About, Experience, Project, BlogPost, ChatTriggerResponse
from conftest import test_engine as engine


@pytest.mark.asyncio
async def test_health_endpoint(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


@pytest.mark.asyncio
async def test_seed_functionality(monkeypatch):
    # Ensure tables exist on the test engine
    SQLModel.metadata.create_all(engine)

    # Run seed
    seed()

    with Session(engine) as session:
        assert session.exec(select(About)).first() is not None
        assert session.exec(select(Experience)).first() is not None
        assert session.exec(select(Project)).first() is not None
        assert session.exec(select(BlogPost)).first() is not None
        assert session.exec(select(ChatTriggerResponse)).first() is not None

    # Run again, should not duplicate (Integrity check)
    seed()
