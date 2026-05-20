import pytest
from httpx import AsyncClient
from sqlmodel import Session, select
from models import ChatMessage, LiveChatSession
from config import settings
import asyncio


@pytest.mark.asyncio
async def test_telegram_webhook_unauthorized(client: AsyncClient, monkeypatch):
    """
    Test that the webhook returns unauthorized if the secret token is wrong.
    """
    monkeypatch.setattr(settings, "TELEGRAM_SECRET_TOKEN", "super_secret")

    payload = {"message": {"text": "Unauthorized", "chat": {"id": 1}}}
    # No header or wrong header
    response = await client.post(
        "/api/v1/chat/telegram-webhook",
        json=payload,
        headers={"X-Telegram-Bot-Api-Secret-Token": "wrong"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "unauthorized"


@pytest.mark.asyncio
async def test_telegram_webhook_authorized(
    client: AsyncClient, monkeypatch, db_session: Session
):
    """
    Test that the webhook returns success if the secret token is correct.
    """
    monkeypatch.setattr(settings, "TELEGRAM_SECRET_TOKEN", "super_secret")

    # Need a session for the webhook to work
    session_id = "authorized_sync"
    await client.post(
        "/api/v1/chat", json={"message": "/live-chat", "session_id": session_id}
    )

    payload = {"message": {"text": "Authorized!", "chat": {"id": 1}}}
    response = await client.post(
        "/api/v1/chat/telegram-webhook",
        json=payload,
        headers={"X-Telegram-Bot-Api-Secret-Token": "super_secret"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "success"


@pytest.mark.asyncio
async def test_live_chat_commands(client: AsyncClient, db_session: Session):
    # Test starting live chat
    response = await client.post(
        "/api/v1/chat",
        json={
            "message": "/live-chat",
            "language": "en",
            "session_id": "test_session_1",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "Live chat requested" in data["reply"]
    assert data["is_live"] is True

    # Verify session created in DB
    stmt = select(LiveChatSession).where(LiveChatSession.session_id == "test_session_1")
    live_session = db_session.exec(stmt).first()
    assert live_session is not None
    assert live_session.is_active is True

    # Test closing live chat
    response = await client.post(
        "/api/v1/chat",
        json={
            "message": "/close-live-chat",
            "language": "en",
            "session_id": "test_session_1",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "Live chat closed" in data["reply"]
    assert data["is_live"] is False

    # Verify session deactivated
    db_session.expire_all()
    live_session = db_session.exec(stmt).first()
    assert live_session is not None
    assert live_session.is_active is False


@pytest.mark.asyncio
async def test_live_chat_reactivation(client: AsyncClient, db_session: Session):
    session_id = "test_reactivation"
    # 1. Start session
    await client.post(
        "/api/v1/chat",
        json={"message": "/live-chat", "language": "en", "session_id": session_id},
    )
    # 2. Close session
    await client.post(
        "/api/v1/chat",
        json={
            "message": "/close-live-chat",
            "language": "en",
            "session_id": session_id,
        },
    )
    # 3. Reactivate session (This caused the 500 error before)
    response = await client.post(
        "/api/v1/chat",
        json={"message": "/live-chat", "language": "en", "session_id": session_id},
    )
    assert response.status_code == 200
    assert response.json()["is_live"] is True

    # Verify still only one record in DB
    stmt = select(LiveChatSession).where(LiveChatSession.session_id == session_id)
    results = db_session.exec(stmt).all()
    assert len(results) == 1
    assert results[0].is_active is True


@pytest.mark.asyncio
async def test_telegram_relay_and_webhook(client: AsyncClient, db_session: Session):
    session_id = "test_session_2"
    # Start live chat
    await client.post(
        "/api/v1/chat",
        json={"message": "/live-chat", "language": "en", "session_id": session_id},
    )

    # Send a message during live chat
    response = await client.post(
        "/api/v1/chat",
        json={
            "message": "Hello developer!",
            "language": "en",
            "session_id": session_id,
        },
    )
    assert response.status_code == 200
    assert response.json()["reply"] == ""  # No immediate AI reply in live mode
    assert response.json()["is_live"] is True

    # Simulate developer reply via webhook
    webhook_payload = {
        "message": {"text": "Hello visitor! I am here.", "chat": {"id": 12345}}
    }
    response = await client.post("/api/v1/chat/telegram-webhook", json=webhook_payload)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

    # Wait for background task
    await asyncio.sleep(0.1)

    # Sync and verify developer message is there
    response = await client.get(f"/api/v1/chat/sync/{session_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["is_active"] is True
    messages = data["messages"]
    assert any(
        m["content"] == "Hello visitor! I am here." and m["role"] == "assistant"
        for m in messages
    )


@pytest.mark.asyncio
async def test_sync_endpoint(client: AsyncClient, db_session: Session):
    session_id = "test_session_3"
    # Add some messages manually
    msg1 = ChatMessage(role="user", content="Hi", session_id=session_id)
    msg2 = ChatMessage(role="assistant", content="Hello", session_id=session_id)
    db_session.add(msg1)
    db_session.add(msg2)
    db_session.commit()

    response = await client.get(f"/api/v1/chat/sync/{session_id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data["messages"]) == 2
    assert data["messages"][0]["content"] == "Hi"
    assert data["messages"][1]["content"] == "Hello"
    assert data["is_active"] is False  # No live session yet


@pytest.mark.asyncio
async def test_telegram_webhook_precise_routing(
    client: AsyncClient, db_session: Session
):
    """
    Test that the webhook routes to the correct session based on the quoted message,
    even if it's not the most recently active one.
    """
    # 1. Start Session A
    session_a = "session_a"
    await client.post(
        "/api/v1/chat", json={"message": "/live-chat", "session_id": session_a}
    )

    # 2. Start Session B (becomes the 'most recent')
    session_b = "session_b"
    await client.post(
        "/api/v1/chat", json={"message": "/live-chat", "session_id": session_b}
    )

    # 3. Developer replies to Session A's message
    webhook_payload = {
        "message": {
            "text": "Reply to A",
            "reply_to_message": {"text": f"💬 *Message from {session_a}*:\nhello"},
        }
    }
    response = await client.post("/api/v1/chat/telegram-webhook", json=webhook_payload)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

    # Wait for background task
    await asyncio.sleep(0.1)

    # 4. Verify Session A received the message
    response = await client.get(f"/api/v1/chat/sync/{session_a}")
    data = response.json()
    assert any(
        m["content"] == "Reply to A" and m["role"] == "assistant"
        for m in data["messages"]
    )

    # 5. Verify Session B did NOT receive the message
    response = await client.get(f"/api/v1/chat/sync/{session_b}")
    data = response.json()
    assert not any(m["content"] == "Reply to A" for m in data["messages"])
