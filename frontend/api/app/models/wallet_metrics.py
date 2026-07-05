from pydantic import BaseModel

class WalletMetrics(BaseModel):
    wallet_age_days: int
    transaction_count: int
    stablecoin_ratio: float
    governance_votes: int
    staking_score: int
    defi_protocols_used: int
    liquidation_events: int