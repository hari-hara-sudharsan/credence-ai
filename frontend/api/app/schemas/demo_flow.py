from pydantic import BaseModel
from datetime import datetime
from typing import List

class DemoSession(BaseModel):
    session_id: str
    wallet: str
    current_stage: str
    completed_steps: List[str]
    started_at: datetime
