"""
Ecosystem Trust & Programmable Developers API.
Exposes modular credit profiles, trust graph structures, and AI risk monitoring.
"""
from fastapi import APIRouter, HTTPException
from app.services.trust_graph_engine import TrustGraphEngine
from app.services.ai_risk_monitor import AIRiskMonitor
from app.services.transparent_underwriting_engine import TransparentUnderwritingEngine

router = APIRouter(
    prefix="/api",
    tags=["Ecosystem Trust API"]
)

trust_graph_engine = TrustGraphEngine()
risk_monitor = AIRiskMonitor()
underwriting = TransparentUnderwritingEngine()

# Support both prefixed and non-prefixed endpoints
@router.get("/v1/trust/{wallet}")
@router.get("/trust/{wallet}")
def get_trust_profile(wallet: str):
    """Ecosystem Trust Profile API."""
    try:
        report = underwriting.generate_credit_report(wallet)
        score = report.credit_score
        tier = report.badge
        risk = report.risk_level
        
        # Calculate passport ID from wallet hash
        passport_id = abs(hash(wallet)) % 1000 + 1

        return {
            "wallet": wallet.lower(),
            "trustScore": score,
            "tier": "PRIME" if score > 700 else "RETAIL" if score > 450 else "WATCHLIST",
            "risk": "LOW" if risk == "LOW" else "MEDIUM" if risk == "MEDIUM" else "HIGH",
            "verified": score > 450,
            "passportId": passport_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/v1/credit/{wallet}")
@router.get("/credit/{wallet}")
def get_credit_details(wallet: str):
    """Credit Access & Limits API."""
    try:
        report = underwriting.generate_credit_report(wallet)
        score = report.credit_score
        
        # Calculate credit parameters dynamically
        limit = int((score / 1000.0) * 15000)
        interest = round(12.0 - (score / 1000.0) * 8.0, 1)

        return {
            "limit": limit,
            "interest": max(interest, 2.5),
            "defaultProbability": report.default_probability
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/v1/reputation/{wallet}")
@router.get("/reputation/{wallet}")
def get_reputation_summary(wallet: str):
    """On-chain Reputation History API."""
    try:
        rep = trust_graph_engine.calculate_network_reputation(wallet)
        return {
            "repayments": rep["repayments"],
            "defaults": rep["defaults"],
            "history": rep["history"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/v1/profiles/{wallet}")
@router.get("/profiles/{wallet}")
def get_multi_protocol_profiles(wallet: str):
    """Multi-Protocol Credit Scores API."""
    try:
        report = underwriting.generate_credit_report(wallet)
        score = report.credit_score
        
        return {
            "lending_score": min(score + 10, 1000),
            "payment_score": min(score - 20, 1000),
            "rwa_score": min(score + 5, 1000),
            "institution_score": min(score - 15, 1000)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/v1/trust-graph/{wallet}")
def get_trust_graph_data(wallet: str):
    """Generates the visual Trust Graph Nodes and Edges."""
    try:
        return trust_graph_engine.generate_trust_graph(wallet)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/v1/risk-monitor/{wallet}")
def get_risk_monitor_data(wallet: str):
    """Exposes AI risk intelligence recommendations."""
    try:
        risk = risk_monitor.detect_default_risk(wallet)
        change = risk_monitor.predict_credit_change(wallet)
        actions = risk_monitor.recommend_actions(wallet)
        
        return {
            "risk_analysis": risk,
            "prediction": change,
            "recommendations": actions["recommendations"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
