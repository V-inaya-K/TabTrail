import structlog

from app.core.exceptions import NotFoundError as AppNotFoundError
from app.models.screenshot import (
    ScreenshotBatchRequest,
    ScreenshotFilter,
    PaginatedResponse,
)
from app.repositories.screenshot_repo import ScreenshotRepository

logger = structlog.get_logger(__name__)


class ScreenshotService:
    def __init__(self) -> None:
        self.repo = ScreenshotRepository()

    async def create_batch(self, batch: ScreenshotBatchRequest) -> dict:
        docs = []
        for screenshot in batch.screenshots:
            docs.append({
                "userId": batch.userId,
                "clientId": screenshot.clientId,
                "url": screenshot.url,
                "domain": screenshot.domain,
                "tabId": screenshot.tabId or 0,
                "imageBase64": screenshot.imageBase64,
                "imageWidth": screenshot.imageWidth or 0,
                "imageHeight": screenshot.imageHeight or 0,
                "fileSizeBytes": screenshot.fileSizeBytes or 0,
                "recordedAt": screenshot.recordedAt,
            })
        count = await self.repo.insert_batch(docs)
        logger.info("screenshots_inserted", count=count, userId=batch.userId)
        return {"inserted": count}

    async def list_screenshots(self, filter_q: ScreenshotFilter, user_id: str) -> PaginatedResponse:
        import math
        items, total = await self.repo.find_many(
            user_id=user_id,
            page=filter_q.page,
            page_size=filter_q.pageSize,
            domain=filter_q.domain,
            from_date=filter_q.fromDate,
            to_date=filter_q.toDate,
        )
        for item in items:
            item["id"] = str(item.pop("_id", ""))
            item.pop("imageBase64", None)
        return PaginatedResponse(
            items=items,
            total=total,
            page=filter_q.page,
            pageSize=filter_q.pageSize,
            pages=max(1, math.ceil(total / filter_q.pageSize)),
        )

    async def get_screenshot(self, screenshot_id: str) -> dict:
        doc = await self.repo.find_one(screenshot_id)
        if not doc:
            raise AppNotFoundError("Screenshot", screenshot_id)
        doc["id"] = str(doc.pop("_id", ""))
        return doc

    async def delete_screenshot(self, screenshot_id: str) -> None:
        deleted = await self.repo.delete_one(screenshot_id)
        if not deleted:
            raise AppNotFoundError("Screenshot", screenshot_id)