from pydantic import BaseModel, field_serializer
from typing import List, Dict, Any
from datetime import datetime

class AgentInsight(BaseModel):
    type: str # "IMPROVEMENT" | "ALERT" | "OPPORTUNITY"
    title: str
    description: str
    severity: str # "HIGH" | "MEDIUM" | "LOW"

class AgentRequest(BaseModel):
    wallet: str
    agent_type: str # "BORROWER_AGENT" | "LENDER_AGENT" | "PROTOCOL_AGENT"
    question: str
    context: Dict[str, Any] = {}

class AgentResponse(BaseModel):
    wallet: str
    agent_type: str
    answer: str
    confidence: float
    recommendations: List[str]
    sources: List[str]
    generated_at: datetime
    decision_trace: List[str]

    @field_serializer("generated_at")
    def serialize_generated_at(self, generated_at: datetime, _info):
        s = generated_at.isoformat()
        if s.endswith("+00:00"):
            return s[:-6] + "Z"
        return s
