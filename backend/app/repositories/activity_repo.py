from datetime import datetime, timezone
from typing import Any

from bson import ObjectId

from app.repositories.base import BaseRepository


class ActivityRepository(BaseRepository):
    collection_name = "activities"

    async def insert_batch(self, docs: list[dict[str, Any]]) -> int:
        now = datetime.now(timezone.utc)
        for doc in docs:
            doc["createdAt"] = now
        result = await self.collection.insert_many(docs)
        return len(result.inserted_ids)

    async def find_one(self, activity_id: str) -> dict | None:
        return await self.collection.find_one({"_id": ObjectId(activity_id)})

    async def find_many(
        self,
        user_id: str,
        page: int = 1,
        page_size: int = 50,
        activity_type: str | None = None,
        domain: str | None = None,
        url: str | None = None,
        from_date: datetime | None = None,
        to_date: datetime | None = None,
    ) -> tuple[list[dict], int]:
        filter_q: dict[str, Any] = {"userId": user_id}
        if activity_type:
            filter_q["type"] = activity_type
        if domain:
            filter_q["domain"] = {"$regex": domain, "$options": "i"}
        if url:
            filter_q["url"] = {"$regex": url, "$options": "i"}
        if from_date or to_date:
            filter_q["recordedAt"] = {}
            if from_date:
                filter_q["recordedAt"]["$gte"] = from_date
            if to_date:
                filter_q["recordedAt"]["$lte"] = to_date

        total = await self.collection.count_documents(filter_q)
        cursor = (
            self.collection.find(filter_q)
            .sort("recordedAt", -1)
            .skip((page - 1) * page_size)
            .limit(page_size)
        )
        items = await cursor.to_list(length=page_size)
        return items, total

    async def delete_one(self, activity_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(activity_id)})
        return result.deleted_count > 0

    async def aggregate_stats(self, user_id: str) -> dict[str, Any]:
        total = await self.collection.count_documents({"userId": user_id})

        top_domains_cursor = self.collection.aggregate([
            {"$match": {"userId": user_id}},
            {"$group": {"_id": "$domain", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10},
        ])
        top_domains = [
            {"domain": d["_id"] or "unknown", "count": d["count"]}
            async for d in top_domains_cursor
        ]

        hourly_cursor = self.collection.aggregate([
            {"$match": {"userId": user_id}},
            {"$group": {
                "_id": {"$hour": "$recordedAt"},
                "count": {"$sum": 1},
            }},
            {"$sort": {"_id": 1}},
        ])
        activity_by_hour = [
            {"hour": h["_id"], "count": h["count"]} async for h in hourly_cursor
        ]

        type_cursor = self.collection.aggregate([
            {"$match": {"userId": user_id}},
            {"$group": {"_id": "$type", "count": {"$sum": 1}}},
        ])
        type_breakdown = {t["_id"]: t["count"] async for t in type_cursor}

        return {
            "totalActivities": total,
            "topDomains": top_domains,
            "activityByHour": activity_by_hour,
            "typeBreakdown": type_breakdown,
        }