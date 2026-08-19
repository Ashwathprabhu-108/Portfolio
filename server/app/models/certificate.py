from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date


class CertificateBase(BaseModel):
    name: str
    issuer: Optional[str] = None
    date: Optional[date] = None
    credential_link: Optional[str] = None

    @field_validator("issuer", "credential_link", mode="before")
    @classmethod
    def empty_str_to_none(cls, v):
        if isinstance(v, str) and v.strip() == "":
            return None
        return v

    @field_validator("date", mode="before")
    @classmethod
    def empty_date_to_none(cls, v):
        if isinstance(v, str) and v.strip() == "":
            return None
        return v


class CertificateCreate(CertificateBase):
    pass


class CertificateUpdate(CertificateBase):
    name: Optional[str] = None


class Certificate(CertificateBase):
    id: str

    class Config:
        from_attributes = True
