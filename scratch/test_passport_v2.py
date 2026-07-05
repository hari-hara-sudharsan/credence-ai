import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

def test_passport_v2_e2e():
    print("Starting Credit Passport V2 E2E integration test...")
    client = TestClient(app)
    
    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208" # standard hardhat signer #1
    
    # Step 1: Generate Passport
    print("Step 1: Generating and Minting Credit Passport V2...")
    gen_resp = client.post("/passport/v2/generate", json={"wallet": wallet})
    assert gen_resp.status_code == 200, gen_resp.text
    gen_data = gen_resp.json()
    print("Generate Receipt:")
    print(gen_data)
    assert gen_data["passport_id"].startswith("cp_v2_")
    assert gen_data["wallet"].lower() == wallet.lower()
    assert gen_data["credit_score"] > 0
    assert gen_data["trust_score"] > 0
    assert gen_data["passport_hash"].startswith("0x")
    assert gen_data["oracle_verified"] is True
    assert gen_data["metadata_uri"].endswith("/credential")

    passport_hash = gen_data["passport_hash"]

    # Step 2: Retrieve Passport Details
    print("Step 2: Retrieving Passport details from DB...")
    get_resp = client.get(f"/passport/v2/{wallet}")
    assert get_resp.status_code == 200, get_resp.text
    get_data = get_resp.json()
    print("DB Record Details:")
    print(f"Status: {get_data['passport_status']}, Risk Level: {get_data['risk_level']}")
    assert get_data["passport_status"] == "ACTIVE"
    assert len(get_data["protocol_profiles"]) > 0
    assert len(get_data["badges"]) > 0
    assert len(get_data["segments"]) > 0

    # Step 3: Verify Passport on-chain
    print("Step 3: Verifying Passport against smart contract...")
    verify_resp = client.post("/passport/v2/verify", json={"passport_hash": passport_hash})
    assert verify_resp.status_code == 200, verify_resp.text
    verify_data = verify_resp.json()
    print("On-Chain Verify Result:")
    print(verify_data)
    assert verify_data["exists"] is True
    assert verify_data["verified"] is True
    assert verify_data["revoked"] is False
    assert verify_data["expired"] is False

    # Step 4: Export Verifiable Credential
    print("Step 4: Exporting Standards-Inspired Verifiable Credential...")
    export_resp = client.get(f"/passport/v2/{wallet}/credential")
    assert export_resp.status_code == 200, export_resp.text
    vc_doc = export_resp.json()
    print("Verifiable Credential document:")
    print(vc_doc)
    assert "VerifiableCredential" in vc_doc["type"]
    assert vc_doc["id"] == gen_data["passport_id"]
    assert vc_doc["issuer"] == "Credence AI"
    assert vc_doc["credentialSubject"]["wallet"].lower() == wallet.lower()
    assert vc_doc["proof"]["type"] == "JsonWebSignature2020"
    assert vc_doc["proof"]["jws"].startswith("0x")

    # Step 5: Refresh Passport
    print("Step 5: Refreshing Passport scores and updating contract registry...")
    refresh_resp = client.post("/passport/v2/refresh", json={"wallet": wallet})
    assert refresh_resp.status_code == 200, refresh_resp.text
    refresh_data = refresh_resp.json()
    print("Refresh Receipt:")
    print(refresh_data)
    assert refresh_data["passport_hash"] != passport_hash

    # Verify old hash is deactivated
    print("Checking old hash revocation status...")
    verify_old_resp = client.post("/passport/v2/verify", json={"passport_hash": passport_hash})
    assert verify_old_resp.status_code == 200, verify_old_resp.text
    verify_old_data = verify_old_resp.json()
    print("Old Hash Verify Result:")
    print(verify_old_data)
    assert verify_old_data["exists"] is True
    assert verify_old_data["verified"] is False
    assert verify_old_data["revoked"] is True

    print("All Credit Passport V2 E2E checks passed successfully!")

if __name__ == "__main__":
    test_passport_v2_e2e()
