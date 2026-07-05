from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

class SystemHealth(BaseModel):
    status: str
    uptime: float
    api_latency: float
    error_rate: float
    active_users: int
    oracle_status: str
    contract_status: str
    last_checked: datetime

class ServiceStatus(BaseModel):
    name: str
    status: str
    last_ping: datetime

class SecurityEvent(BaseModel):
    event_id: str
    type: str
    severity: str
    details: str
    timestamp: datetime

class ProductionReadinessResponse(BaseModel):
    production_score: int
    status: str
    recommendations: List[str]
