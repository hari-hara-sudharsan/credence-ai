import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

def test_ucvn_e2e():
    print("Starting Universal Credit Verification Network (UCVN) E2E integration test...")
    client = TestClient(app)
    
    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208" # standard hardhat signer
    
    # Step 1: Query verify wallet (which triggers generate/mint first if needed)
    print("Step 1: Running UCVN verification on wallet...")
    verify_resp = client.get(f"/verify/{wallet}")
    assert verify_resp.status_code == 200, verify_resp.text
    verify_data = verify_resp.json()
    print("Verification Result Receipt:")
    print(verify_data)
    assert verify_data["wallet"].lower() == wallet.lower()
    assert verify_data["verification_id"].startswith("vf_")
    assert verify_data["passport_valid"] is True
    assert verify_data["oracle_verified"] is True
    assert verify_data["credit_score"] > 0
    assert verify_data["trust_score"] > 0
    assert verify_data["trust_seal"] in ["BRONZE", "SILVER", "GOLD", "INSTITUTIONAL_VERIFIED"]
    
    passport_id = verify_data["passport_id"]
    attestation_id = verify_data["attestation_id"]

    # Step 2: Fetch verification proof bundle
    print("Step 2: Retrieving Verification Proof Bundle...")
    proof_resp = client.get(f"/verify/{wallet}/proof")
    assert proof_resp.status_code == 200, proof_resp.text
    proof_data = proof_resp.json()
    print("Proof Bundle:")
    print(proof_data)
    assert proof_data["verification_version"] == "1.0.0"
    assert proof_data["wallet"].lower() == wallet.lower()
    assert proof_data["passport_hash"].startswith("0x")
    assert proof_data["verification_hash"].startswith("0x")
    assert proof_data["oracle_signature"].startswith("0x")
    assert proof_data["trust_seal"] == verify_data["trust_seal"]

    # Step 3: Verify using Passport ID
    print("Step 3: Querying verify registry using Passport ID...")
    pass_resp = client.get(f"/verify/passport/{passport_id}")
    assert pass_resp.status_code == 200, pass_resp.text
    pass_data = pass_resp.json()
    assert pass_data["verification_id"] == verify_data["verification_id"]

    # Step 4: Verify using Attestation ID
    print("Step 4: Querying verify registry using Attestation ID...")
    att_resp = client.get(f"/verify/attestation/{attestation_id}")
    assert att_resp.status_code == 200, att_resp.text
    att_data = att_resp.json()
    assert att_data["verification_id"] == verify_data["verification_id"]

    print("All Universal Credit Verification Network E2E tests passed successfully!")

if __name__ == "__main__":
    test_ucvn_e2e()
