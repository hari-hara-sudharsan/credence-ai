from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class DemoStep(BaseModel):
    step_id: str
    service: str
    input: Dict[str, Any]
    output: Dict[str, Any]
    success: bool
    execution_time: float

class DemoScenario(BaseModel):
    scenario_id: str
    name: str
    description: str
    steps: List[DemoStep]
    status: str
    duration: float

class ValidationResult(BaseModel):
    test_name: str
    component: str
    passed: bool
    latency: float
    details: str

class JudgeModeResponse(BaseModel):
    story: str
    steps: List[str]
    technical_highlights: List[str]
