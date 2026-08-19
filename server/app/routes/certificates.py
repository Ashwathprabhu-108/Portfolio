from fastapi import APIRouter, Depends, HTTPException
from supabase import create_client
from app.config import settings
from app.deps import get_current_admin
from app.models.certificate import Certificate, CertificateCreate, CertificateUpdate
from typing import List

router = APIRouter()


def get_supabase():
    return create_client(settings.supabase_url, settings.supabase_service_key)


@router.get("", response_model=List[Certificate])
async def list_certificates():
    sb = get_supabase()
    res = sb.table("certificates").select("*").order("date", desc=True, nullsfirst=False).execute()
    return res.data


@router.post("", response_model=Certificate)
async def create_certificate(
    body: CertificateCreate,
    admin: str = Depends(get_current_admin),
):
    sb = get_supabase()
    res = sb.table("certificates").insert(body.model_dump(exclude_none=True)).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create certificate")
    return res.data[0]


@router.put("/{cert_id}", response_model=Certificate)
async def update_certificate(
    cert_id: str,
    body: CertificateUpdate,
    admin: str = Depends(get_current_admin),
):
    sb = get_supabase()
    res = (
        sb.table("certificates")
        .update(body.model_dump(exclude_none=True))
        .eq("id", cert_id)
        .execute()
    )
    if not res.data:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return res.data[0]


@router.delete("/{cert_id}")
async def delete_certificate(
    cert_id: str,
    admin: str = Depends(get_current_admin),
):
    sb = get_supabase()
    sb.table("certificates").delete().eq("id", cert_id).execute()
    return {"message": "Certificate deleted"}
