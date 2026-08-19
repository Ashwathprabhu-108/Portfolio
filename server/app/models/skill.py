from pydantic import BaseModel
from typing import Optional


class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None
    proficiency: Optional[int] = None  # 1-5


class SkillCreate(SkillBase):
    pass


class SkillUpdate(SkillBase):
    name: Optional[str] = None


class Skill(SkillBase):
    id: str

    class Config:
        from_attributes = True
