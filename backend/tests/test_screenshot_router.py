import pytest
from httpx import AsyncClient, ASGITransport

from app.main import create_app


@pytest.mark.asyncio
async def test_list_screenshots():
    app = create_app()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/screenshots?userId=test-user-1")
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert "total" in data