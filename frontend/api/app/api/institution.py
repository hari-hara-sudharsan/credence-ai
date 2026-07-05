from fastapi import APIRouter, HTTPException
from app.schemas.institution import InstitutionProfile, PortfolioAnalysis, ExposureReport, StressTestRequest, StressTestResponse
from app.services.institution_engine import InstitutionEngine
from app.services.exposure_engine import ExposureEngine

router = APIRouter(
    prefix="/institution",
    tags=["Institutional Command Center"]
)

@router.get("/dashboard")
def get_institution_dashboard():
    """
    Returns high-level overview metrics for the command center.
    """
    try:
        service = InstitutionEngine()
        return service.generate_dashboard()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dashboard aggregation failed: {str(e)}")

@router.post("/analyze")
def analyze_portfolio():
    """
    Executes deep portfolio risk distribution checks.
    """
    try:
        service = InstitutionEngine()
        return service.analyze_institution()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/exposure", response_model=ExposureReport)
def get_exposure_report():
    """
    Returns credit exposures, LTVs, and adjustments recommendations.
    """
    try:
        service = InstitutionEngine()
        wallets = service._get_institution_wallets()
        if not wallets:
            wallets = ["0x5bb83E60a7a05A0e1b077B66412a26306e334208"]
        
        exp = ExposureEngine()
        res = exp.calculate_exposure(wallets)
        return ExposureReport(**res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate exposure report: {str(e)}")

@router.get("/report")
def get_ai_narrative_report():
    """
    Retrieves the AI narrative risk analysis summary report.
    """
    try:
        service = InstitutionEngine()
        rep = service.generate_ai_report()
        return {"report": rep}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate AI report: {str(e)}")

@router.post("/stress-test", response_model=StressTestResponse)
def execute_portfolio_stress_test(request: StressTestRequest):
    """
    Simulates crash scenarios to project health indicators.
    """
    try:
        service = InstitutionEngine()
        res = service.simulate_stress_test(request.scenario, request.severity)
        return StressTestResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stress testing failed: {str(e)}")
