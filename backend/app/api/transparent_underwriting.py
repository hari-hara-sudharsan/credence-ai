"""
Transparent Underwriting API — Explainable credit reports.
"""
from fastapi import APIRouter, HTTPException
from dataclasses import asdict
from app.services.transparent_underwriting_engine import TransparentUnderwritingEngine

router = APIRouter(
    prefix="/underwriting",
    tags=["Transparent Underwriting"],
)


@router.get("/report/{wallet}")
def get_credit_report(wallet: str):
    """Full transparent credit report with factor-by-factor breakdown."""
    try:
        engine = TransparentUnderwritingEngine()
        report = engine.generate_credit_report(wallet)
        result = asdict(report)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")


@router.get("/factors/{wallet}")
def get_scoring_factors(wallet: str):
    """Individual scoring factors with percentages."""
    try:
        engine = TransparentUnderwritingEngine()
        return engine.generate_risk_breakdown(wallet)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get factors: {str(e)}")
