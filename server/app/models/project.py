from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = []
    live_link: Optional[str] = None
    github_link: Optional[str] = None
    image_url: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    title: Optional[str] = None


class Project(ProjectBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
