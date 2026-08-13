from pydantic_settings import BaseSettings
from typing import Optional, List


class Settings(BaseSettings):
    openai_api_key: Optional[str] = None
    openai_base_url: str = "https://api.openai.com/v1"
    openai_model: str = "gpt-4o"
    host: str = "0.0.0.0"
    port: int = 8000
    environment: str = "development"
    allowed_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

    @property
    def use_mock(self) -> bool:
        return not self.openai_api_key

    @property
    def origins_list(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]


settings = Settings()
