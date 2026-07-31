from fastapi import APIRouter, Depends, Query

from app.models.activity import ActivityBatchRequest, ActivityFilter
from app.services.activity_service import ActivityService

router = APIRouter()


def get_activity_service() -> ActivityService:
    return ActivityService()


@router.post("/activities/batch")
async def create_activities_batch(
    batch: ActivityBatchRequest,
    svc: ActivityService = Depends(get_activity_service),
):
    result = await svc.create_batch(batch)
    return result


@router.get("/activities")
async def list_activities(
    userId: str = Query(...),
    page: int = Query(default=1, ge=1),
    pageSize: int = Query(default=50, ge=1, le=200),
    type: str | None = Query(default=None),
    domain: str | None = Query(default=None),
    url: str | None = Query(default=None),
    fromDate: str | None = Query(default=None, alias="from"),
    toDate: str | None = Query(default=None, alias="to"),
    service: ActivityService = Depends(get_activity_service),
):
    from datetime import datetime

    filters = ActivityFilter(
        page=page,
        pageSize=pageSize,
        type=type,
        domain=domain,
        url=url,
        fromDate=datetime.fromisoformat(fromDate) if fromDate else None,
        toDate=datetime.fromisoformat(toDate) if toDate else None,
    )
    return await service.list_activities(filters, userId)


@router.get("/activities/{activity_id}")
async def get_activity(
    activity_id: str,
    service: ActivityService = Depends(get_activity_service),
):
    return await service.get_activity(activity_id)


@router.delete("/activities/{activity_id}")
async def delete_activity(
    activity_id: str,
    service: ActivityService = Depends(get_activity_service),
):
    await service.delete_activity(activity_id)
    return {"deleted": True}


@router.get("/activities/stats")
async def get_activity_stats(
    userId: str = Query(...),
    service: ActivityService = Depends(get_activity_service),
):
    return await service.get_stats(userId)