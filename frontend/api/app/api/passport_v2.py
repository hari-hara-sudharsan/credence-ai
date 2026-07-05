from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.schemas.wallet_schema import WalletRequest
from app.schemas.passport_v2 import PassportV2
from app.services.passport_v2_service import PassportV2Service

router = APIRouter(
    prefix="/passport/v2",
    tags=["Credit Passport V2"]
)

class VerifyPassportRequest(BaseModel):
    passport_hash: str

class VerifyPassportResponse(BaseModel):
    exists: bool
    verified: bool
    revoked: bool
    expired: bool
    metadata_uri: str

class GenerateResponse(BaseModel):
    passport_id: str
    wallet: str
    credit_score: int
    trust_score: int
    passport_hash: str
    oracle_verified: bool
    passport_nft: str
    credential_version: str
    metadata_uri: str

@router.post("/generate", response_model=GenerateResponse)
def generate_passport(request: WalletRequest):
    """
    Generates a new Verifiable Financial Credential, mints ERC-721 reference,
    and returns standard verification metadata.
    """
    try:
        service = PassportV2Service()
        record = service.generate_passport(request.wallet)
        return GenerateResponse(
            passport_id=record["passport_id"],
            wallet=record["wallet"],
            credit_score=record["credit_score"],
            trust_score=record["trust_score"],
            passport_hash=record["passport_hash"],
            oracle_verified=record["oracle_verified"],
            passport_nft=service.contract_address, # contract address is standard
            credential_version=record["passport_version"],
            metadata_uri=record["metadata_uri"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate passport: {str(e)}")

@router.post("/refresh", response_model=GenerateResponse)
def refresh_passport(request: WalletRequest):
    """
    Refreshes user credit metrics, deactivates old reference, and updates on-chain registry.
    """
    try:
        service = PassportV2Service()
        record = service.refresh_passport(request.wallet)
        return GenerateResponse(
            passport_id=record["passport_id"],
            wallet=record["wallet"],
            credit_score=record["credit_score"],
            trust_score=record["trust_score"],
            passport_hash=record["passport_hash"],
            oracle_verified=record["oracle_verified"],
            passport_nft=service.contract_address,
            credential_version=record["passport_version"],
            metadata_uri=record["metadata_uri"]
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to refresh passport: {str(e)}")

@router.post("/verify", response_model=VerifyPassportResponse)
def verify_passport(request: VerifyPassportRequest):
    """
    Verifies a passport credential reference directly against the smart contract registry.
    """
    try:
        service = PassportV2Service()
        res = service.verify_passport(request.passport_hash)
        return VerifyPassportResponse(
            exists=res["exists"],
            verified=res["verified"],
            revoked=res["revoked"],
            expired=res["expired"],
            metadata_uri=res["metadata_uri"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to verify passport: {str(e)}")

@router.get("/{wallet}", response_model=PassportV2)
def get_passport_by_wallet(wallet: str):
    """
    Retrieves the complete credit passport profile.
    """
    try:
        service = PassportV2Service()
        record = service.get_passport_by_wallet(wallet)
        if not record:
            raise HTTPException(status_code=404, detail="Passport not found for this wallet")
        
        # Format matching PassportV2 schema
        return PassportV2(**record)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve passport: {str(e)}")

@router.get("/{wallet}/credential")
def export_verifiable_credential(wallet: str):
    """
    Exports a W3C-compliant portable Verifiable Credential document with digital oracle signature.
    """
    try:
        service = PassportV2Service()
        credential = service.export_credential(wallet)
        return credential
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export credential: {str(e)}")
