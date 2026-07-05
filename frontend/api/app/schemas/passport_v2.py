from pydantic import BaseModel, field_serializer
from datetime import datetime
from typing import List, Dict, Any

class PassportV2(BaseModel):
    passport_id: str
    wallet: str
    passport_version: str
    passport_status: str
    credit_score: int
    trust_score: int
    risk_level: str
    protocol_profiles: List[Dict[str, Any]]
    badges: List[str]
    segments: List[str]
    oracle_attestation_id: str
    oracle_verified: bool
    passport_hash: str
    issued_at: datetime
    expires_at: datetime
    metadata_uri: str

    @field_serializer("issued_at")
    def serialize_issued_at(self, issued_at: datetime, _info):
        s = issued_at.isoformat()
        if s.endswith("+00:00"):
            return s[:-6] + "Z"
        return s

    @field_serializer("expires_at")
    def serialize_expires_at(self, expires_at: datetime, _info):
        s = expires_at.isoformat()
        if s.endswith("+00:00"):
            return s[:-6] + "Z"
        return s
