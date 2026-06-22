from pydantic import BaseModel


class CreditInsight(BaseModel):

    wallet: str

    credit_score: int

    rating: str

    risk_summary: str

    strengths: list[str]

    weaknesses: list[str]

    recommendations: list[str]