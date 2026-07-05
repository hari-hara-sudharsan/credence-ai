from datetime import datetime
from pydantic import BaseModel, field_serializer

class LoanOffer(BaseModel):
    offer_id: str
    wallet: str
    credit_score: int
    rating: str
    risk_level: str
    approved: bool
    approved_amount: float
    interest_rate: float
    collateral_ratio: float
    duration_days: int
    expires_at: datetime
    reason: str
    offer_hash: str

    @field_serializer("expires_at")
    def serialize_expires_at(self, expires_at: datetime, _info):
        s = expires_at.isoformat()
        if s.endswith("+00:00"):
            return s[:-6] + "Z"
        return s
