from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.demo import DemoScenario, DemoStep, ValidationResult, JudgeModeResponse
from app.services.demo_engine import DemoEngine
from app.services.validation_engine import ValidationEngine

router = APIRouter(
    prefix="/demo",
    tags=["Demo Scenarios & Validation Engine"]
)

@router.get("/scenarios")
def list_demo_scenarios():
    return [
        {
            "scenario_id": "BORROWER_JOURNEY",
            "name": "Borrower Journey",
            "description": "Connect wallet, analyze credit metrics, issue Passport V2, retrieve loan offers, generate AI improvement checklists."
        },
        {
            "scenario_id": "PROTOCOL_JOURNEY",
            "name": "Protocol Journey",
            "description": "Trigger on-chain credit verification checking oracle signatures and policy parameters."
        },
        {
            "scenario_id": "INSTITUTION_JOURNEY",
            "name": "Institution Journey",
            "description": "Import large portfolio, scan risk segments exposure bounds, and generate AI narrative reports."
        }
    ]

@router.post("/run/{scenario}")
def run_scenario(scenario: str, wallet: Optional[str] = Query("")):
    try:
        engine = DemoEngine()
        return engine.run_scenario(scenario, wallet)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/report")
def get_demo_report():
    try:
        engine = DemoEngine()
        return engine.generate_demo_report()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/validation")
def get_system_validation():
    try:
        val = ValidationEngine()
        return val.generate_health_report()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/judge-mode", response_model=JudgeModeResponse)
def get_judge_evaluation_flow():
    """
    Exposes consolidated judging indicators mapping EIP-712 proofs,
    smart contracts deployments, and AI underwriting metrics.
    """
    return JudgeModeResponse(
        story="A wallet without credit history becomes a verified financial identity on HashKey Chain.",
        steps=[
            "AI Underwriting & Risk Evaluation",
            "Oracle Verification & Signature Generation",
            "Passport Creation on Governance Registry",
            "Protocol Integration (AaveV3 policy test)",
            "Institution Analysis Stress Tests"
        ],
        technical_highlights=[
            "EIP-712 secure structured signatures",
            "EVM GovernanceRegistry contracts on Cancun",
            "AI Risk Engine with credit-improvement checklist planners",
            "Developer API rate limiting controls"
        ]
    )
