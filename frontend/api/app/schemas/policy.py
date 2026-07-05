from pydantic import BaseModel, field_serializer
from datetime import datetime
from typing import List, Union, Any

class PolicyRule(BaseModel):
    field: str
    operator: str
    value: Union[float, int, str, bool]

class Policy(BaseModel):
    policy_id: str
    policy_name: str
    protocol: str
    version: str
    rules: List[PolicyRule]
    created_at: datetime

    @field_serializer("created_at")
    def serialize_created_at(self, created_at: datetime, _info):
        s = created_at.isoformat()
        if s.endswith("+00:00"):
            return s[:-6] + "Z"
        return s

class PolicyEvaluation(BaseModel):
    wallet: str
    policy_id: str
    passed: bool
    matched_rules: int
    failed_rules: int
    score: float
    reason: str
