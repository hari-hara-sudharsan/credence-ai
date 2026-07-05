from fastapi import APIRouter, HTTPException
from typing import List, Dict
from app.schemas.ecosystem import EcosystemMetrics, NetworkRisk, ProtocolHealth, EcosystemAlert
from app.services.ecosystem_engine import EcosystemEngine

router = APIRouter(
    prefix="/ecosystem",
    tags=["Ecosystem Intelligence Layer"]
)

@router.get("/health", response_model=EcosystemMetrics)
def get_network_health():
    """
    Returns aggregated ecosystem health score, capacity, and active adapters stats.
    """
    try:
        service = EcosystemEngine()
        result = service.calculate_network_health()
        return EcosystemMetrics(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate network health: {str(e)}")

@router.get("/risk", response_model=NetworkRisk)
def get_network_risk():
    """
    Returns systemic risk trends, events, and probability indexes.
    """
    try:
        service = EcosystemEngine()
        result = service.detect_systemic_risk()
        return NetworkRisk(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate systemic risk: {str(e)}")

@router.get("/distribution", response_model=Dict[str, int])
def get_credit_distribution():
    """
    Returns total registered wallets grouped by credit score brackets.
    """
    try:
        service = EcosystemEngine()
        dist = service.analyze_credit_distribution()
        return dist
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load credit distribution: {str(e)}")

@router.get("/protocols", response_model=List[ProtocolHealth])
def get_protocols_health():
    """
    Retrieves individual protocol performance metrics (users, volume, and average score).
    """
    try:
        service = EcosystemEngine()
        metrics = service.get_protocol_metrics()
        return [ProtocolHealth(**m) for m in metrics]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load protocol analytics: {str(e)}")

@router.get("/report")
def get_ecosystem_report():
    """
    Generates a natural language summary analysis of the credit network health.
    """
    try:
        service = EcosystemEngine()
        report_text = service.generate_ecosystem_report()
        return {"report": report_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate ecosystem report: {str(e)}")

@router.get("/alerts", response_model=List[EcosystemAlert])
def get_ecosystem_alerts():
    """
    Exposes systemic safety warnings and recommendations across the network.
    """
    try:
        service = EcosystemEngine()
        alerts = service.get_alerts()
        return [EcosystemAlert(**a) for a in alerts]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load systemic alerts: {str(e)}")
