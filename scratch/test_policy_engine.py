import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

def test_policy_engine_e2e():
    print("Starting Policy Engine E2E integration test...")
    client = TestClient(app)
    
    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"
    
    # Step 1: Create a Policy
    print("Step 1: Creating Credit Policy...")
    policy_payload = {
        "policy_name": "Institutional Lending Policy",
        "protocol": "LENDING",
        "rules": [
            {"field": "credit_score", "operator": ">=", "value": 550},
            {"field": "trust_score", "operator": ">=", "value": 50},
            {"field": "oracle_verified", "operator": "==", "value": True},
            {"field": "risk_level", "operator": "contains", "value": "HIGH"}
        ]
    }
    create_resp = client.post("/policies", json=policy_payload)
    assert create_resp.status_code == 200, create_resp.text
    policy_data = create_resp.json()
    print("Policy Created:")
    print(policy_data)
    assert policy_data["policy_id"].startswith("pol_")
    assert len(policy_data["rules"]) == 4

    policy_id = policy_data["policy_id"]

    # Step 2: List Policies
    print("Step 2: Listing Policies...")
    list_resp = client.get("/policies")
    assert list_resp.status_code == 200, list_resp.text
    policies_list = list_resp.json()
    print(f"Total policies registered: {len(policies_list)}")
    assert len(policies_list) > 0
    assert any(p["policy_id"] == policy_id for p in policies_list)

    # Step 3: Evaluate Policy
    print("Step 3: Evaluating Policy against wallet...")
    eval_payload = {
        "wallet": wallet,
        "policy_id": policy_id
    }
    eval_resp = client.post("/policies/evaluate", json=eval_payload)
    assert eval_resp.status_code == 200, eval_resp.text
    eval_data = eval_resp.json()
    print("Evaluation Decision Result:")
    print(eval_data)
    assert eval_data["wallet"].lower() == wallet.lower()
    assert eval_data["policy_id"] == policy_id
    assert eval_data["passed"] is True or eval_data["passed"] is False
    assert eval_data["matched_rules"] + eval_data["failed_rules"] == 4
    assert eval_data["score"] >= 0.0

    # Step 4: Export Policy with Checksum
    print("Step 4: Exporting Portable Policy Template...")
    export_resp = client.get(f"/policies/{policy_id}/export")
    assert export_resp.status_code == 200, export_resp.text
    export_data = export_resp.json()
    print("Export Template:")
    print(export_data)
    assert export_data["policy_version"] == "1.0.0"
    assert export_data["protocol"] == "LENDING"
    assert "checksum" in export_data
    assert len(export_data["checksum"]) == 64

    # Step 5: Delete Policy
    print("Step 5: Deleting Policy...")
    delete_resp = client.delete(f"/policies/{policy_id}")
    assert delete_resp.status_code == 200, delete_resp.text
    assert delete_resp.json()["deleted"] is True

    print("All Policy Engine integration checks passed successfully!")

if __name__ == "__main__":
    test_policy_engine_e2e()
