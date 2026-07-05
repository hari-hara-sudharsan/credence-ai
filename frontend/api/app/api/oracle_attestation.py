from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.schemas.underwriting_attestation import UnderwritingAttestation
from app.schemas.oracle_attestation import OracleAttestation
from app.services.oracle_attestation_service import OracleAttestationService
from typing import List

router = APIRouter(
    prefix="/oracle",
    tags=["Oracle Registry"]
)

class VerifyRequest(BaseModel):
    attestation_hash: str

class VerifyResponse(BaseModel):
    exists: bool
    verified: bool
    revoked: bool
    expired: bool
    oracle: str
    issued_at: str

class RevokeRequest(BaseModel):
    attestation_hash: str

class RevokeResponse(BaseModel):
    revoked: bool
    attestation_hash: str
    registry_tx: str

class PublishResponse(BaseModel):
    published: bool
    attestation_id: str
    attestation_hash: str
    oracle_registry_tx: str
    verified: bool

@router.post("/publish", response_model=PublishResponse)
def publish_attestation(request: UnderwritingAttestation):
    """
    Submits a verified underwriting decision to the on-chain OracleRegistry contract.
    """
    try:
        service = OracleAttestationService()
        record = service.publish(
            attestation_id=request.attestation_id,
            wallet=request.wallet,
            offer_id=request.offer_id,
            offer_hash=request.offer_hash,
            credit_score=request.credit_score,
            risk_level=request.risk_level,
            approved_amount=request.approved_amount,
            interest_rate=request.interest_rate,
            collateral_ratio=request.collateral_ratio,
            duration_days=request.duration_days,
            issued_at=request.issued_at,
            expires_at=request.expires_at,
            signature=request.signature,
            oracle_version=request.oracle_version
        )
        return PublishResponse(
            published=True,
            attestation_id=record["attestation_id"],
            attestation_hash=record["attestation_hash"],
            oracle_registry_tx=record["registry_tx"],
            verified=record["verified"]
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to publish attestation: {str(e)}")

@router.post("/verify", response_model=VerifyResponse)
def verify_attestation(request: VerifyRequest):
    """
    Verifies the cryptographic consensus status of an attestation from the on-chain OracleRegistry.
    """
    try:
        service = OracleAttestationService()
        res = service.verify(request.attestation_hash)
        return VerifyResponse(
            exists=res["exists"],
            verified=res["verified"],
            revoked=res["revoked"],
            expired=res["expired"],
            oracle=res["oracle"],
            issued_at=res["issued_at"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to verify attestation: {str(e)}")

@router.post("/revoke", response_model=RevokeResponse)
def revoke_attestation(request: RevokeRequest):
    """
    Revokes an attestation in the on-chain OracleRegistry with consensus signatures.
    """
    try:
        service = OracleAttestationService()
        res = service.revoke(request.attestation_hash)
        return RevokeResponse(
            revoked=res["revoked"],
            attestation_hash=res["attestation_hash"],
            registry_tx=res["registry_tx"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to revoke attestation: {str(e)}")

@router.get("", response_model=List[OracleAttestation])
def list_all_oracle_attestations():
    """
    Retrieves all published oracle attestations globally.
    """
    try:
        service = OracleAttestationService()
        records = service.list_attestations()
        return [OracleAttestation(**rec) for rec in records]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list all attestations: {str(e)}")

@router.get("/{wallet}", response_model=List[OracleAttestation])

def get_oracle_attestations_by_wallet(wallet: str):
    """
    Retrieves all published oracle attestations for a given wallet.
    """
    try:
        service = OracleAttestationService()
        records = service.get_by_wallet(wallet)
        return [OracleAttestation(**rec) for rec in records]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list attestations: {str(e)}")

@router.get("/attestation/{attestation_id}", response_model=OracleAttestation)
def get_oracle_attestation_by_id(attestation_id: str):
    """
    Retrieves the complete attestation document details by ID.
    """
    try:
        service = OracleAttestationService()
        rec = service.get_attestation(attestation_id)
        if not rec:
            raise HTTPException(status_code=404, detail="Attestation not found")
        return OracleAttestation(**rec)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve attestation: {str(e)}")
