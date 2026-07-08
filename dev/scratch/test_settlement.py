import sys
import os
import uuid
from datetime import datetime, timezone, timedelta
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app
from app.database.persistence import read_json, write_json

def test_settlement_flow():
    print("Starting Settlement Integration tests...")
    client = TestClient(app)

    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"
    loan_id = "loan_" + str(uuid.uuid4()).replace("-", "")[:12]

    # Pre-populate verification network attestation for test
    from app.services.verification_network import VerificationNetwork
    vn = VerificationNetwork()
    vn.verify_wallet(wallet)

    # 1. Approved loan settles successfully
    print("1. Testing approved loan settles...")
    payload = {
        "loan_id": loan_id,
        "borrower": wallet,
        "amount": 500.0,
        "asset": "HSP",
        "attestation_id": "att_test_1"
    }

    res = client.post("/settlement/execute", json=payload)
    assert res.status_code == 200, res.text
    data = res.json()
    print("Settled response:")
    print(data)
    assert data["approved"] is True
    assert data["settled"] is True
    assert "tx_hash" in data

    # 2. Duplicate settlement is blocked
    print("2. Testing duplicate settlement is blocked...")
    res_dup = client.post("/settlement/execute", json=payload)
    assert res_dup.status_code == 400, res_dup.text
    assert "already" in res_dup.json()["detail"].lower()


    # 3. Rejected loan fails (rejection via policy or low score)
    print("3. Testing rejected loan fails...")
    bad_wallet = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" # Test account 2
    
    # We alter verifications.json locally to set a very low score
    verifications = read_json("verifications.json", {})
    verifications[bad_wallet.lower()] = {
        "wallet": bad_wallet,
        "credit_score": 450, # Low score fails policy!
        "trust_score": 40,
        "risk_level": "HIGH",
        "passport_valid": True,
        "oracle_verified": True,
        "attestation_id": "att_bad",
        "passport_id": "cp_bad",
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
        "network_version": "1.0.0",
        "trust_seal": "BRONZE",
        "protocol_profiles": []
    }
    write_json("verifications.json", verifications)

    bad_loan_id = "loan_bad_" + str(uuid.uuid4()).replace("-", "")[:8]
    payload_bad = {
        "loan_id": bad_loan_id,
        "borrower": bad_wallet,
        "amount": 100.0,
        "asset": "HSP",
        "attestation_id": "att_bad"
    }
    res_bad = client.post("/settlement/execute", json=payload_bad)
    assert res_bad.status_code == 400, res_bad.text
    print("Bad wallet response status:", res_bad.status_code, "Detail:", res_bad.json()["detail"])
    assert "credit score is below prime threshold" in res_bad.json()["detail"]

    # 4. Expired attestation fails
    print("4. Testing expired attestation fails...")
    expired_wallet = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" # Test account 3
    verifications = read_json("verifications.json", {})
    verifications[expired_wallet.lower()] = {
        "wallet": expired_wallet,
        "credit_score": 750,
        "trust_score": 80,
        "risk_level": "LOW",
        "passport_valid": True,
        "oracle_verified": True,
        "attestation_id": "att_exp",
        "passport_id": "cp_exp",
        "expires_at": (datetime.now(timezone.utc) - timedelta(days=1)).isoformat(), # Expired!
        "network_version": "1.0.0",
        "trust_seal": "GOLD",
        "protocol_profiles": []
    }
    write_json("verifications.json", verifications)

    exp_loan_id = "loan_exp_" + str(uuid.uuid4()).replace("-", "")[:8]
    payload_exp = {
        "loan_id": exp_loan_id,
        "borrower": expired_wallet,
        "amount": 200.0,
        "asset": "HSP",
        "attestation_id": "att_exp"
    }
    res_exp = client.post("/settlement/execute", json=payload_exp)
    assert res_exp.status_code == 400, res_exp.text
    print("Expired wallet response status:", res_exp.status_code, "Detail:", res_exp.json()["detail"])
    assert "attestation credentials have expired" in res_exp.json()["detail"]

    print("All HSP Settlement Integration tests passed successfully!")

if __name__ == "__main__":
    test_settlement_flow()
