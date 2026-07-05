from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class GovernanceAction(BaseModel):
    action_id: str
    actor: str
    role: str
    action: str
    target: str
    timestamp: datetime
    status: str
    metadata: Dict[str, Any]

class AuditLog(BaseModel):
    log_id: str
    action: str
    performed_by: str
    resource: str
    result: str
    timestamp: datetime

class Proposal(BaseModel):
    proposal_id: str
    title: str
    type: str
    status: str
    submitted_by: str
    created_at: datetime
