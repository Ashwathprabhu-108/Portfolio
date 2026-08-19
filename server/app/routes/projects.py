from fastapi import APIRouter, Depends, HTTPException
from supabase import create_client
from app.config import settings
from app.deps import get_current_admin
from app.models.project import Project, ProjectCreate, ProjectUpdate
from typing import List

router = APIRouter()


def get_supabase():
    return create_client(settings.supabase_url, settings.supabase_service_key)


@router.get("", response_model=List[Project])
async def list_projects():
    sb = get_supabase()
    res = sb.table("projects").select("*").order("created_at", desc=True).execute()
    return res.data


@router.post("", response_model=Project)
async def create_project(
    body: ProjectCreate,
    admin: str = Depends(get_current_admin),
):
    sb = get_supabase()
    res = sb.table("projects").insert(body.model_dump(exclude_none=True)).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create project")
    return res.data[0]


@router.put("/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    body: ProjectUpdate,
    admin: str = Depends(get_current_admin),
):
    sb = get_supabase()
    res = (
        sb.table("projects")
        .update(body.model_dump(exclude_none=True))
        .eq("id", project_id)
        .execute()
    )
    if not res.data:
        raise HTTPException(status_code=404, detail="Project not found")
    return res.data[0]


@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    admin: str = Depends(get_current_admin),
):
    sb = get_supabase()
    sb.table("projects").delete().eq("id", project_id).execute()
    return {"message": "Project deleted"}
