import pytest
from httpx import AsyncClient

ADMIN_HEADERS = {"X-Admin-Token": "testpass"}


@pytest.mark.asyncio
async def test_admin_upload_invalid_extension(client: AsyncClient):
    files = {"file": ("test.txt", b"not an image", "text/plain")}
    response = await client.post(
        "/api/v1/admin/upload",
        files=files,
        headers=ADMIN_HEADERS,
    )
    assert response.status_code == 400
    assert "Invalid file extension" in response.json()["detail"]


@pytest.mark.asyncio
async def test_admin_upload_file_too_large(client: AsyncClient):
    # Create a large dummy content (5MB + 1 byte)
    large_content = b"a" * (5 * 1024 * 1024 + 1)
    files = {"file": ("large.png", large_content, "image/png")}
    response = await client.post(
        "/api/v1/admin/upload",
        files=files,
        headers=ADMIN_HEADERS,
    )
    assert response.status_code == 400
    assert "File too large" in response.json()["detail"]


@pytest.mark.asyncio
async def test_admin_experience_update_not_found(client: AsyncClient):
    exp_data = {"company": "ghost", "role": "dev", "period": "2020", "order": 1}
    response = await client.put(
        "/api/v1/admin/experience/9999", json=exp_data, headers=ADMIN_HEADERS
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_admin_blog_update_not_found(client: AsyncClient):
    post_data = {"title_en": "title", "slug": "slug", "date": "2026", "category": "cat"}
    response = await client.put(
        "/api/v1/admin/blog/9999", json=post_data, headers=ADMIN_HEADERS
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_admin_chat_triggers_update_not_found(client: AsyncClient):
    trigger_data = {"module": "m", "triggers": ["t"]}
    response = await client.put(
        "/api/v1/admin/chat-triggers/9999", json=trigger_data, headers=ADMIN_HEADERS
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_admin_schema_ignores_id_on_create(client: AsyncClient):
    """
    Test that providing an 'id' in the POST body is ignored or handled 
    by the schema (since we use ProjectCreate which excludes id).
    """
    project_data = {
        "id": 9999,  # Should be ignored
        "title": "Schema Test",
        "description_en": "Testing if id is ignored",
        "tech": ["Python"],
        "order": 1,
    }
    response = await client.post(
        "/api/v1/admin/projects", json=project_data, headers=ADMIN_HEADERS
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] != 9999  # Should have been auto-incremented, not 9999
    assert data["title"] == "Schema Test"


@pytest.mark.asyncio
async def test_admin_partial_update(client: AsyncClient):
    """
    Test that updating only one field works correctly (partial update).
    """
    # 1. Create a project
    project_data = {
        "title": "Initial Title",
        "description_en": "Initial Desc",
        "tech": ["Python"],
        "order": 1,
    }
    response = await client.post(
        "/api/v1/admin/projects", json=project_data, headers=ADMIN_HEADERS
    )
    project_id = response.json()["id"]

    # 2. Update ONLY the title
    update_data = {"title": "Updated Title"}
    response = await client.put(
        f"/api/v1/admin/projects/{project_id}", json=update_data, headers=ADMIN_HEADERS
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["description_en"] == "Initial Desc"  # Should remain unchanged


