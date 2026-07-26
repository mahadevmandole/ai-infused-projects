from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "starter_ai_app"
    api_prefix: str = "/api"


settings = Settings()
