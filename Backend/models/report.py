from pydantic import BaseModel
from typing import Optional


class ReportCreate(BaseModel):
    report_name: str
    report_type: str
    description: Optional[str] = None


class ReportResponse(BaseModel):
    id: str
    report_name: str
    report_type: str
    description: Optional[str] = None
    status: str
    created_at: str
    downloads: int = 0