from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "postgresql+asyncpg://weather:weather@localhost:5432/weather_cast"
    open_meteo_base_url: str = "https://api.open-meteo.com/v1"
    geocoding_base_url: str = "https://geocoding-api.open-meteo.com/v1"
    log_level: str = "INFO"
    weather_update_interval_minutes: int = 30


settings = Settings()
