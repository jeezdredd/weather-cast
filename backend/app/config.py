from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "postgresql+asyncpg://weather:weather@localhost:5432/weather_cast"
    open_meteo_base_url: str = "https://api.open-meteo.com/v1"
    geocoding_base_url: str = "https://geocoding-api.open-meteo.com/v1"
    log_level: str = "INFO"
    weather_update_interval_minutes: int = 30
    allowed_origins: str = "http://localhost:3000"

    @model_validator(mode="after")
    def fix_database_url(self):
        if self.database_url.startswith("postgresql://"):
            self.database_url = self.database_url.replace(
                "postgresql://", "postgresql+asyncpg://", 1
            )
        return self


settings = Settings()
