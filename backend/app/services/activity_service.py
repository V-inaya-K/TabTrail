import math
from datetime import datetime
from urllib.parse import urlparse

import structlog

from app.core.exceptions import NotFoundError as AppNotFoundError
from app.models.activity import (
    ActivityBatchRequest,
    ActivityFilter,
    ActivityIn,
    ActivityOut,
    ActivityStats,
    PaginatedResponse,
)
from app.repositories.activity_repo import ActivityRepository

logger = structlog.get_logger(__name__)


class ActivityService:
    def __init__(self) -> None:
        self.repo = ActivityRepository()

    @staticmethod
    def _extract_domain(url: str) -> str:
        try:
            return urlparse(url).netloc or ""
        except Exception:
            return ""

    async def create_batch(self, batch: ActivityBatchRequest) -> dict:
        docs = []
        for activity in batch.activities:
            domain = activity.domain or self._extract_domain(activity.url)
            docs.append({
                "userId": batch.userId,
                "clientId": activity.clientId,
                "type": activity.type.value,
                "url": activity.url,
                "domain": domain,
                "title": activity.title,
                "tabId": activity.tabId or 0,
                "windowId": activity.windowId or 0,
                "metadata": activity.metadata or {},
                "recordedAt": activity.recordedAt,
            })
        count = await self.repo.insert_batch(docs)
        logger.info("activities_inserted", count=count, userId=batch.userId)
        return {"inserted": count}

    async def list_activities(self, filter_q: ActivityFilter, user_id: str) -> PaginatedResponse:
        items, total = await self.repo.find_many(
            user_id=user_id,
            page=filter_q.page,
            page_size=filter_q.pageSize,
            activity_type=filter_q.type.value if filter_q.type else None,
            domain=filter_q.domain,
            url=filter_q.url,
            from_date=filter_q.fromDate,
            to_date=filter_q.toDate,
        )
        for item in items:
            item["id"] = str(item.pop("_id", ""))
        return PaginatedResponse(
            items=items,
            total=total,
            page=filter_q.page,
            pageSize=filter_q.pageSize,
            pages=max(1, math.ceil(total / filter_q.pageSize)),
        )

    async def get_activity(self, activity_id: str) -> dict:
        doc = await self.repo.find_one(activity_id)
        if not doc:
            raise AppNotFoundError("Activity", activity_id)
        doc["id"] = str(doc.pop("_id", ""))
        return doc

    async def delete_activity(self, activity_id: str) -> None:
        deleted = await self.repo.delete_one(activity_id)
        if not deleted:
            raise AppNotFoundError("Activity", activity_id)

    async def get_stats(self, user_id: str) -> ActivityStats:
        raw = await self.repo.aggregate_stats(user_id)
        return ActivityStats(**raw)