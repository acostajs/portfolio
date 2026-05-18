import pytest
from httpx import AsyncClient

ADMIN_HEADERS = {"X-Admin-Token": "testpass"}


@pytest.mark.asyncio
async def test_admin_rate_limiting(client: AsyncClient):
    """
    Test that admin endpoints are rate-limited.
    The current limit is 10 per minute for POST/PUT/DELETE.
    """
    # Use an endpoint that doesn't have complex side effects or data requirements
    # 'admin/verify' might be a good candidate if it was decorated, but it's not.
    # Let's use 'admin/about' which is decorated and relatively simple.

    about_data = {"p1_en": "Rate limit test", "skills": ["Test"]}

    # Hit the limit (10 allowed)
    for i in range(10):
        response = await client.post(
            "/api/v1/admin/about", json=about_data, headers=ADMIN_HEADERS
        )
        assert response.status_code == 200

    # The 11th request should be rate-limited (429)
    response = await client.post(
        "/api/v1/admin/about", json=about_data, headers=ADMIN_HEADERS
    )
    assert response.status_code == 429
    assert "Rate limit exceeded" in response.json()["error"]
