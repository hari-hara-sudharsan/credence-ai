from fastapi import APIRouter, HTTPException, Path
from app.services.trust.trust_evolution_engine import TrustEvolutionEngine
from app.database.reputation_history import get_reputation_history

router = APIRouter(
    prefix="/trust",
    tags=["Trust Evolution Flywheel Engine"]
)

@router.get("/evolution/{wallet}")
def get_evolution_timeline(wallet: str = Path(..., description="Wallet address")):
    try:
        history = get_reputation_history(wallet)
        timeline = []
        for i, ev in enumerate(history.get("events", [])):
            timeline.append({
                "eventId": f"ev_{i}",
                "timestamp": ev.get("timestamp"),
                "previousScore": ev.get("previous_score", 300),
                "newScore": ev.get("current_score", 300),
                "change": f"+{ev.get('delta', 0)}" if ev.get("delta", 0) >= 0 else str(ev.get("delta", 0)),
                "reason": ev.get("reason", "Verified transaction registered")
            })
        return timeline
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/before-after/{wallet}")
def get_before_after(wallet: str = Path(..., description="Wallet address")):
    try:
        engine = TrustEvolutionEngine()
        return engine.generateBeforeAfterSnapshot(wallet)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/next-level/{wallet}")
def get_next_level(wallet: str = Path(..., description="Wallet address")):
    try:
        engine = TrustEvolutionEngine()
        return engine.calculateNextMilestone(wallet)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
