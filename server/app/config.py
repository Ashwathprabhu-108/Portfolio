from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    supabase_url: str
    supabase_service_key: str
    jwt_secret: str
    admin_email: str
    admin_password: str

    class Config:
        env_file = ".env"

settings = Settings()
