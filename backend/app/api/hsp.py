from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.services.hsp_trust_engine import HSPTrustEngine
from app.database.persistence import read_json

router = APIRouter(
    prefix="/hsp",
    tags=["HSP Economic Engine"]
)

class HSPCreateRequest(BaseModel):
    borrower: str
    lender: str
    amount: float
    loanId: str
    purpose: Optional[str] = "HSP Settlement"

class HSPExecuteRequest(BaseModel):
    settlementId: str

@router.post("/create")
def create_settlement(req: HSPCreateRequest):
    try:
        engine = HSPTrustEngine()
        result = engine.createTrustSettlement(
            borrower=req.borrower,
            lender=req.lender,
            amount=req.amount,
            loanId=req.loanId,
            purpose=req.purpose
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/execute")
def execute_settlement(req: HSPExecuteRequest):
    try:
        engine = HSPTrustEngine()
        result = engine.executeHSPSettlement(settlement_id=req.settlementId)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/proof/{id}")
def get_proof(id: str, wallet: Optional[str] = None):
    db = read_json("hsp_settlements.json", {})
    if id not in db:
        raise HTTPException(status_code=404, detail=f"Settlement proof {id} not found")
    record = db[id]
    
    # Calculate trust impact based on status
    status = "SUCCESS" if record.get("verified", False) else "FAILED"
    engine = HSPTrustEngine()
    trust_impact = engine.calculateTrustImpact(status)
    
    return {
        "settlement": "VERIFIED" if record.get("verified", False) else "PENDING",
        "txHash": record.get("hspProofHash"),
        "trustGenerated": f"+{trust_impact}" if trust_impact >= 0 else str(trust_impact),
        "amount": record.get("amount"),
        "borrower": wallet if wallet else record.get("borrower"),
        "lender": record.get("lender"),
        "timestamp": record.get("timestamp")
    }

@router.get("/history/{wallet}")
def get_history(wallet: str):
    db = read_json("hsp_settlements.json", {})
    wallet_lower = wallet.lower()
    history = []
    
    # Check if this wallet actually has any records in the ephemeral DB
    has_records = any(record.get("borrower", "").lower() == wallet_lower for record in db.values())
    
    for record in db.values():
        rec_borrower = record.get("borrower", "").lower()
        # If the wallet has no real records, dynamically map the default seeded ones to it for the demo
        if rec_borrower == wallet_lower or (not has_records and rec_borrower == "0x5bb83e60a7a05a0e1b077b66412a26306e334208"):
            status = "SUCCESS" if record.get("verified", False) else "FAILED"
            engine = HSPTrustEngine()
            trust_impact = engine.calculateTrustImpact(status)
            history.append({
                "settlementId": record.get("settlementId"),
                "loanId": record.get("loanId"),
                "borrower": wallet,
                "lender": record.get("lender"),
                "amount": record.get("amount"),
                "hspProofHash": record.get("hspProofHash"),
                "verified": record.get("verified", False),
                "timestamp": record.get("timestamp") or record.get("lastSettlement"),
                "trustImpact": f"+{trust_impact}" if trust_impact >= 0 else str(trust_impact)
            })
    # Sort history by timestamp descending
    history.sort(key=lambda x: x.get("timestamp") or 0, reverse=True)
    return history
