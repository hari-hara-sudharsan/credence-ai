from pydantic import BaseModel
from typing import List, Dict, Any

class EcosystemMetrics(BaseModel):
    network: str
    health_score: int
    status: str
    total_wallets: int
    verified_passports: int
    average_credit_score: int
    average_trust_score: int
    total_credit_capacity: float
    active_protocols: int
    ecosystem_health: str # "HEALTHY" | "STRESSED" | "CRITICAL"


class NetworkRisk(BaseModel):
    systemic_risk: str
    risk_level: str # "LOW" | "MEDIUM" | "HIGH"
    risk_score: int
    high_risk_wallets: int
    default_probability: float
    risk_trend: str # "IMPROVING" | "STABLE" | "DETERIORATING"

    detected_events: List[Dict[str, Any]]
    recommendation: str

class ProtocolHealth(BaseModel):
    protocol: str
    users: int
    average_score: int
    volume: float
    risk: str # "LOW" | "MEDIUM" | "HIGH"

class EcosystemAlert(BaseModel):
    severity: str # "HIGH" | "MEDIUM" | "LOW"
    category: str # "LIQUIDITY" | "CONCENTRATION" | "DEFAULT" | "HEALTH"
    message: str
    recommendation: str
