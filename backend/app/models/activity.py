from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field, field_validator


class ActivityType(str, Enum):
    tab_change = "tab_change"
    navigation = "navigation"
    click = "click"
    scroll = "scroll"


class ActivityBase(BaseModel):
    clientId: str | None = None
    type: ActivityType
    url: str = ""
    domain: str = ""
    title: str | None = None
    tabId: int = 0
    windowId: int = 0
    metadata: dict[str, Any] | None = None
    recordedAt: datetime


class ActivityIn(ActivityBase):
    @field_validator("domain", mode="before")
    @classmethod
    def default_domain(cls, v: str) -> str:
        return v or ""


class ActivityOut(ActivityBase):
    id: str = Field(alias="_id")
    userId: str
    createdAt: datetime

    model_config = {"populate_by_name": True}


class ActivityBatchRequest(BaseModel):
    userId: str
    clientId: str
    activities: list[ActivityIn]

    @field_validator("activities")
    @classmethod
    def max_batch_size(cls, v: list[ActivityIn]) -> list[ActivityIn]:
        if len(v) > 100:
            raise ValueError("Batch size must not exceed 100 activities")
        return v


class ActivityFilter(BaseModel):
    page: int = Field(default=1, ge=1)
    pageSize: int = Field(default=50, ge=1, le=200)
    type: ActivityType | None = None
    domain: str | None = None
    url: str | None = None
    fromDate: datetime | None = Field(default=None, alias="from")
    toDate: datetime | None = Field(default=None, alias="to")


class PaginatedResponse(BaseModel):
    items: list[Any]
    total: int
    page: int
    pageSize: int
    pages: int


class ActivityStats(BaseModel):
    totalActivities: int
    topDomains: list[dict[str, Any]]
    activityByHour: list[dict[str, Any]]
    typeBreakdown: dict[str, int]