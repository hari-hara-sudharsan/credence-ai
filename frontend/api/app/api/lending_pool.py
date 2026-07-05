from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.lending_pool_engine import LendingPoolEngine
from app.schemas.lending_pool import PoolMetrics, LenderPosition

router = APIRouter(
    prefix="/pool",
    tags=["Decentralized Lending Pool"]
)

class DepositWithdrawRequest(BaseModel):
    wallet: str
    amount: float

class BorrowRequest(BaseModel):
    wallet: str
    amount: float
    loan_id: str

@router.post("/deposit", response_model=LenderPosition)
def pool_deposit(request: DepositWithdrawRequest):
    try:
        engine = LendingPoolEngine()
        pos = engine.deposit(request.wallet, request.amount)
        return pos
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/withdraw", response_model=LenderPosition)
def pool_withdraw(request: DepositWithdrawRequest):
    try:
        engine = LendingPoolEngine()
        pos = engine.withdraw(request.wallet, request.amount)
        return pos
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/borrow")
def pool_borrow(request: BorrowRequest):
    try:
        engine = LendingPoolEngine()
        stats = engine.allocate_credit(request.wallet, request.amount, request.loan_id)
        return {"status": "ALLOCATED", "pool_stats": stats}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class RepayRequest(BaseModel):
    wallet: str
    amount: float
    interest: float = 0.0

@router.post("/repay")
def pool_repay(request: RepayRequest):
    try:
        engine = LendingPoolEngine()
        stats = engine.process_repayment(request.amount, request.interest)
        return {"status": "REPAID", "amount": request.amount, "interest": request.interest, "pool_stats": stats}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats", response_model=PoolMetrics)
def get_pool_stats():
    try:
        engine = LendingPoolEngine()
        return engine.get_pool_metrics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/lender/{wallet}", response_model=LenderPosition)
def get_lender_position(wallet: str):
    try:
        engine = LendingPoolEngine()
        return engine.get_lender_position(wallet)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/capital-efficiency")
def get_capital_efficiency():
    """
    Returns traditional vs. Credence reputation-based capital metrics.
    """
    return {
        "traditional_required_collateral": "150%",
        "credence_required_collateral": "30%",
        "capital_saved": "120%",
        "reason": "Verified reputation credentials significantly reduce collateral deposit locks."
    }
