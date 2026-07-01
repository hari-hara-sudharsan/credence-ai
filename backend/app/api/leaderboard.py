from fastapi import APIRouter
from app.services.leaderboard_service import LeaderboardService

router = APIRouter(
    prefix="/leaderboard",
    tags=["Leaderboard"]
)

@router.get("/")
def leaderboard():
    rankings = LeaderboardService.get_rankings()
    result = []
    for idx, item in enumerate(rankings, start=1):
        result.append({
            "rank": idx,
            **item
        })
    return result
