import pytest
from httpx import AsyncClient
from config import settings


@pytest.mark.asyncio
async def test_security_misconfiguration_fail_safe(client: AsyncClient, monkeypatch):
    """
    Test that the server returns a 500 error if ADMIN_PASSWORD is the default
    value in a non-development environment.
    """
    # Force environment to 'testing' (it should already be from conftest, but let's be explicit)
    monkeypatch.setattr(settings, "ENVIRONMENT", "testing")
    # Force default password
    monkeypatch.setattr(settings, "ADMIN_PASSWORD", "CHANGE_ME_IN_ENV")

    # Try to access a protected route
    response = await client.get(
        "/api/v1/admin/verify", headers={"X-Admin-Token": "CHANGE_ME_IN_ENV"}
    )

    assert response.status_code == 500
    assert "Server security misconfiguration" in response.json()["detail"]


@pytest.mark.asyncio
async def test_security_correct_config(client: AsyncClient, monkeypatch):
    """
    Test that the server works correctly when ENVIRONMENT is 'testing'
    and ADMIN_PASSWORD is set to a custom value.
    """
    monkeypatch.setattr(settings, "ENVIRONMENT", "testing")
    monkeypatch.setattr(settings, "ADMIN_PASSWORD", "secure_token_123")

    response = await client.get(
        "/api/v1/admin/verify", headers={"X-Admin-Token": "secure_token_123"}
    )

    assert response.status_code == 200
    assert response.json() == {"status": "authenticated"}


@pytest.mark.asyncio
async def test_development_mode_allows_default(client: AsyncClient, monkeypatch):
    """
    Test that in 'development' environment, the default password is permitted.
    """
    monkeypatch.setattr(settings, "ENVIRONMENT", "development")
    monkeypatch.setattr(settings, "ADMIN_PASSWORD", "CHANGE_ME_IN_ENV")

    response = await client.get(
        "/api/v1/admin/verify", headers={"X-Admin-Token": "CHANGE_ME_IN_ENV"}
    )

    assert response.status_code == 200
    assert response.json() == {"status": "authenticated"}
