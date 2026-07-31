from fastapi import APIRouter, Depends, Query

from app.models.screenshot import ScreenshotBatchRequest, ScreenshotFilter
from app.services.screenshot_service import ScreenshotService

router = APIRouter()


def get_screenshot_service() -> ScreenshotService:
    return ScreenshotService()


@router.post("/screenshots/batch")
async def create_screenshots_batch(
    batch: ScreenshotBatchRequest,
    service: ScreenshotService = Depends(get_screenshot_service),
):
    result = await service.create_batch(batch)
    return result


@router.get("/screenshots")
async def list_screenshots(
    userId: str = Query(...),
    page: int = Query(default=1, ge=1),
    pageSize: int = Query(default=50, ge=1, le=100),
    domain: str | None = Query(default=None),
    fromDate: str | None = Query(default=None, alias="from"),
    toDate: str | None = Query(default=None, alias="to"),
    service: ScreenshotService = Depends(get_screenshot_service),
):
    from datetime import datetime

    filters = ScreenshotFilter(
        page=page,
        pageSize=pageSize,
        domain=domain,
        fromDate=datetime.fromisoformat(fromDate) if fromDate else None,
        toDate=datetime.fromisoformat(toDate) if toDate else None,
    )
    return await service.list_screenshots(filters, userId)


@router.get("/screenshots/{screenshot_id}")
async def get_screenshot(
    screenshot_id: str,
    service: ScreenshotService = Depends(get_screenshot_service),
):
    return await service.get_screenshot(screenshot_id)


@router.delete("/screenshots/{screenshot_id}")
async def delete_screenshot(
    screenshot_id: str,
    service: ScreenshotService = Depends(get_screenshot_service),
):
    await service.delete_screenshot(screenshot_id)
    return {"deleted": True}


@router.post("/screenshots/{screenshot_id}/analyze")
async def analyze_screenshot(
    screenshot_id: str,
    service: ScreenshotService = Depends(get_screenshot_service),
):
    result = await service.analyze_screenshot(screenshot_id)
    return result