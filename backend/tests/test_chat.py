import pytest
from httpx import AsyncClient
from sqlmodel import Session
from models import ChatTriggerResponse


@pytest.mark.asyncio
async def test_chat_trigger_match(client: AsyncClient, db_session: Session):
    trigger = ChatTriggerResponse(
        module="test",
        category="test",
        triggers=["hello", "hi"],
        answers_en=["Hi there!"],
        answers_es=["¡Hola!"],
        answers_fr=["Salut !"],
    )
    db_session.add(trigger)
    db_session.commit()

    response = await client.post(
        "/api/v1/chat", json={"message": "hello", "language": "en"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["reply"] == "Hi there!"
    assert data["module"] == "test"
    assert data["category"] == "test"


@pytest.mark.asyncio
async def test_chat_fallback(client: AsyncClient):
    # No triggers in DB, should use fallback
    response = await client.post(
        "/api/v1/chat", json={"message": "unknown query", "language": "en"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert data["module"] == "fallback"


@pytest.mark.asyncio
async def test_chat_fuzzy_match(client: AsyncClient, db_session: Session):
    trigger = ChatTriggerResponse(
        module="test",
        category="test",
        triggers=["professional experience"],
        answers_en=["I have 5 years of experience."],
        answers_es=["Tengo 5 años de experiencia."],
        answers_fr=["J'ai 5 ans d'expérience."],
    )
    db_session.add(trigger)
    db_session.commit()

    # Test with slight typo
    response = await client.post(
        "/api/v1/chat", json={"message": "profesional experience", "language": "en"}
    )
    assert response.status_code == 200
    assert response.json()["reply"] == "I have 5 years of experience."

    # Test with extra words
    response = await client.post(
        "/api/v1/chat",
        json={
            "message": "tell me about your professional experience please",
            "language": "en",
        },
    )
    assert response.status_code == 200
    assert response.json()["reply"] == "I have 5 years of experience."


@pytest.mark.asyncio
async def test_chat_language_selection(client: AsyncClient, db_session: Session):
    trigger = ChatTriggerResponse(
        module="test",
        category="test",
        triggers=["hello"],
        answers_en=["Hi!"],
        answers_es=["¡Hola!"],
        answers_fr=["Salut !"],
    )
    db_session.add(trigger)
    db_session.commit()

    # Spanish
    response = await client.post(
        "/api/v1/chat", json={"message": "hello", "language": "es"}
    )
    assert response.json()["reply"] == "¡Hola!"

    # French
    response = await client.post(
        "/api/v1/chat", json={"message": "hello", "language": "fr"}
    )
    assert response.json()["reply"] == "Salut !"


@pytest.mark.asyncio
async def test_chat_feedback(client: AsyncClient, db_session: Session):
    feedback_data = {
        "user_message": "hello",
        "assistant_reply": "Hi!",
        "is_helpful": False,
        "module": "greetings",
        "category": "welcome",
    }
    response = await client.post("/api/v1/chat/feedback", json=feedback_data)
    assert response.status_code == 200
    assert response.json() == {"status": "success"}

    # Verify storage
    from models import ChatFeedback
    from sqlmodel import select
    import asyncio

    await asyncio.sleep(0.1)  # Brief wait for background task

    statement = select(ChatFeedback).where(ChatFeedback.user_message == "hello")
    result = db_session.exec(statement).first()
    assert result is not None
    assert result.is_helpful is False
    assert result.module == "greetings"
    assert result.category == "welcome"
