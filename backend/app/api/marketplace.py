from fastapi import APIRouter
from pydantic import BaseModel

from app.services.wallet_analyzer import WalletAnalyzer
from app.services.credit_engine import CreditEngine
from app.models.lending_engine import LendingEngine
from app.services.badge_engine import BadgeEngine
from app.services.segment_engine import SegmentEngine
from app.services.marketplace_service import MarketplaceService

router = APIRouter(
    prefix="/marketplace",
    tags=["Marketplace"]
)

class ListingRequest(BaseModel):
    wallet: str
    loan_amount: float
    purpose: str

@router.post("/request")
def create_request(request: ListingRequest):
    features = WalletAnalyzer().analyze(request.wallet)
    profile = CreditEngine().calculate(features)
    lending = LendingEngine().evaluate(profile, features)

    listing = {
        "wallet": request.wallet,
        "loan_amount": request.loan_amount,
        "purpose": request.purpose,
        "credit_score": profile.credit_score,
        "rating": profile.rating,
        "segment": SegmentEngine.classify(features),
        "badges": BadgeEngine.generate(features),
        "interest_rate": lending.interest_rate,
        "collateral_ratio": lending.collateral_ratio
    }

    MarketplaceService.create_listing(listing)
    return listing

@router.get("/listings")
def get_listings():
    return MarketplaceService.get_listings()
