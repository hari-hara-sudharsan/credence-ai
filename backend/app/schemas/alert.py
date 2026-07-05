from pydantic import BaseModel, field_serializer
from datetime import datetime

class Alert(BaseModel):
    alert_id: str
    wallet: str
    alert_type: str
    severity: str # "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    title: str
    description: str
    recommendation: str
    source: str
    created_at: datetime
    resolved: bool

    @field_serializer("created_at")
    def serialize_created_at(self, created_at: datetime, _info):
        s = created_at.isoformat()
        if s.endswith("+00:00"):
            return s[:-6] + "Z"
        return s
