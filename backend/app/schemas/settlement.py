from pydantic import BaseModel
from datetime import datetime

class SettlementRequest(BaseModel):
    loan_id: str
    borrower: str
    amount: float
    asset: str
    attestation_id: str

class SettlementResult(BaseModel):
    settlement_id: str
    loan_id: str
    borrower: str
    amount: float
    status: str
    tx_hash: str
    timestamp: datetime
