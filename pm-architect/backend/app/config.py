from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional


class Settings(BaseSettings):
  gemini_api_key: str = Field(..., env="GEMINI_API_KEY")
  cors_origins: List[AnyHttpUrl] = Field(default_factory=list, env="CORS_ORIGINS")
  model_name: str = Field(default="gemini-2.5-pro", env="GEMINI_MODEL")
  use_dummy_agents: bool = Field(default=False, env="USE_DUMMY_AGENTS")
  use_researcher: bool = Field(default=True, env="USE_RESEARCHER")
  use_validator: bool = Field(default=True, env="USE_VALIDATOR")
  validator_model: Optional[str] = Field(default=None, env="VALIDATOR_MODEL")

  model_config = SettingsConfigDict(
    case_sensitive=False,
    env_file=".env",
    extra="ignore",
    protected_namespaces=("settings_",),
  )


settings = Settings()  # type: ignore[call-arg]


