from pydantic import BaseModel

class PoolMetrics(BaseModel):
    total_liquidity: float
    borrowed_amount: float
    available_liquidity: float
    utilization_rate: float
    average_interest: float
    health: str

class LenderPosition(BaseModel):
    wallet: str
    balance: float
    shares: float
    yield_earned: float

class BorrowTerms(BaseModel):
    borrow_rate: float
    risk_adjustment: float
    reason: str
