from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/simulator",
    tags=["Simulator"]
)

class SimulatorRequest(BaseModel):

    current_score: int

    extra_transactions: int

    extra_protocols: int

    staking_enabled: bool


@router.post("")
def simulate(request: SimulatorRequest):

    score = request.current_score

    score += min(
        request.extra_transactions,
        100
    )

    score += (
        request.extra_protocols * 25
    )

    if request.staking_enabled:
        score += 40

    score = min(score, 850)

    rating = "HIGH_RISK"

    if score >= 700:
        rating = "LOW_RISK"

    elif score >= 550:
        rating = "MEDIUM_RISK"

    return {
        "projected_score": score,
        "projected_rating": rating,
        "score_increase":
            score -
            request.current_score
    }