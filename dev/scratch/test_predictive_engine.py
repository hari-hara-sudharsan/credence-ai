import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

def test_predictive_engine_e2e():
    print("Starting Predictive Risk Intelligence Engine E2E integration test...")
    client = TestClient(app)
    
    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"
    
    # Step 1: Query main intelligence summary
    print("Step 1: Retrieving AI Financial Intelligence summary...")
    resp = client.get(f"/intelligence/{wallet}")
    assert resp.status_code == 200, resp.text
    data = resp.json()
    print("Aggregated Report:")
    print(data)
    assert data["wallet"].lower() == wallet.lower()
    assert "current_score" in data
    assert "predicted_score" in data
    assert data["trajectory"] in ["IMPROVING", "DECLINING", "STABLE"]
    assert "default_probability_now" in data
    assert "default_probability_future" in data
    assert data["confidence"] > 0
    assert isinstance(data["signals"], list)
    assert isinstance(data["recommendations"], list)

    # Step 2: Query active signals list
    print("Step 2: Retrieving detected financial signals...")
    sig_resp = client.get(f"/intelligence/{wallet}/signals")
    assert sig_resp.status_code == 200, sig_resp.text
    sig_list = sig_resp.json()
    print(f"Detected signals count: {len(sig_list)}")
    if len(sig_list) > 0:
        print("First Signal:")
        print(sig_list[0])
        assert "signal" in sig_list[0]
        assert sig_list[0]["impact"] in ["POSITIVE", "NEGATIVE", "NEUTRAL"]
        assert sig_list[0]["severity"] in ["HIGH", "MEDIUM", "LOW"]

    # Step 3: Query 30-day forecast predictions
    print("Step 3: Querying 30-day forecast predictions...")
    fore_resp = client.get(f"/intelligence/{wallet}/forecast")
    assert fore_resp.status_code == 200, fore_resp.text
    fore_data = fore_resp.json()
    print("Forecast:")
    print(fore_data)
    assert fore_data["wallet"].lower() == wallet.lower()
    assert "current_risk" in fore_data
    assert "predicted_risk" in fore_data
    assert fore_data["forecast_days"] == 30

    # Step 4: Simulate behavior scenario (REPAY_LOAN)
    print("Step 4: Simulating REPAY_LOAN scenario impact...")
    sim_repay_payload = {
        "wallet": wallet,
        "scenario": "REPAY_LOAN"
    }
    repay_resp = client.post("/intelligence/simulate", json=sim_repay_payload)
    assert repay_resp.status_code == 200, repay_resp.text
    repay_data = repay_resp.json()
    print("REPAY_LOAN Simulation Result:")
    print(repay_data)
    assert repay_data["simulated_score"] > repay_data["current_score"]
    assert repay_data["impact"] == "+48"

    # Step 5: Simulate behavior scenario (TAKE_NEW_LOAN)
    print("Step 5: Simulating TAKE_NEW_LOAN scenario impact...")
    sim_loan_payload = {
        "wallet": wallet,
        "scenario": "TAKE_NEW_LOAN"
    }
    loan_resp = client.post("/intelligence/simulate", json=sim_loan_payload)
    assert loan_resp.status_code == 200, loan_resp.text
    loan_data = loan_resp.json()
    print("TAKE_NEW_LOAN Simulation Result:")
    print(loan_data)
    assert loan_data["simulated_score"] < loan_data["current_score"]
    assert loan_data["impact"] == "-35"

    print("All Predictive Risk Intelligence Engine integration checks passed successfully!")

if __name__ == "__main__":
    test_predictive_engine_e2e()
