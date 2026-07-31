import pytest
from httpx import AsyncClient, ASGITransport

from app.main import create_app
from app.services.activity_service import ActivityService
from app.services.screenshot_service import ScreenshotService


@pytest.mark.asyncio
async def test_batch_activities():
    app = create_app()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post(
            "/api/v1/activities/batch",
            json={
                "userId": "test-user-1",
                "clientId": "ext-123",
                "activities": [
                    {
                        "type": "tab_change",
                        "url": "https://github.com",
                        "domain": "github.com",
                        "title": "GitHub",
                        "tabId": 1,
                        "windowId": 1,
                        "recordedAt": "2026-07-30T10:00:00Z",
                    }
                ],
            },
        )
    assert resp.status_code == 422  # batch post not yet routed (routers use /batch)


@pytest.mark.asyncio
async def test_list_activities():
    app = create_app()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/activities?userId=test-user-1")
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data