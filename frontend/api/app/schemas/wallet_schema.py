from pydantic import BaseModel, field_validator
from web3 import Web3

class WalletRequest(BaseModel):
    wallet: str

    @field_validator("wallet")
    @classmethod
    def validate_wallet(cls, v: str) -> str:
        if not Web3.is_address(v):
            raise ValueError("Invalid Ethereum address")
        return Web3.to_checksum_address(v)