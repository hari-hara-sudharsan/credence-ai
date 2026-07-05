import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

def test_institution_e2e():
    print("Starting Institutional Command Center E2E integration test...")
    client = TestClient(app)

    # Step 1: GET /institution/dashboard
    print("Step 1: Retrieving dashboard status overview...")
    dash_resp = client.get("/institution/dashboard")
    assert dash_resp.status_code == 200, dash_resp.text
    dash_data = dash_resp.json()
    print("Dashboard Data:")
    print(dash_data)
    assert dash_data["institution"] == "HashKey Lending"
    assert dash_data["wallets"] > 0
    assert "portfolio_score" in dash_data
    assert "segments" in dash_data
    assert "PRIME" in dash_data["segments"]

    # Step 2: POST /institution/analyze
    print("Step 2: Triggering portfolio risk analysis...")
    an_resp = client.post("/institution/analyze")
    assert an_resp.status_code == 200, an_resp.text
    an_data = an_resp.json()
    print("Analysis Data:")
    print(an_data)
    assert an_data["wallets"] > 0

    # Step 3: GET /institution/exposure
    print("Step 3: Fetching portfolio exposure reports...")
    exp_resp = client.get("/institution/exposure")
    assert exp_resp.status_code == 200, exp_resp.text
    exp_data = exp_resp.json()
    print("Exposure Report:")
    print(exp_data)
    assert exp_data["total_exposure"] > 0
    assert exp_data["risk_adjusted_exposure"] > 0
    assert isinstance(exp_data["recommended_actions"], list)

    # Step 4: GET /institution/report
    print("Step 4: Fetching AI narrative risk overview...")
    rep_resp = client.get("/institution/report")
    assert rep_resp.status_code == 200, rep_resp.text
    rep_data = rep_resp.json()
    print("AI Narrative Report:")
    print(rep_data)
    assert "report" in rep_data
    assert "Total exposure" in rep_data["report"]

    # Step 5: POST /institution/stress-test
    print("Step 5: Executing portfolio stress test simulation...")
    st_resp = client.post("/institution/stress-test", json={
        "scenario": "MARKET_CRASH",
        "severity": "HIGH"
    })
    assert st_resp.status_code == 200, st_resp.text
    st_data = st_resp.json()
    print("Stress Test Output:")
    print(st_data)
    assert st_data["projected_health"] < st_data["current_health"]
    assert len(st_data["recommended_actions"]) > 0

    print("All Institutional Command Center integration checks passed successfully!")

if __name__ == "__main__":
    test_institution_e2e()
