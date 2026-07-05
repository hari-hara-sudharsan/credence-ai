from fastapi import APIRouter, HTTPException
from app.schemas.optimization import OptimizationPlan, SimulationResult, GoalRequest, GoalResponse
from app.services.optimization_engine import CreditOptimizationEngine
from app.services.action_simulator import ActionSimulator
from web3 import Web3

router = APIRouter(
    prefix="/optimize",
    tags=["Credit Optimization Engine"]
)

@router.get("/{wallet}", response_model=OptimizationPlan)
def get_optimization_plan(wallet: str):
    """
    Returns the custom credit score optimization actions plan.
    """
    try:
        service = CreditOptimizationEngine()
        plan = service.generate_plan(wallet)
        return OptimizationPlan(**plan)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate optimization plan: {str(e)}")

@router.post("/simulate", response_model=SimulationResult)
def simulate_action_impact(request: dict):
    """
    Simulates credit score trajectory shifts based on an action selection.
    """
    try:
        wallet = request.get("wallet")
        action = request.get("action")
        if not wallet or not action:
            raise HTTPException(status_code=400, detail="Missing wallet or action parameter")
        
        sim = ActionSimulator()
        res = sim.simulate_action(wallet, action)
        return SimulationResult(**res)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

@router.get("/progress/{wallet}")
def get_optimization_progress(wallet: str):
    """
    Tracks wallet progression benchmarks.
    """
    try:
        service = CreditOptimizationEngine()
        stats = service.track_progress(wallet)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch progress stats: {str(e)}")

@router.post("/goal", response_model=GoalResponse)
def optimize_for_goal(request: GoalRequest):
    """
    Formulates improvement requirements for specific reputation goal parameters.
    """
    try:
        service = CreditOptimizationEngine()
        res = service.generate_goal_path(request.wallet, request.target_goal)
        return GoalResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Goal optimization calculation failed: {str(e)}")
