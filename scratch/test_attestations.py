import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))



from fastapi.testclient import TestClient
from main import app
from app.services.signature_engine import SignatureEngine
from eth_account import Account
from hexbytes import HexBytes

def test_signature_engine():
    print("Testing SignatureEngine...")
    engine = SignatureEngine()
    
    # Test credentials and parameters
    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208" # standard hardhat #1
    offer_hash = "0xa5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5"
    credit_score = 750
    approved_amount = 500.0
    interest_rate = 5.0
    collateral_ratio = 150.0
    duration_days = 30
    expiry = 1800000000 # future timestamp
    
    # Sign
    signature = engine.sign_underwriting_offer(
        wallet=wallet,
        offer_hash=offer_hash,
        credit_score=credit_score,
        approved_amount=approved_amount,
        interest_rate=interest_rate,
        collateral_ratio=collateral_ratio,
        duration_days=duration_days,
        expiry=expiry
    )
    
    print(f"Generated Signature: {signature}")
    assert signature is not None
    assert signature.startswith("0x") or len(signature) == 130 or len(signature) == 132
    
    # Verify
    is_valid = engine.verify_underwriting_offer(
        wallet=wallet,
        offer_hash=offer_hash,
        credit_score=credit_score,
        approved_amount=approved_amount,
        interest_rate=interest_rate,
        collateral_ratio=collateral_ratio,
        duration_days=duration_days,
        expiry=expiry,
        signature=signature
    )
    assert is_valid is True
    print("SignatureEngine verification successful!")

def test_attestations_api():
    print("Testing Attestations API...")
    client = TestClient(app)
    
    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"
    
    # Request generation
    response = client.post("/attestation", json={"wallet": wallet})
    print(f"Status Code: {response.status_code}")
    if response.status_code != 200:
        print(f"Error details: {response.text}")
    assert response.status_code == 200
    
    attestation = response.json()
    print("Generated Attestation:")
    print(attestation)
    
    assert attestation["wallet"] == wallet
    assert attestation["signature"] is not None
    assert attestation["attestation_id"].startswith("att_")
    
    # Request verification
    verify_response = client.post("/attestation/verify", json={"attestation": attestation})
    assert verify_response.status_code == 200
    
    verify_data = verify_response.json()
    print("Verification response:")
    print(verify_data)
    
    assert verify_data["verified"] is True
    assert verify_data["signer"] is not None
    
    print("Attestations API verification successful!")

if __name__ == "__main__":
    test_signature_engine()
    test_attestations_api()
    print("All tests passed successfully!")
