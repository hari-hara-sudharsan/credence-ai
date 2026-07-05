from fastapi import APIRouter
from app.schemas.wallet_schema import WalletRequest
from app.schemas.loan_offer import LoanOffer
from app.services.wallet_analyzer import WalletAnalyzer
from app.services.credit_engine import CreditEngine
from app.models.lending_engine import LendingEngine
from app.services.offer_engine import LoanOfferEngine

router = APIRouter(
    prefix="/loan-offer",
    tags=["Loan Offer"]
)

@router.post("", response_model=LoanOffer)
def generate_loan_offer(request: WalletRequest):
    analyzer = WalletAnalyzer()
    credit_engine = CreditEngine()
    lending_engine = LendingEngine()
    offer_engine = LoanOfferEngine()

    features = analyzer.analyze(request.wallet)
    profile = credit_engine.calculate(features)
    lending_profile = lending_engine.evaluate(profile, features)

    offer = offer_engine.generate_offer(
        wallet=request.wallet,
        credit_profile=profile,
        lending_profile=lending_profile,
        balance=features.get("balance")
    )
    return offer
