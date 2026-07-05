from fastapi import APIRouter

from pydantic import BaseModel

from app.services.passport_nft_service import (
    PassportNFTService
)

router = APIRouter(
    prefix="/passport-nft",
    tags=["Passport NFT"]
)


class MintRequest(
    BaseModel
):

    wallet: str

    score: int

    rating: str


@router.post("/mint")
def mint_passport(
    request: MintRequest
):

    service = PassportNFTService()

    return service.mint(
        request.wallet,
        request.score,
        request.rating
    )
