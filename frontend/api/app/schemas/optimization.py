from pydantic import BaseModel, field_serializer
from typing import List
from datetime import datetime

class OptimizationAction(BaseModel):
    action_id: str
    title: str
    description: str
    difficulty: str # "EASY" | "MEDIUM" | "HARD"
    expected_score_gain: int
    estimated_time_days: int
    priority: int

class OptimizationPlan(BaseModel):
    wallet: str
    current_score: int
    target_score: int
    estimated_days: int
    actions: List[OptimizationAction]
    created_at: datetime

    @field_serializer("created_at")
    def serialize_created_at(self, created_at: datetime, _info):
        s = created_at.isoformat()
        if s.endswith("+00:00"):
            return s[:-6] + "Z"
        return s

class SimulationResult(BaseModel):
    wallet: str
    action: str
    current_score: int
    predicted_score: int
    score_difference: int
    confidence: float
    reason: str

class GoalRequest(BaseModel):
    wallet: str
    target_goal: str

class GoalResponse(BaseModel):
    current_status: str
    target: str
    required_actions: List[str]
    estimated_completion: str
