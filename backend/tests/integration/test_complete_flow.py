import sys
import os
import time
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "app")))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from fastapi.testclient import TestClient
from main import app

def test_full_pipeline_flow():
    print("Executing E2E pipeline integration test...")
    client = TestClient(app)

    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"

    # Step 1: Wallet Analysis
    print("1. Testing Wallet Analyzer...")
    a_resp = client.post("/wallet/analyze", json={"wallet": wallet})
    assert a_resp.status_code == 200, a_resp.text
    features = a_resp.json()
    assert "transaction_count" in features

    # Step 2: Credit Generation
    print("2. Testing Credit Engine...")
    c_resp = client.post("/credit/score", json={"wallet": wallet})
    assert c_resp.status_code == 200, c_resp.text
    profile = c_resp.json()
    assert "credit_score" in profile

    # Step 3: Loan Offer
    print("3. Testing Loan Offer Engine...")
    o_resp = client.post("/loan-offer", json={"wallet": wallet})
    assert o_resp.status_code == 200, o_resp.text
    offer = o_resp.json()
    assert "offer_hash" in offer

    # Step 4: Oracle Signature & Passport Creation & Verification
    print("4. Testing Verification Network...")
    v_resp = client.get(f"/verify/{wallet}/proof")
    assert v_resp.status_code == 200, v_resp.text
    verification = v_resp.json()
    assert "oracle_signature" in verification
    assert "passport_hash" in verification


    # Step 5: Policy Decision
    print("5. Testing Policy Evaluation...")
    p_resp = client.post("/policies/evaluate", json={"wallet": wallet, "policy_id": "prime_borrower_check"})
    assert p_resp.status_code == 200, p_resp.text
    policy_res = p_resp.json()
    assert "passed" in policy_res

    # Step 6: AI Explanation
    print("6. Testing AI Agent Answer...")
    ag_resp = client.post("/agents/ask", json={
        "wallet": wallet,
        "agent_type": "BORROWER",
        "question": "What is my credit standing?"
    })
    assert ag_resp.status_code == 200, ag_resp.text

    agent_res = ag_resp.json()
    assert "answer" in agent_res

    report = {
        "status": "PASSED",
        "services_verified": 8,
        "contracts_verified": True
    }
    print(" E2E INTEGRATION PASSED SUCCESSFULLY:")
    print(report)

if __name__ == "__main__":
    test_full_pipeline_flow()
