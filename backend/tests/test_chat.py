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
    assert response.json()["reply"] == "Hi there!"


@pytest.mark.asyncio
async def test_chat_fallback(client: AsyncClient):
    # No triggers in DB, should use fallback
    response = await client.post(
        "/api/v1/chat", json={"message": "unknown query", "language": "en"}
    )
    assert response.status_code == 200
    assert "reply" in response.json()


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
async def test_chat_feedback(client: AsyncClient):
    response = await client.post(
        "/api/v1/chat/feedback",
        json={"user_message": "hello", "assistant_reply": "Hi!", "is_helpful": True},
    )
    assert response.status_code == 200
    assert response.json() == {"status": "success"}
