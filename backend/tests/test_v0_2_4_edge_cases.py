import pytest
import asyncio
from sqlmodel import select, Session, col
import database
from models import VisitorLog

@pytest.mark.asyncio
async def test_visitor_tracking_exclusions(client):
    # 1. Admin path should be excluded
    await client.get("/api/v1/admin/analytics/summary", headers={"x-admin-token": "testpass"})
    await asyncio.sleep(0.2)
    
    # 2. Asset path should be excluded
    await client.get("/styles/main.css")
    await asyncio.sleep(0.2)
    
    # 3. Docs should be excluded
    await client.get("/docs")
    await asyncio.sleep(0.2)
    
    with Session(database.engine) as session:
        # We check that NO logs were created for these specific requests
        # (Though other tests might have created logs, we look for these paths)
        stmt = select(VisitorLog).where(col(VisitorLog.path).in_([
            "/api/v1/admin/analytics/summary", 
            "/styles/main.css", 
            "/docs"
        ]))
        logs = session.exec(stmt).all()
        assert len(logs) == 0

@pytest.mark.asyncio
async def test_nlu_hints_fallback(client):
    # Request hints for a non-existent page
    response = await client.get("/api/v1/chat/hints?page_id=invalid_page&lang=en")
    assert response.status_code == 200
    hints = response.json()
    
    # Should return the default generic hints (at least 3)
    assert len(hints) >= 3
    assert any("project" in h.lower() for h in hints)

@pytest.mark.asyncio
async def test_analytics_summary_accuracy(client, db_session):
    # Seed some visitor logs
    logs = [
        VisitorLog(path="/", method="GET", ip_hash="user1", locale="en"),
        VisitorLog(path="/", method="GET", ip_hash="user1", locale="en"),
        VisitorLog(path="/about", method="GET", ip_hash="user2", locale="es"),
    ]
    for log in logs:
        db_session.add(log)
    db_session.commit()
    
    response = await client.get(
        "/api/v1/admin/analytics/summary",
        headers={"x-admin-token": "testpass"}
    )
    assert response.status_code == 200
    data = response.json()
    
    # We expect 3 total views, 2 unique visitors
    assert data["total_visitors"] >= 3
    assert data["unique_visitors"] >= 2
    
    # Popular pages check
    paths = [p["path"] for p in data["popular_pages"]]
    assert "/" in paths
    assert "/about" in paths

@pytest.mark.asyncio
async def test_analytics_visitors_pagination(client, db_session):
    # Seed many logs to test limit
    for i in range(10):
        db_session.add(VisitorLog(path=f"/test-{i}", method="GET", ip_hash="hash", locale="en"))
    db_session.commit()
    
    response = await client.get(
        "/api/v1/admin/analytics/visitors",
        headers={"x-admin-token": "testpass"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 10
    assert "ip_hash" in data[0]
    # Ensure sensitive IP is NOT present, only hash
    assert "ip" not in data[0]
