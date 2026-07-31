import asyncio
import os

import pytest
from httpx import ASGITransport, AsyncClient
from motor.motor_asyncio import AsyncIOMotorClient

os.environ["MONGODB_URI"] = "mongodb://localhost:27017"
os.environ["MONGODB_DB_NAME"] = "tabtrail_test"
os.environ["CORS_ORIGINS"] = "*"

from app.core.database import _ensure_indexes
from app.main import create_app


@pytest.fixture
def app():
    return create_app()


@pytest.fixture
def test_db():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["tabtrail_test"]
    return db


@pytest.fixture
async def async_client(app):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac