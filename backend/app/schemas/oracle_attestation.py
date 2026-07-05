from pydantic import BaseModel, field_serializer
from datetime import datetime

class OracleAttestation(BaseModel):
    attestation_id: str
    wallet: str
    offer_id: str
    offer_hash: str
    attestation_hash: str
    oracle_address: str
    credit_score: int
    risk_level: str
    issued_at: datetime
    expires_at: datetime
    signature: str
    verified: bool
    oracle_version: str
    chain_id: int

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
