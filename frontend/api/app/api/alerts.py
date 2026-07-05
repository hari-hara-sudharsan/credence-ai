import json
import asyncio
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from typing import List
from app.schemas.alert import Alert
from app.services.alert_engine import AlertEngine
from app.services.monitoring_engine import MonitoringEngine

router = APIRouter(
    prefix="/alerts",
    tags=["Credit Monitoring Alerts"]
)

@router.get("/system", response_model=List[Alert])
def get_system_alerts():
    """
    Retrieves all active alerts registered in the network.
    """
    try:
        service = AlertEngine()
        alerts = service.list_all_alerts()
        return [Alert(**a) for a in alerts]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch systemic alerts: {str(e)}")

@router.get("/{wallet}", response_model=List[Alert])
def get_wallet_alerts(wallet: str):
    """
    Retrieves active alerts registered for the wallet.
    """
    try:
        service = AlertEngine()
        alerts = service.get_alerts(wallet, resolved=False)
        return [Alert(**a) for a in alerts]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch alerts: {str(e)}")

@router.post("/monitor/{wallet}", response_model=List[Alert])
def monitor_wallet_now(wallet: str):
    """
    Executes live verification snapshot checks and generates alerts for any changes.
    """
    try:
        monitor = MonitoringEngine()
        new_alerts = monitor.monitor_wallet(wallet)
        return [Alert(**a) for a in new_alerts]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Monitoring check failed: {str(e)}")

@router.post("/resolve/{alert_id}")
def resolve_alert_id(alert_id: str):
    """
    Resolves an active alert log.
    """
    try:
        service = AlertEngine()
        success = service.resolve_alert(alert_id)
        if not success:
            raise HTTPException(status_code=404, detail="Alert not found")
        return {"resolved": True, "alert_id": alert_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to resolve alert: {str(e)}")
@router.get("/stream/{wallet}")
def stream_wallet_alerts(wallet: str):
    """
    Establishes Server Sent Events (SSE) channel pushing credit alerts dynamically.
    """
    async def event_generator():
        engine = AlertEngine()
        q = engine.subscribe(wallet)
        
        # Initial connect ping
        yield f"data: {json.dumps({'status': 'CONNECTED', 'wallet': wallet})}\n\n"
        
        try:
            while True:
                # Check for queue alerts
                while not q.empty():
                    alert = q.get_nowait()
                    yield f"data: {json.dumps(alert)}\n\n"
                
                await asyncio.sleep(0.5)
        except asyncio.CancelledError:
            pass
        finally:
            engine.unsubscribe(wallet, q)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
