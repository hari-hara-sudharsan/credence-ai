from fastapi import APIRouter
from pydantic import BaseModel

from app.services.wallet_analyzer import WalletAnalyzer
from app.services.segment_engine import SegmentEngine

router = APIRouter(
    prefix="/segments",
    tags=["Segments"]
)

class SegmentRequest(BaseModel):
    wallet: str

@router.post("/")
def classify_wallet(request: SegmentRequest):
    analyzer = WalletAnalyzer()
    features = analyzer.analyze(request.wallet)
    segment = SegmentEngine.classify(features)

    return {
        "wallet": request.wallet,
        "segment": segment
    }
