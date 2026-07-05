from pydantic import BaseModel, field_serializer
from datetime import datetime
from typing import List, Dict, Any

class VerificationResult(BaseModel):
    wallet: str
    verification_id: str
    passport_valid: bool
    oracle_verified: bool
    credit_score: int
    trust_score: int
    risk_level: str
    protocol_profiles: List[Dict[str, Any]]
    attestation_id: str
    passport_id: str
    verified_at: datetime
    expires_at: datetime
    network_version: str
    trust_seal: str

    @field_serializer("verified_at")
    def serialize_verified_at(self, verified_at: datetime, _info):
        s = verified_at.isoformat()
        if s.endswith("+00:00"):
            return s[:-6] + "Z"
        return s

    @field_serializer("expires_at")
    def serialize_expires_at(self, expires_at: datetime, _info):
        s = expires_at.isoformat()
        if s.endswith("+00:00"):
            return s[:-6] + "Z"
        return s
