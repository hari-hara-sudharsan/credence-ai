from pydantic import BaseModel

class WalletRequest(BaseModel):
    wallet: str