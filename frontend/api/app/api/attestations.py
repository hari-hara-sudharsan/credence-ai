import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from app.schemas.wallet_schema import WalletRequest
from app.schemas.underwriting_attestation import UnderwritingAttestation
from app.services.wallet_analyzer import WalletAnalyzer
from app.services.credit_engine import CreditEngine
from app.models.lending_engine import LendingEngine
from app.services.offer_engine import LoanOfferEngine
from app.services.signature_engine import SignatureEngine
from pydantic import BaseModel

router = APIRouter(
    prefix="/attestation",
    tags=["Attestations"]
)

class VerificationRequest(BaseModel):
    attestation: UnderwritingAttestation

class VerificationResponse(BaseModel):
    verified: bool
    signer: str

@router.post("", response_model=UnderwritingAttestation)
def generate_attestation(request: WalletRequest):
    """
    Analyzes the wallet, calculates the credit score, evaluates eligibility,
    generates a loan offer, signs the offer payload using the Oracle key,
    and returns a cryptographically verifiable UnderwritingAttestation.
    """
    try:
        analyzer = WalletAnalyzer()
        credit_engine = CreditEngine()
        lending_engine = LendingEngine()
        offer_engine = LoanOfferEngine()
        sig_engine = SignatureEngine()

        features = analyzer.analyze(request.wallet)
        profile = credit_engine.calculate(features)
        lending_profile = lending_engine.evaluate(profile, features)

        offer = offer_engine.generate_offer(
            wallet=request.wallet,
            credit_profile=profile,
            lending_profile=lending_profile,
            balance=features.get("balance")
        )

        expiry_timestamp = int(offer.expires_at.timestamp())

        signature = sig_engine.sign_underwriting_offer(
            wallet=offer.wallet,
            offer_hash=offer.offer_hash,
            credit_score=offer.credit_score,
            approved_amount=offer.approved_amount,
            interest_rate=offer.interest_rate,
            collateral_ratio=offer.collateral_ratio,
            duration_days=offer.duration_days,
            expiry=expiry_timestamp
        )

        attestation_id = "att_" + str(uuid.uuid4()).replace("-", "")[:16]
        attestation_version = "1.0.0"
        oracle_version = "CredenceOracle/1.0.0"
        issued_at = datetime.now(timezone.utc)

        return UnderwritingAttestation(
            wallet=offer.wallet,
            offer_id=offer.offer_id,
            offer_hash=offer.offer_hash,
            credit_score=offer.credit_score,
            risk_level=offer.risk_level,
            approved_amount=offer.approved_amount,
            interest_rate=offer.interest_rate,
            collateral_ratio=offer.collateral_ratio,
            duration_days=offer.duration_days,
            issued_at=issued_at,
            expires_at=offer.expires_at,
            oracle_version=oracle_version,
            signature=signature,
            attestation_id=attestation_id,
            attestation_version=attestation_version
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate attestation: {str(e)}")

@router.post("/verify", response_model=VerificationResponse)
def verify_attestation(request: VerificationRequest):
    """
    Verifies the cryptographic validity of an UnderwritingAttestation.
    Returns whether the signature is valid and the signer address.
    """
    try:
        sig_engine = SignatureEngine()
        att = request.attestation
        
        expiry_timestamp = int(att.expires_at.timestamp())

        is_valid = sig_engine.verify_underwriting_offer(
            wallet=att.wallet,
            offer_hash=att.offer_hash,
            credit_score=att.credit_score,
            approved_amount=att.approved_amount,
            interest_rate=att.interest_rate,
            collateral_ratio=att.collateral_ratio,
            duration_days=att.duration_days,
            expiry=expiry_timestamp,
            signature=att.signature
        )

        return VerificationResponse(
            verified=is_valid,
            signer=sig_engine.oracle_address
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to verify attestation: {str(e)}")
