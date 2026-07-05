from pydantic import BaseModel
from typing import List, Dict, Any

class BorrowerProfile(BaseModel):
    wallet: str
    credit_score: int
    trust_score: int
    risk_level: str
    passport_verified: bool
    trust_badge: str
    available_credit: float
    protocol_profiles: List[Dict[str, Any]]
    rank: int

class LenderMatch(BaseModel):
    lender_id: str
    borrower: str
    compatibility_score: int
    expected_risk: str
    suggested_terms: Dict[str, Any]

class ProtocolMatch(BaseModel):
    protocol: str
    wallet: str
    eligibility: float
    reason: str

class NetworkConnection(BaseModel):
    type: str # "PROTOCOL" | "WALLET" | "POOL"
    name: str
    trust_relationship: int

class NetworkGraphResponse(BaseModel):
    wallet: str
    connections: List[NetworkConnection]
    network_score: int
