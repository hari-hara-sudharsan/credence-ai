from pydantic import BaseModel


class LendingDecision(BaseModel):

    eligible: bool

    max_loan_amount: float

    collateral_ratio: int

    interest_rate: float

    risk_level: str

    decision_reason: str