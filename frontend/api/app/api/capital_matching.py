"""
Capital Matching API — AI-powered lender-borrower matching endpoints.
AI recommends only. Users approve and fund.
"""
from fastapi import APIRouter, HTTPException
from app.services.capital_matching_engine import CapitalMatchingEngine
from app.services.lender_strategy_engine import LenderStrategyEngine
from app.schemas.capital_matching import LenderStrategy

router = APIRouter(
    prefix="/matching",
    tags=["AI Capital Matching"]
)


@router.post("/lender")
def match_for_lender(body: LenderStrategy):
    """
    Set lender strategy and get AI-recommended borrower matches.
    Creates/updates the strategy, then returns ranked recommendations.
    """
    try:
        strategy_engine = LenderStrategyEngine()
        strategy_engine.create_strategy(
            wallet=body.wallet,
            capital=body.capital,
            risk_preference=body.risk_preference.value,
            duration_days=body.duration_days,
            target_return=body.target_return,
        )

        matcher = CapitalMatchingEngine()
        return matcher.match_borrowers(body.wallet)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/opportunities/{wallet}")
def get_opportunities(wallet: str):
    """Get AI-matched opportunities for a lender based on their strategy."""
    try:
        matcher = CapitalMatchingEngine()
        return matcher.match_borrowers(wallet)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/strategy")
def create_strategy(body: LenderStrategy):
    """Create or update a lender's investment strategy."""
    try:
        engine = LenderStrategyEngine()
        strategy = engine.create_strategy(
            wallet=body.wallet,
            capital=body.capital,
            risk_preference=body.risk_preference.value,
            duration_days=body.duration_days,
            target_return=body.target_return,
        )
        distribution = engine.recommend_distribution(strategy)
        return {
            "strategy": strategy,
            "distribution": distribution,
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/strategy/{wallet}")
def get_strategy(wallet: str):
    """Get a lender's current strategy and rebalance recommendation."""
    try:
        engine = LenderStrategyEngine()
        strategy = engine.get_strategy(wallet)
        if not strategy:
            return {"wallet": wallet.lower(), "strategy": None, "message": "No strategy configured"}
        rebalance = engine.rebalance_strategy(wallet)
        return rebalance
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/explain/{request_id}")
def explain_match(request_id: str, lender: str = ""):
    """Get AI explanation for a specific borrower-lender match."""
    try:
        if not lender:
            raise HTTPException(status_code=400, detail="Provide ?lender=0x... query param")
        matcher = CapitalMatchingEngine()
        return matcher.explain_match(request_id, lender)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
