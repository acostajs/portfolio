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
