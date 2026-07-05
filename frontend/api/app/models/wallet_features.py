from pydantic import BaseModel


class WalletFeatures(BaseModel):

    wallet: str

    balance: float

    wallet_age_days: int

    transaction_count: int

    activity_score: int

    asset_stability_score: int

    protocol_diversity_score: int

    financial_reliability_score: int

    sybil_risk_score: int