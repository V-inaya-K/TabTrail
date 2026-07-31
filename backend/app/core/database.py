import structlog
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import get_settings

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None

logger = structlog.get_logger(__name__)


async def connect() -> None:
    global _client, _db
    settings = get_settings()
    _client = AsyncIOMotorClient(settings.mongodb_uri)
    _db = _client[settings.mongodb_db_name]
    await _ensure_indexes(_db)
    logger.info("mongodb_connected", uri=settings.mongodb_uri, db=settings.mongodb_db_name)


async def disconnect() -> None:
    global _client, _db
    if _client:
        _client.close()
        _client = None
        _db = None
        logger.info("mongodb_disconnected")


def get_db() -> AsyncIOMotorDatabase:
    if _db is None:
        raise RuntimeError("Database not connected. Call connect() first.")
    return _db


def get_client() -> AsyncIOMotorClient:
    if _client is None:
        raise RuntimeError("Database client not connected.")
    return _client


async def _ensure_indexes(db: AsyncIOMotorDatabase) -> None:
    await db.activities.create_index([("userId", 1), ("recordedAt", -1)])
    await db.activities.create_index([("userId", 1), ("type", 1)])
    await db.activities.create_index([("userId", 1), ("domain", 1)])
    await db.activities.create_index([("recordedAt", -1)])

    await db.screenshots.create_index([("userId", 1), ("recordedAt", -1)])
    await db.screenshots.create_index([("userId", 1), ("domain", 1)])

    logger.info("mongodb_indexes_ensured")