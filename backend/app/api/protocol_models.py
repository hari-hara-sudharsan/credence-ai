from fastapi import APIRouter
from pydantic import BaseModel

from app.services.wallet_analyzer import WalletAnalyzer
from app.services.credit_engine import CreditEngine
from app.services.protocol_model_engine import ProtocolModelEngine

router = APIRouter(
    prefix="/protocol-models",
    tags=["Protocol Models"]
)

class ProtocolRequest(BaseModel):
    wallet: str

@router.post("/")
def compare_protocols(request: ProtocolRequest):
    analyzer = WalletAnalyzer()
    features = analyzer.analyze(request.wallet)
    profile = CreditEngine().calculate(features)
    models = ProtocolModelEngine.evaluate(profile.credit_score)

    return {
        "wallet": request.wallet,
        "credit_score": profile.credit_score,
        "models": models
    }
