from fastapi import APIRouter, HTTPException
from app.schemas.verification_result import VerificationResult
from app.services.verification_network import VerificationNetwork

router = APIRouter(
    prefix="/verify",
    tags=["Universal Credit Verification Network"]
)

@router.get("/{wallet}", response_model=VerificationResult)
def verify_wallet(wallet: str):
    """
    Standardized public trust gateway verifying credit profiles and returning Trust Seals.
    """
    try:
        service = VerificationNetwork()
        record = service.get_verification_by_wallet(wallet)
        if not record:
            # Automatically run aggregation and publish verification
            record = service.verify_wallet(wallet)
        
        return VerificationResult(**record)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")

@router.get("/{wallet}/proof")
def get_verification_proof(wallet: str):
    """
    Returns the decentralized machine-readable verification proof bundle for third-party protocols.
    """
    try:
        service = VerificationNetwork()
        proof = service.generate_proof_bundle(wallet)
        return proof
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate proof bundle: {str(e)}")

@router.get("/passport/{passport_id}", response_model=VerificationResult)
def verify_by_passport_id(passport_id: str):
    """
    Verifies and retrieves profile results using the Passport ID.
    """
    try:
        service = VerificationNetwork()
        record = service.verify_passport(passport_id)
        return VerificationResult(**record)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to verify by passport ID: {str(e)}")

@router.get("/attestation/{attestation_id}", response_model=VerificationResult)
def verify_by_attestation_id(attestation_id: str):
    """
    Verifies and retrieves profile results using the Attestation ID.
    """
    try:
        service = VerificationNetwork()
        record = service.verify_attestation(attestation_id)
        return VerificationResult(**record)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to verify by attestation ID: {str(e)}")
