from pydantic import BaseModel
from typing import Optional


class IncidentCreate(BaseModel):
    service: str
    description: str
    severity: str
    status: Optional[str] = "open"
    
    
class IncidentUpdate(BaseModel):
    service: str | None = None
    description: str | None = None
    severity: str | None = None
    status: str | None = None