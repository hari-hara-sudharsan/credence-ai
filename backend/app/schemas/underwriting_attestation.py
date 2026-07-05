from pydantic import BaseModel
from datetime import datetime

class UnderwritingAttestation(BaseModel):
    wallet: str
    offer_id: str
    offer_hash: str
    credit_score: int
    risk_level: str
    approved_amount: float
    interest_rate: float
    collateral_ratio: float
    duration_days: int
    issued_at: datetime
    expires_at: datetime
    oracle_version: str
    signature: str
    attestation_id: str
    attestation_version: str
