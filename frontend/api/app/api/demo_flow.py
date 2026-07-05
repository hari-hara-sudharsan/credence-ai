from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timezone
import uuid
from typing import List
from app.database.persistence import read_json, write_json
from app.schemas.demo_flow import DemoSession

router = APIRouter(
    prefix="/demo-flow",
    tags=["Demo Flow State Machine"]
)

class StartRequest(BaseModel):
    wallet: str

class NextRequest(BaseModel):
    session_id: str
    next_stage: str

DB_FILENAME = "demo_sessions.json"

@router.post("/start", response_model=DemoSession)
def start_demo(request: StartRequest):
    session_id = "sess_" + str(uuid.uuid4()).replace("-", "")[:12]
    session = {
        "session_id": session_id,
        "wallet": request.wallet.lower(),
        "current_stage": "CONNECT_WALLET",
        "completed_steps": [],
        "started_at": datetime.now(timezone.utc).isoformat()
    }
    
    db = read_json(DB_FILENAME, {})
    db[session_id] = session
    write_json(DB_FILENAME, db)
    return session

@router.post("/next", response_model=DemoSession)
def next_stage(request: NextRequest):
    db = read_json(DB_FILENAME, {})
    if request.session_id not in db:
        raise HTTPException(status_code=404, detail="Demo session not found")
    
    session = db[request.session_id]
    current = session["current_stage"]
    
    if current not in session["completed_steps"]:
        session["completed_steps"].append(current)
        
    session["current_stage"] = request.next_stage
    db[request.session_id] = session
    write_json(DB_FILENAME, db)
    return session

@router.get("/status/{session_id}", response_model=DemoSession)
def get_status(session_id: str):
    db = read_json(DB_FILENAME, {})
    if session_id not in db:
        raise HTTPException(status_code=404, detail="Demo session not found")
    return db[session_id]
