from fastapi import APIRouter, Depends, HTTPException
from supabase import create_client
from app.config import settings
from app.deps import get_current_admin
from app.models.skill import Skill, SkillCreate, SkillUpdate
from typing import List

router = APIRouter()


def get_supabase():
    return create_client(settings.supabase_url, settings.supabase_service_key)


@router.get("", response_model=List[Skill])
async def list_skills():
    sb = get_supabase()
    res = sb.table("skills").select("*").order("category").execute()
    return res.data


@router.post("", response_model=Skill)
async def create_skill(
    body: SkillCreate,
    admin: str = Depends(get_current_admin),
):
    sb = get_supabase()
    res = sb.table("skills").insert(body.model_dump(exclude_none=True)).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create skill")
    return res.data[0]


@router.put("/{skill_id}", response_model=Skill)
async def update_skill(
    skill_id: str,
    body: SkillUpdate,
    admin: str = Depends(get_current_admin),
):
    sb = get_supabase()
    res = (
        sb.table("skills")
        .update(body.model_dump(exclude_none=True))
        .eq("id", skill_id)
        .execute()
    )
    if not res.data:
        raise HTTPException(status_code=404, detail="Skill not found")
    return res.data[0]


@router.delete("/{skill_id}")
async def delete_skill(
    skill_id: str,
    admin: str = Depends(get_current_admin),
):
    sb = get_supabase()
    sb.table("skills").delete().eq("id", skill_id).execute()
    return {"message": "Skill deleted"}
