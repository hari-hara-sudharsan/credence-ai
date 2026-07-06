from fastapi import APIRouter, HTTPException
from app.services.security.security_monitor import SecurityMonitor

router = APIRouter(
    prefix="/api/v1/security",
    tags=["Security & Monitoring Telemetry"]
)

monitor = SecurityMonitor()

@router.get("/health")
def get_security_health_status():
    """
    Returns real-time health checks of smart contracts and AI scoring modules.
    """
    try:
        return monitor.monitor_protocol_health()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/wallet/{wallet}")
def run_wallet_security_audit(wallet: str):
    """
    Performs security profiling and detects abnormal behavior pattern spikes.
    """
    try:
        warnings = monitor.detect_abnormal_activity(wallet)
        risk_spike = monitor.detect_risk_spike(wallet)
        return {
            "wallet": wallet,
            "warnings": warnings,
            "riskProfile": risk_spike
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
