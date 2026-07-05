from pydantic import BaseModel


class CreditReport(BaseModel):

    wallet: str

    credit_score: int

    rating: str

    report: str