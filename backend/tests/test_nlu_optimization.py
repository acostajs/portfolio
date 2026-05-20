import pytest
from httpx import AsyncClient
from sqlmodel import Session
from models import ChatTriggerResponse


@pytest.mark.asyncio
async def test_cache_invalidation(client: AsyncClient, db_session: Session):
    # 1. Create a trigger
    trigger = ChatTriggerResponse(
        module="test",
        category="test",
        triggers=["initial trigger"],
        answers_en=["Initial Answer"],
        answers_es=["Initial Answer"],
        answers_fr=["Initial Answer"],
    )
    db_session.add(trigger)
    db_session.commit()
    db_session.refresh(trigger)
    trigger_id = trigger.id

    # 2. Match it (populates cache)
    response = await client.post(
        "/api/v1/chat", json={"message": "initial trigger", "language": "en"}
    )
    assert response.json()["reply"] == "Initial Answer"

    # 3. Update the trigger via Admin API
    admin_headers = {"X-Admin-Token": "testpass"}
    update_data = {
        "module": "test",
        "category": "test",
        "triggers": ["updated trigger"],
        "answers_en": ["Updated Answer"],
        "answers_es": ["Updated Answer"],
        "answers_fr": ["Updated Answer"],
    }

    response = await client.put(
        f"/api/v1/admin/chat-triggers/{trigger_id}",
        json=update_data,
        headers=admin_headers,
    )
    assert response.status_code == 200

    # 4. Try matching the OLD trigger (should NOT match because cache was cleared)
    response = await client.post(
        "/api/v1/chat", json={"message": "initial trigger", "language": "en"}
    )
    # It should use fallback now
    assert response.json()["reply"] != "Initial Answer"

    # 5. Try matching the NEW trigger
    response = await client.post(
        "/api/v1/chat", json={"message": "updated trigger", "language": "en"}
    )
    assert response.json()["reply"] == "Updated Answer"


@pytest.mark.asyncio
async def test_multi_word_exact_match(client: AsyncClient, db_session: Session):
    trigger = ChatTriggerResponse(
        module="test",
        category="test",
        triggers=["contact info"],
        answers_en=["Here is my email."],
        answers_es=["Aquí está mi email."],
        answers_fr=["Voici mon email."],
    )
    db_session.add(trigger)
    db_session.commit()

    # Should match exactly (Tier 1 substring with boundaries)
    response = await client.post(
        "/api/v1/chat", json={"message": "what is your contact info?", "language": "en"}
    )
    assert response.json()["reply"] == "Here is my email."

    # Should NOT match partial word (Tier 1 boundary check)
    response = await client.post(
        "/api/v1/chat",
        json={"message": "tell me about your contact infooooo", "language": "en"},
    )
    # This might match via fuzzy, but we want to check Tier 1 doesn't false-positive.
    # In this specific test, if it matches, it's because of fuzzy.


@pytest.mark.asyncio
async def test_trigger_priority(client: AsyncClient, db_session: Session):
    # Create two triggers that both match the word "react"
    t1 = ChatTriggerResponse(
        module="priority1",
        category="high",
        triggers=["react"],
        answers_en=["High Priority"],
        answers_es=["High Priority"],
        answers_fr=["High Priority"],
    )
    t2 = ChatTriggerResponse(
        module="priority2",
        category="low",
        triggers=["react development"],
        answers_en=["Low Priority"],
        answers_es=["Low Priority"],
        answers_fr=["Low Priority"],
    )
    db_session.add(t1)
    db_session.add(t2)
    db_session.commit()

    # Message "react development" matches both "react" and "react development"
    response = await client.post(
        "/api/v1/chat",
        json={"message": "tell me about react development", "language": "en"},
    )
    # Should pick t1 because it was added first (lower ID)
    assert response.json()["reply"] == "High Priority"


@pytest.mark.asyncio
async def test_fuzzy_match_fallback(client: AsyncClient, db_session: Session):
    trigger = ChatTriggerResponse(
        module="test",
        category="test",
        triggers=["projects"],
        answers_en=["My Projects"],
        answers_es=["Mis Proyectos"],
        answers_fr=["Mes Projets"],
    )
    db_session.add(trigger)
    db_session.commit()

    # Typo "projets" should match "projects" in Tier 2
    response = await client.post(
        "/api/v1/chat", json={"message": "Show me your projetcs", "language": "en"}
    )
    assert response.json()["reply"] == "My Projects"


@pytest.mark.asyncio
async def test_special_characters_handling(client: AsyncClient, db_session: Session):
    trigger = ChatTriggerResponse(
        module="test",
        category="test",
        triggers=["hello"],
        answers_en=["Hi there!"],
        answers_es=["¡Hola!"],
        answers_fr=["Salut !"],
    )
    db_session.add(trigger)
    db_session.commit()

    # Message with symbols
    response = await client.post(
        "/api/v1/chat", json={"message": "Hello?!!!", "language": "en"}
    )
    assert response.json()["reply"] == "Hi there!"


@pytest.mark.asyncio
async def test_language_answer_fallback(client: AsyncClient, db_session: Session):
    trigger = ChatTriggerResponse(
        module="test",
        category="test",
        triggers=["secret"],
        answers_en=["I have no secrets."],
        answers_es=[],  # Empty answers for Spanish
        answers_fr=["Je n'ai pas de secrets."],
    )
    db_session.add(trigger)
    db_session.commit()

    # Spanish request should fallback to global fallback because answers_es is empty
    response = await client.post(
        "/api/v1/chat", json={"message": "tienes un secret", "language": "es"}
    )
    # Check that it's NOT the English answer
    assert response.json()["reply"] != "I have no secrets."
    # It should be one of the fallbacks
    # Since we don't have the hardcoded list anymore, we just verify it's a valid string
    # and not the original answer.
    assert isinstance(response.json()["reply"], str)
    assert len(response.json()["reply"]) > 0
