from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class ScreenshotIn(BaseModel):
    clientId: str | None = None
    url: str
    domain: str = ""
    tabId: int = 0
    imageBase64: str
    imageWidth: int = 0
    imageHeight: int = 0
    fileSizeBytes: int = 0
    recordedAt: datetime

    @field_validator("domain", mode="before")
    @classmethod
    def default_domain(cls, v: str) -> str:
        return v or ""


class ScreenshotBatchRequest(BaseModel):
    userId: str
    clientId: str
    screenshots: list[ScreenshotIn]

    @field_validator("screenshots")
    @classmethod
    def max_batch_size(cls, v: list[ScreenshotIn]) -> list[ScreenshotIn]:
        if len(v) > 50:
            raise ValueError("Batch size must not exceed 50 screenshots")
        return v


class ScreenshotOut(BaseModel):
    id: str = Field(alias="_id")
    userId: str
    url: str
    domain: str
    tabId: int
    imageWidth: int
    imageHeight: int
    fileSizeBytes: int
    recordedAt: datetime
    createdAt: datetime
    aiSummary: str | None = None
    aiUiElements: list[str] = Field(default_factory=list)
    aiWorkflowContext: str | None = None
    aiPageCategory: str | None = None
    aiAnalyzed: bool = False

    model_config = {"populate_by_name": True}


class ScreenshotWithImage(ScreenshotOut):
    imageBase64: str

class ScreenshotAnalysisResponse(BaseModel):
    summary: str
    uiElements: list[str] = Field(default_factory=list)
    workflowContext: str | None = None
    pageCategory: str | None = None


class ScreenshotFilter(BaseModel):
    page: int = Field(default=1, ge=1)
    pageSize: int = Field(default=50, ge=1, le=100)
    domain: str | None = None
    fromDate: datetime | None = Field(default=None, alias="from")
    toDate: datetime | None = Field(default=None, alias="to")