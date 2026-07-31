import base64
import json
import logging
import io
from typing import Optional

from openai import AsyncOpenAI
from PIL import Image
import pytesseract

from app.core.config import get_settings

logger = logging.getLogger(__name__)

VISION_PROMPT = """Analyze this screenshot of a browser window. Respond with valid JSON only, no markdown or explanation. Use this exact schema:
{
  "summary": "one sentence describing what the user sees on screen",
  "uiElements": ["button text", "form field label", "dialog title", "menu item", "link text"],
  "workflowContext": "a short phrase describing the likely user task or workflow (e.g. 'reading documentation', 'filling a checkout form', 'browsing social media', 'coding in an IDE')",
  "pageCategory": "one of: coding, shopping, reading, social, finance, productivity, entertainment, search, other"
}"""


class VisionAnalysisService:
    """Analyzes screenshots using the Groq API with Tesseract OCR fallback."""

    def __init__(self) -> None:
        settings = get_settings()
        self._api_key = settings.groq_api_key
        self._model = settings.groq_vision_model
        self._enabled = bool(self._api_key and self._api_key not in ("", "your-groq-api-key"))

    async def analyze(self, image_base64: str) -> dict:
        if self._enabled:
            return await self._groq_analyze(image_base64)
        return self._ocr_fallback(image_base64)

    async def _groq_analyze(self, image_base64: str) -> dict:
        client = AsyncOpenAI(
            base_url="https://api.groq.com/openai/v1",
            api_key=self._api_key,
        )

        data_uri = f"data:image/jpeg;base64,{image_base64}"

        try:
            response = await client.chat.completions.create(
                model=self._model,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": VISION_PROMPT},
                            {
                                "type": "image_url",
                                "image_url": {"url": data_uri, "detail": "low"},
                            },
                        ],
                    }
                ],
                max_tokens=400,
                temperature=0.1,
            )
            raw = response.choices[0].message.content
            return self._parse_json(raw)

        except Exception as exc:
            logger.warning("groq_vision_failed", error=str(exc))
            return self._ocr_fallback(image_base64)

    def _ocr_fallback(self, image_base64: str) -> dict:
        try:
            raw = base64.b64decode(image_base64)
            img = Image.open(__import__("io").BytesIO(raw))
            text = pytesseract.image_to_string(img, lang="eng", timeout=10)
            words = text.split()
            summary = " ".join(words[:60]) if words else "OCR could not extract readable text."
            return {
                "summary": summary,
                "uiElements": [],
                "workflowContext": "Unknown (OCR fallback)",
                "pageCategory": "other",
                "ocr_text": text[:500],
            }
        except Exception as exc:
            logger.warning("ocr_failed", error=str(exc))
            return {
                "summary": "Screenshot analysis unavailable.",
                "uiElements": [],
                "workflowContext": "Unknown",
                "pageCategory": "other",
            }

    @staticmethod
    def _parse_json(raw: str | None) -> dict:
        if not raw:
            return {"summary": "", "uiElements": [], "workflowContext": "Unknown", "pageCategory": "other"}
        cleaned = raw.strip()
        for _ in range(3):
            try:
                return json.loads(cleaned)
            except json.JSONDecodeError:
                idx = cleaned.rfind("}")
                if idx >= 0:
                    cleaned = cleaned[: idx + 1]
        return {"summary": cleaned[:200], "uiElements": [], "workflowContext": "Unknown", "pageCategory": "other"}