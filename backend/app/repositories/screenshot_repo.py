from datetime import datetime, timezone
from typing import Any

from bson import ObjectId

from app.repositories.base import BaseRepository


class ScreenshotRepository(BaseRepository):
    collection_name = "screenshots"

    async def insert_batch(self, docs: list[dict[str, Any]]) -> int:
        now = datetime.now(timezone.utc)
        for doc in docs:
            doc["createdAt"] = now
        result = await self.collection.insert_many(docs)
        return len(result.inserted_ids)

    async def find_one(self, screenshot_id: str) -> dict | None:
        return await self.collection.find_one({"_id": ObjectId(screenshot_id)})

    async def find_many(
        self,
        user_id: str,
        page: int = 1,
        page_size: int = 50,
        domain: str | None = None,
        from_date: datetime | None = None,
        to_date: datetime | None = None,
    ) -> tuple[list[dict], int]:
        filter_q: dict[str, Any] = {"userId": user_id}
        if domain:
            filter_q["domain"] = {"$regex": domain, "$options": "i"}
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

    async def delete_one(self, screenshot_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(screenshot_id)})
        return result.deleted_count > 0

    async def update_analysis(self, screenshot_id: ObjectId | str, analysis: dict) -> None:
        _id = screenshot_id if isinstance(screenshot_id, ObjectId) else ObjectId(screenshot_id)
        await self.collection.update_one(
            {"_id": _id},
            {"$set": {
                "aiSummary": analysis.get("summary", ""),
                "aiUiElements": analysis.get("uiElements", []),
                "aiWorkflowContext": analysis.get("workflowContext", ""),
                "aiPageCategory": analysis.get("pageCategory", "other"),
                "aiAnalyzed": True,
            }},
        )