from __future__ import annotations

import structlog
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_db

logger = structlog.get_logger(__name__)


class BaseRepository:
    collection_name: str

    @property
    def collection(self):
        db: AsyncIOMotorDatabase = get_db()
        return db[self.collection_name]