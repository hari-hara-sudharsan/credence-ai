import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

def test_governance_e2e():
    print("Starting Governance & Trust Administration E2E integration test...")
    client = TestClient(app)

    oracle_address = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"

    # Step 1: GET /governance/dashboard
    print("Step 1: Fetching governance overview status dashboard...")
    dash_resp = client.get("/governance/dashboard")
    assert dash_resp.status_code == 200, dash_resp.text
    dash_data = dash_resp.json()
    print("Dashboard:")
    print(dash_data)
    assert dash_data["system_status"] == "HEALTHY"
    assert "active_oracles" in dash_data

    # Step 2: GET /governance/roles
    print("Step 2: Checking configured RBAC roles...")
    r_resp = client.get("/governance/roles")
    assert r_resp.status_code == 200, r_resp.text
    r_list = r_resp.json()
    print("Roles Database:")
    print(r_list)
    assert len(r_list) > 0
    assert "SUPER_ADMIN" in [x["role"] for x in r_list]

    # Step 3: POST /governance/oracle (using header permission authentication checking)
    print("Step 3: Registering and approving new oracle operator...")
    op_resp = client.post("/governance/oracle", json={"oracle": oracle_address}, headers={
        "X-Actor": "0x5bb83E60a7a05A0e1b077B66412a26306e334208" # SUPER_ADMIN
    })
    assert op_resp.status_code == 200, op_resp.text
    op_data = op_resp.json()
    print("Oracle Registration:")
    print(op_data)
    assert op_data["status"] == "ACTIVE"

    # Step 4: Try unauthorized oracle action
    print("Step 4: Verifying RBAC permission enforcement rules block unauthorized calls...")
    err_resp = client.post("/governance/oracle", json={"oracle": oracle_address}, headers={
        "X-Actor": "0x90f79bf6eb2c4f870365e785982e1f101e93b906" # AUDITOR (no oracle write perm)
    })
    assert err_resp.status_code == 403, err_resp.text
    print("RBAC blocked call successfully!")

    # Step 5: Test Governance proposals pipeline
    print("Step 5: Testing proposals lifecycle...")
    prop_resp = client.post("/governance/proposals", json={"title": "Deploy Base Adapter v2", "type": "ADAPTER"})
    assert prop_resp.status_code == 200, prop_resp.text
    prop = prop_resp.json()
    print("Created Proposal:")
    print(prop)
    assert prop["status"] == "UNDER_REVIEW"

    # Approve
    app_resp = client.post(f"/governance/proposals/{prop['proposal_id']}/approve")
    assert app_resp.status_code == 200, app_resp.text
    assert app_resp.json()["status"] == "APPROVED"

    # Execute
    exc_resp = client.post(f"/governance/proposals/{prop['proposal_id']}/execute")
    assert exc_resp.status_code == 200, exc_resp.text
    assert exc_resp.json()["status"] == "EXECUTED"

    # Step 6: GET /governance/audit
    print("Step 6: Retrieving audit timelines...")
    au_resp = client.get("/governance/audit")
    assert au_resp.status_code == 200, au_resp.text
    au_list = au_resp.json()
    print("Timeline Events size:", len(au_list))
    assert len(au_list) > 0
    # Must have records of creation, approvals, and executions!
    actions = [x["action"] for x in au_list]
    print("Logged actions:", actions)
    assert "APPROVE_ORACLE" in actions
    assert "CREATE_PROPOSAL" in actions
    assert "EXECUTE_PROPOSAL" in actions

    print("All Governance & Trust Administration Layer integration checks passed successfully!")

if __name__ == "__main__":
    test_governance_e2e()
