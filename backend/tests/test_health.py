import pytest
from httpx import AsyncClient, ASGITransport

from app.main import create_app


@pytest.mark.asyncio
async def test_health_check():
    app = create_app()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"