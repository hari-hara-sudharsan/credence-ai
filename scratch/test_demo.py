import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

def test_demo_e2e():
    print("Starting Demo Scenarios & System validation E2E integration test...")
    client = TestClient(app)

    # Step 1: GET /demo/scenarios
    print("Step 1: Listing available demo scenarios...")
    s_resp = client.get("/demo/scenarios")
    assert s_resp.status_code == 200, s_resp.text
    scens = s_resp.json()
    print("Scenarios:")
    print(scens)
    assert len(scens) == 3
    assert scens[0]["scenario_id"] == "BORROWER_JOURNEY"

    # Step 2: POST /demo/run/BORROWER_JOURNEY
    print("Step 2: Triggering BORROWER_JOURNEY run...")
    run_resp = client.post("/demo/run/BORROWER_JOURNEY")
    assert run_resp.status_code == 200, run_resp.text
    run_data = run_resp.json()
    print("Run result:")
    print(run_data)
    assert run_data["completed"] is True
    assert len(run_data["steps"]) == 7

    # Step 3: GET /demo/report
    print("Step 3: Checking demo execution reports...")
    rep_resp = client.get("/demo/report")
    assert rep_resp.status_code == 200, rep_resp.text
    rep_data = rep_resp.json()
    print("Report summary:")
    print(rep_data)
    assert rep_data["total_runs"] > 0

    # Step 4: GET /demo/validation
    print("Step 4: Fetching live system verification indexes...")
    val_resp = client.get("/demo/validation")
    assert val_resp.status_code == 200, val_resp.text
    val_data = val_resp.json()
    print("System Validation:")
    print(val_data)
    assert "overall_status" in val_data

    # Step 5: GET /demo/judge-mode
    print("Step 5: Testing judge evaluation details...")
    j_resp = client.get("/demo/judge-mode")
    assert j_resp.status_code == 200, j_resp.text
    j_data = j_resp.json()
    print("Judge Mode Data:")
    print(j_data)
    assert len(j_data["technical_highlights"]) > 0

    print("All Demo Intelligence & Validation Layer integration checks passed successfully!")

if __name__ == "__main__":
    test_demo_e2e()
