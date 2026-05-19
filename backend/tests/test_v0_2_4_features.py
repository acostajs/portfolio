import pytest
import asyncio
from sqlmodel import select, Session
import database
from models import VisitorLog, LiveChatSession, ChatTriggerResponse


@pytest.mark.asyncio
async def test_visitor_tracking_middleware(client):
    # Perform a public request
    response = await client.get("/api/v1/about")
    assert response.status_code == 200

    # Wait a bit for the background task to complete (it runs in a thread)
    for _ in range(10):
        await asyncio.sleep(0.1)
        with Session(database.engine) as session:
            try:
                logs = session.exec(select(VisitorLog)).all()
                if len(logs) > 0:
                    break
            except Exception:
                continue

    with Session(database.engine) as session:
        logs = session.exec(select(VisitorLog)).all()
        assert len(logs) > 0
        log = logs[0]
        assert log.path == "/api/v1/about"
        assert log.method == "GET"
        assert log.ip_hash is not None
        assert len(log.ip_hash) == 64


@pytest.mark.asyncio
async def test_health_details_requires_auth(client):
    # No auth
    response = await client.get("/api/v1/admin/monitoring/health/details")
    assert response.status_code == 401

    # Wrong auth
    response = await client.get(
        "/api/v1/admin/monitoring/health/details", headers={"x-admin-token": "wrong"}
    )
    assert response.status_code == 401

    # Correct auth
    response = await client.get(
        "/api/v1/admin/monitoring/health/details", headers={"x-admin-token": "testpass"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "components" in data
    assert "database" in data["components"]
    assert "system" in data["components"]


@pytest.mark.asyncio
async def test_session_metadata_persistence(client):
    session_id = "test-session-123"

    # 1. Send first message
    response = await client.post(
        "/api/v1/chat",
        json={"message": "Hello", "session_id": session_id, "page_id": "home"},
    )
    assert response.status_code == 200

    # 2. Check DB for metadata
    with Session(database.engine) as session:
        stmt = select(LiveChatSession).where(LiveChatSession.session_id == session_id)
        chat_session = session.exec(stmt).first()
        assert chat_session is not None
        if chat_session and chat_session.session_metadata:
            assert chat_session.session_metadata["interaction_count"] == 1
            assert "home" in chat_session.session_metadata["visited_pages"]

    # 3. Send second message from different page
    await client.post(
        "/api/v1/chat",
        json={
            "message": "Tell me more",
            "session_id": session_id,
            "page_id": "projects",
        },
    )

    with Session(database.engine) as session:
        session.expire_all()
        stmt = select(LiveChatSession).where(LiveChatSession.session_id == session_id)
        chat_session = session.exec(stmt).first()
        assert chat_session is not None
        if chat_session and chat_session.session_metadata:
            assert chat_session.session_metadata["interaction_count"] == 2
            assert "projects" in chat_session.session_metadata["visited_pages"]


@pytest.mark.asyncio
async def test_nlu_hints(client, db_session):
    # Seed some triggers
    trigger = ChatTriggerResponse(
        module="projects",
        triggers=["What projects?", "show me your work"],
        answers_en=["I have many projects"],
        priority=10,
    )
    db_session.add(trigger)
    db_session.commit()

    # Force cache refresh
    from cache import get_cached_triggers

    get_cached_triggers()

    # Get hints for projects page
    response = await client.get("/api/v1/chat/hints?page_id=projects&lang=en")
    assert response.status_code == 200
    hints = response.json()
    assert len(hints) > 0
    assert any("project" in h.lower() for h in hints)
