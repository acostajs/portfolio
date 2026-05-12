import pytest
from httpx import AsyncClient
from sqlmodel import Session

ADMIN_HEADERS = {"X-Admin-Token": "testpass"}


@pytest.mark.asyncio
async def test_admin_verify_success(client: AsyncClient):
    response = await client.get("/api/v1/admin/verify", headers=ADMIN_HEADERS)
    assert response.status_code == 200
    assert response.json() == {"status": "authenticated"}


@pytest.mark.asyncio
async def test_admin_verify_unauthorized(client: AsyncClient):
    response = await client.get(
        "/api/v1/admin/verify", headers={"X-Admin-Password": "wrong"}
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_admin_about_crud(client: AsyncClient):
    # Create/Update
    about_data = {
        "p1_en": "Updated P1",
        "p1_es": "P1 ES",
        "p1_fr": "P1 FR",
        "p2_en": "P2 EN",
        "p2_es": "P2 ES",
        "p2_fr": "P2 FR",
        "skills": ["Python"],
    }
    response = await client.post(
        "/api/v1/admin/about", json=about_data, headers=ADMIN_HEADERS
    )
    assert response.status_code == 200
    assert response.json()["p1_en"] == "Updated P1"

    # Get
    response = await client.get("/api/v1/admin/about", headers=ADMIN_HEADERS)
    assert response.status_code == 200
    assert response.json()["p1_en"] == "Updated P1"


@pytest.mark.asyncio
async def test_admin_experience_crud(client: AsyncClient):
    # Create
    exp_data = {
        "company": "New Corp",
        "role": "Senior Dev",
        "period": "2021-Present",
        "description_en": ["Leading team"],
        "description_es": ["Liderando"],
        "description_fr": ["Leader"],
        "tech": ["FastAPI"],
        "order": 1,
    }
    response = await client.post(
        "/api/v1/admin/experience", json=exp_data, headers=ADMIN_HEADERS
    )
    assert response.status_code == 200
    exp_id = response.json()["id"]

    # Update
    exp_data["role"] = "Architect"
    response = await client.put(
        f"/api/v1/admin/experience/{exp_id}", json=exp_data, headers=ADMIN_HEADERS
    )
    assert response.status_code == 200
    assert response.json()["role"] == "Architect"

    # Delete
    response = await client.delete(
        f"/api/v1/admin/experience/{exp_id}", headers=ADMIN_HEADERS
    )
    assert response.status_code == 200
    assert response.json() == {"status": "success"}


@pytest.mark.asyncio
async def test_admin_projects_crud(client: AsyncClient):
    # Create
    project_data = {
        "title": "Project X",
        "description_en": "desc",
        "description_es": "desc",
        "description_fr": "desc",
        "tech": ["Bun"],
        "github": "http://github",
        "order": 1,
    }
    response = await client.post(
        "/api/v1/admin/projects", json=project_data, headers=ADMIN_HEADERS
    )
    assert response.status_code == 200
    project_id = response.json()["id"]

    # Delete
    response = await client.delete(
        f"/api/v1/admin/projects/{project_id}", headers=ADMIN_HEADERS
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_admin_projects_missing_translations(client: AsyncClient):
    # Create with only English description
    project_data = {
        "title": "Minimal Project",
        "description_en": "only english",
        "tech": ["Python"],
        "order": 1,
    }
    # description_es and description_fr are missing, should default to "" and succeed
    response = await client.post(
        "/api/v1/admin/projects", json=project_data, headers=ADMIN_HEADERS
    )
    assert response.status_code == 200
    data = response.json()
    assert data["description_es"] == ""
    assert data["description_fr"] == ""
    project_id = data["id"]

    # Cleanup
    await client.delete(f"/api/v1/admin/projects/{project_id}", headers=ADMIN_HEADERS)


@pytest.mark.asyncio
async def test_admin_projects_image_upload(client: AsyncClient):
    # 1. Create a project
    project_data = {
        "title": "Project with Image",
        "description_en": "desc",
        "description_es": "desc",
        "description_fr": "desc",
        "tech": ["Bun"],
        "order": 1,
    }
    response = await client.post(
        "/api/v1/admin/projects", json=project_data, headers=ADMIN_HEADERS
    )
    project_id = response.json()["id"]

    # 2. Upload image (Mocked)
    from unittest.mock import patch

    fake_url = "https://storage.googleapis.com/test/img.png"
    with patch("routers.admin.projects.storage.upload_file", return_value=fake_url):
        # Create a fake file for upload
        files = {"file": ("test.png", b"fake binary content", "image/png")}
        response = await client.post(
            f"/api/v1/admin/projects/{project_id}/upload-image",
            files=files,
            headers=ADMIN_HEADERS,
        )

        assert response.status_code == 200
        assert response.json()["image_url"] == fake_url

    # 3. Verify it was saved in DB
    response = await client.get("/api/v1/admin/projects", headers=ADMIN_HEADERS)
    project = next(p for p in response.json() if p["id"] == project_id)
    assert project["image"] == fake_url

    # 4. Cleanup
    with patch("routers.admin.projects.storage.delete_file"):
        await client.delete(
            f"/api/v1/admin/projects/{project_id}", headers=ADMIN_HEADERS
        )


@pytest.mark.asyncio
async def test_admin_general_upload(client: AsyncClient):
    from unittest.mock import patch

    fake_url = "https://drive.google.com/uc?id=fake_id"
    with patch("routers.admin.uploads.storage.upload_file", return_value=fake_url):
        files = {"file": ("test.png", b"fake binary content", "image/png")}
        response = await client.post(
            "/api/v1/admin/upload",
            files=files,
            headers=ADMIN_HEADERS,
        )

        assert response.status_code == 200
        assert response.json()["image_url"] == fake_url


@pytest.mark.asyncio
async def test_admin_blog_crud(client: AsyncClient):
    # Create
    post_data = {
        "title_en": "Blog Post",
        "title_es": "Blog Post",
        "title_fr": "Blog Post",
        "slug": "blog-post",
        "date": "2026-05-10",
        "category": "Test",
        "excerpt_en": "exc",
        "excerpt_es": "exc",
        "excerpt_fr": "exc",
        "content_en": "cont",
        "content_es": "cont",
        "content_fr": "cont",
        "published": True,
    }
    response = await client.post(
        "/api/v1/admin/blog", json=post_data, headers=ADMIN_HEADERS
    )
    assert response.status_code == 200
    post_id = response.json()["id"]

    # Delete
    response = await client.delete(
        f"/api/v1/admin/blog/{post_id}", headers=ADMIN_HEADERS
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_admin_chat_triggers_crud(client: AsyncClient):
    # Create
    trigger_data = {
        "module": "test",
        "category": "test",
        "triggers": ["test"],
        "answers_en": ["test"],
        "answers_es": ["test"],
        "answers_fr": ["test"],
    }
    response = await client.post(
        "/api/v1/admin/chat-triggers", json=trigger_data, headers=ADMIN_HEADERS
    )
    assert response.status_code == 200
    trigger_id = response.json()["id"]

    # Delete
    response = await client.delete(
        f"/api/v1/admin/chat-triggers/{trigger_id}", headers=ADMIN_HEADERS
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_admin_analytics(client: AsyncClient, db_session: Session):
    # Seed some data
    from models import ChatFeedback, ChatMessage
    db_session.add(ChatMessage(role="user", content="hello"))
    db_session.add(ChatFeedback(
        user_message="hello",
        assistant_reply="Hi!",
        is_helpful=True,
        module="greetings",
        category="welcome"
    ))
    db_session.commit()

    response = await client.get(
        "/api/v1/admin/analytics/messages", headers=ADMIN_HEADERS
    )
    assert response.status_code == 200
    assert len(response.json()) >= 1

    response = await client.get(
        "/api/v1/admin/analytics/feedback", headers=ADMIN_HEADERS
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["module"] == "greetings"
    assert data[0]["category"] == "welcome"
