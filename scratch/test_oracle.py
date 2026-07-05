import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app
from app.services.oracle_attestation_service import OracleAttestationService
from hexbytes import HexBytes

def test_oracle_e2e():
    print("Starting Oracle E2E integration test...")
    client = TestClient(app)
    
    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208" # standard hardhat #1
    
    # Step 1: Generate Underwriting Attestation
    print("Step 1: Generating Underwriting Attestation...")
    gen_response = client.post("/attestation", json={"wallet": wallet})
    assert gen_response.status_code == 200, gen_response.text
    underwriting_att = gen_response.json()
    print(f"Generated Underwriting Attestation ID: {underwriting_att['attestation_id']}")
    
    # Step 2: Publish to OracleRegistry
    print("Step 2: Publishing Attestation to on-chain Registry...")
    pub_response = client.post("/oracle/publish", json=underwriting_att)
    assert pub_response.status_code == 200, pub_response.text
    pub_data = pub_response.json()
    print(f"Published Receipt:")
    print(pub_data)
    assert pub_data["published"] is True
    assert pub_data["verified"] is True
    assert pub_data["attestation_hash"].startswith("0x")
    assert pub_data["oracle_registry_tx"].startswith("0x")
    
    attestation_hash = pub_data["attestation_hash"]
    attestation_id = pub_data["attestation_id"]
    
    # Step 3: Verify Attestation on-chain
    print("Step 3: Verifying Attestation from Registry...")
    verify_response = client.post("/oracle/verify", json={"attestation_hash": attestation_hash})
    assert verify_response.status_code == 200, verify_response.text
    verify_data = verify_response.json()
    print("Verify Data:")
    print(verify_data)
    assert verify_data["exists"] is True
    assert verify_data["verified"] is True
    assert verify_data["revoked"] is False
    assert verify_data["expired"] is False
    assert verify_data["oracle"].startswith("0x")
    assert verify_data["issued_at"] != ""

    # Step 4: Get by Wallet
    print("Step 4: Getting attestations by wallet...")
    wallet_response = client.get(f"/oracle/{wallet}")
    assert wallet_response.status_code == 200, wallet_response.text
    wallet_data = wallet_response.json()
    print(f"Total wallet attestations: {len(wallet_data)}")
    assert len(wallet_data) > 0
    assert wallet_data[0]["attestation_hash"] == attestation_hash

    # Step 5: Get by ID
    print("Step 5: Getting attestation by ID...")
    id_response = client.get(f"/oracle/attestation/{attestation_id}")
    assert id_response.status_code == 200, id_response.text
    id_data = id_response.json()
    assert id_data["attestation_hash"] == attestation_hash

    # Step 6: Revoke Attestation on-chain
    print("Step 6: Revoking Attestation...")
    revoke_response = client.post("/oracle/revoke", json={"attestation_hash": attestation_hash})
    assert revoke_response.status_code == 200, revoke_response.text
    revoke_data = revoke_response.json()
    print("Revoke Data:")
    print(revoke_data)
    assert revoke_data["revoked"] is True
    assert revoke_data["attestation_hash"] == attestation_hash
    assert revoke_data["registry_tx"].startswith("0x")

    # Step 7: Verify Revoked Attestation status
    print("Step 7: Verifying Revocation status...")
    verify_revoked_resp = client.post("/oracle/verify", json={"attestation_hash": attestation_hash})
    assert verify_revoked_resp.status_code == 200, verify_revoked_resp.text
    verify_revoked_data = verify_revoked_resp.json()
    print("Verify Revoked Data:")
    print(verify_revoked_data)
    assert verify_revoked_data["exists"] is True
    assert verify_revoked_data["verified"] is False
    assert verify_revoked_data["revoked"] is True
    assert verify_revoked_data["expired"] is False

    print("All Oracle integration checks passed successfully!")

if __name__ == "__main__":
    test_oracle_e2e()
