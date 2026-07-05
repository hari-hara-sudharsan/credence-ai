from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.schemas.policy import Policy, PolicyEvaluation, PolicyRule
from app.services.policy_engine import PolicyEngine

router = APIRouter(
    prefix="/policies",
    tags=["Policy Engine"]
)

class CreatePolicyRequest(BaseModel):
    policy_name: str
    protocol: str
    version: str = "1.0.0"
    rules: List[PolicyRule]

class EvaluatePolicyRequest(BaseModel):
    wallet: str
    policy_id: str

@router.post("", response_model=Policy)
def create_policy(request: CreatePolicyRequest):
    """
    Registers a new credit evaluation policy in the registry.
    """
    try:
        service = PolicyEngine()
        record = service.register_policy(request.model_dump())
        return Policy(**record)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to register policy: {str(e)}")

@router.get("", response_model=List[Policy])
def list_policies():
    """
    Retrieves the list of all registered credit policies.
    """
    try:
        service = PolicyEngine()
        records = service.list_policies()
        return [Policy(**rec) for rec in records]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list policies: {str(e)}")

@router.post("/evaluate", response_model=PolicyEvaluation)
def evaluate_policy(request: EvaluatePolicyRequest):
    """
    Evaluates a specific credit policy against a wallet parameters context.
    """
    try:
        service = PolicyEngine()
        result = service.evaluate_policy(request.wallet, request.policy_id)
        return PolicyEvaluation(**result)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Policy evaluation failed: {str(e)}")

@router.delete("/{policy_id}")
def delete_policy(policy_id: str):
    """
    Removes a policy record from the database registry.
    """
    try:
        service = PolicyEngine()
        success = service.delete_policy(policy_id)
        if not success:
            raise HTTPException(status_code=404, detail="Policy not found")
        return {"deleted": True, "policy_id": policy_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete policy: {str(e)}")

@router.get("/{policy_id}/export")
def export_policy(policy_id: str):
    """
    Exports a portable credit policy template including SHA-256 validation checksum.
    """
    try:
        service = PolicyEngine()
        exported = service.export_policy(policy_id)
        return exported
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export policy: {str(e)}")
