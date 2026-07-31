import math
import structlog

from app.core.exceptions import NotFoundError as AppNotFoundError
from app.models.screenshot import (
    ScreenshotBatchRequest,
    ScreenshotFilter,
    PaginatedResponse,
)
from app.repositories.screenshot_repo import ScreenshotRepository
from app.services.ai_analysis import VisionAnalysisService

logger = structlog.get_logger(__name__)


class ScreenshotService:
    def __init__(self) -> None:
        self.repo = ScreenshotRepository()
        self.ai = VisionAnalysisService()

    async def create_batch(self, batch: ScreenshotBatchRequest) -> dict:
        docs = []
        for screenshot in batch.screenshots:
            doc = {
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
                "aiAnalyzed": False,
            }
            docs.append(doc)

        count = await self.repo.insert_batch(docs)
        logger.info("screenshots_inserted", count=count, userId=batch.userId)

        # Analyze the first screenshot asynchronously (background)
        if docs and docs[0].get("imageBase64"):
            try:
                analysis = await self.ai.analyze(docs[0]["imageBase64"])
                if analysis:
                    await self.repo.update_analysis(docs[0]["_id"], analysis)
            except Exception:
                logger.warning("ai_analysis_deferred", screenshot_id=str(docs[0].get("_id", "")))

        return {"inserted": count}

    async def analyze_screenshot(self, screenshot_id: str) -> dict:
        doc = await self.repo.find_one(screenshot_id)
        if not doc:
            raise AppNotFoundError("Screenshot", screenshot_id)
        if not doc.get("imageBase64"):
            raise ValueError("Screenshot has no image data")

        analysis = await self.ai.analyze(doc["imageBase64"])
        await self.repo.update_analysis(screenshot_id, analysis or {})
        doc["id"] = screenshot_id
        doc.update(analysis or {})
        return doc

    async def list_screenshots(self, filter_q: ScreenshotFilter, user_id: str) -> PaginatedResponse:
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