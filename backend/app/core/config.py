from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "tabtrail"

    app_env: str = "development"
    log_level: str = "DEBUG"

    api_v1_prefix: str = "/api/v1"
    cors_origins: str = "http://localhost:5173"

    max_batch_size: int = 100
    max_screenshot_base64_bytes: int = 1_048_576  # 1MB

    # Groq Vision AI
    groq_api_key: str = ""
    groq_vision_model: str = "llava-v1.5-7b-4096-preview"

    @property
    def is_development(self) -> bool:
        return self.app_env == "development"


@lru_cache
def get_settings() -> Settings:
    return Settings()