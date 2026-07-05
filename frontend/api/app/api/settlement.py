from fastapi import APIRouter, HTTPException
from app.schemas.settlement import SettlementRequest, SettlementResult
from app.services.settlement_engine import SettlementEngine
from app.database.persistence import read_json

router = APIRouter(
    prefix="/settlement",
    tags=["HSP Settlement Integration"]
)

@router.post("/execute")
def execute_settlement(request: SettlementRequest):
    """
    Verifies approvals and triggers stablecoin transfer settlement.
    """
    try:
        engine = SettlementEngine()
        record = engine.execute_loan_settlement(
            loan_id=request.loan_id,
            borrower=request.borrower,
            amount=request.amount,
            asset=request.asset,
            attestation_id=request.attestation_id
        )
        return {
            "approved": True,
            "settled": True,
            "settlement_network": "HSP",
            "tx_hash": record["tx_hash"],
            "settlement_id": record["settlement_id"]
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Settlement failed: {str(e)}")

@router.get("/{id}", response_model=SettlementResult)
def get_settlement_by_id(id: str):
    db = read_json("settlements.json", {})
    for record in db.values():
        if record["settlement_id"] == id:
            return record
    raise HTTPException(status_code=404, detail="Settlement not found")

@router.get("/status/{tx}")
def get_settlement_status_by_tx(tx: str):
    try:
        engine = SettlementEngine()
        status = engine.track_settlement(tx)
        return {"status": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
