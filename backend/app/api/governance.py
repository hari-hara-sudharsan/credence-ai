from fastapi import APIRouter, HTTPException, Query, Header
from typing import List, Optional
from app.schemas.governance import GovernanceAction, AuditLog, Proposal
from app.services.governance_engine import GovernanceEngine
from app.services.audit_engine import AuditEngine
from app.services.rbac_service import RBACService

router = APIRouter(
    prefix="/governance",
    tags=["Governance & Administration"]
)

# Header value extraction helper
def get_actor_address(x_actor: Optional[str] = Header(None)) -> str:
    # Use Super Admin fallback address if header is empty (for API compatibility/testing convenience)
    return x_actor or ""

@router.get("/dashboard")
def get_governance_dashboard():
    """
    Consolidates infrastructure governance parameters.
    """
    try:
        from app.database.persistence import read_json
        oracles = read_json("oracles.json", {})
        policies = read_json("policies.json", {})
        passports = read_json("passports_v2.json", {})
        audit_logs = read_json("audit_logs.json", [])

        active_oracles = sum(1 for v in oracles.values() if v == "ACTIVE")
        pending_policies = len(policies)
        passport_data = passports.values() if isinstance(passports, dict) else []
        active_passports = sum(1 for p in passport_data if isinstance(p, dict) and p.get("status") != "REVOKED")
        revoked_passports = sum(1 for p in passport_data if isinstance(p, dict) and p.get("status") == "REVOKED")
        audit_events_today = len(audit_logs) if isinstance(audit_logs, list) else 0

        return {
            "active_oracles": active_oracles,
            "pending_policies": pending_policies,
            "active_passports": active_passports,
            "revoked_passports": revoked_passports,
            "audit_events_today": audit_events_today,
            "system_status": "HEALTHY"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/audit", response_model=List[AuditLog])
def get_audit_timeline(q: Optional[str] = Query("", description="Keyword logs search query")):
    try:
        engine = AuditEngine()
        if q:
            return engine.search_logs(q)
        return engine.get_logs()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/oracle")
def register_oracle(body: dict, x_actor: Optional[str] = Header(None)):
    try:
        actor = get_actor_address(x_actor)
        oracle = body.get("oracle")
        if not oracle:
            raise HTTPException(status_code=400, detail="Oracle address required")
        
        service = GovernanceEngine()
        return service.approve_oracle(actor, oracle)
    except PermissionError as pe:
        raise HTTPException(status_code=403, detail=str(pe))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/oracle/{id}")
def update_oracle_status(id: str, body: dict, x_actor: Optional[str] = Header(None)):
    try:
        actor = get_actor_address(x_actor)
        status = body.get("status")
        service = GovernanceEngine()
        if status == "REVOKED":
            return service.revoke_oracle(actor, id)
        return {"oracle": id, "status": status}
    except PermissionError as pe:
        raise HTTPException(status_code=403, detail=str(pe))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/policy")
def register_policy_rule(body: dict, x_actor: Optional[str] = Header(None)):
    try:
        actor = get_actor_address(x_actor)
        rbac = RBACService()
        if not rbac.has_permission(actor, "APPROVE_POLICY"):
            raise PermissionError("Unauthorized to approve policies")
        
        title = body.get("title", "New Policy Rule")
        engine = GovernanceEngine()
        prop = engine.create_proposal(actor, title, "POLICY")
        return {"policy": prop, "status": "PENDING"}
    except PermissionError as pe:
        raise HTTPException(status_code=403, detail=str(pe))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/passport/{id}")
def update_passport_state(id: str, body: dict, x_actor: Optional[str] = Header(None)):
    try:
        actor = get_actor_address(x_actor)
        status = body.get("status", "ACTIVE")
        
        audit = AuditEngine()
        audit.record_event(
            action="UPDATE_PASSPORT_STATUS",
            performed_by=actor,
            resource=id,
            result=f"Passport set to status: {status}"
        )
        return {"passport_id": id, "status": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/roles")
def get_active_roles():
    try:
        rbac = RBACService()
        return rbac.list_roles()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Proposals Engine Pipeline
@router.post("/proposals", response_model=Proposal)
def create_gov_proposal(body: dict, x_actor: Optional[str] = Header(None)):
    try:
        actor = get_actor_address(x_actor)
        title = body.get("title")
        p_type = body.get("type", "GENERAL")
        if not title:
            raise HTTPException(status_code=400, detail="Proposal title required")
        
        service = GovernanceEngine()
        return service.create_proposal(actor, title, p_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/proposals", response_model=List[Proposal])
def list_gov_proposals():
    try:
        service = GovernanceEngine()
        return service.list_proposals()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/proposals/{id}/approve")
def approve_gov_proposal(id: str, x_actor: Optional[str] = Header(None)):
    try:
        actor = get_actor_address(x_actor)
        service = GovernanceEngine()
        return service.approve_proposal(actor, id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/proposals/{id}/execute")
def execute_gov_proposal(id: str, x_actor: Optional[str] = Header(None)):
    try:
        actor = get_actor_address(x_actor)
        service = GovernanceEngine()
        return service.execute_proposal(actor, id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
