import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

def test_ecosystem_engine_e2e():
    print("Starting Ecosystem Intelligence Layer E2E integration test...")
    client = TestClient(app)

    # Step 1: GET /ecosystem/health
    print("Step 1: Retrieving overall network health stats...")
    health_resp = client.get("/ecosystem/health")
    assert health_resp.status_code == 200, health_resp.text
    health_data = health_resp.json()
    print("Network Health:")
    print(health_data)
    assert health_data["network"] == "HashKey"
    assert health_data["health_score"] >= 0
    assert health_data["total_wallets"] >= 5
    assert health_data["average_credit_score"] > 0
    assert health_data["total_credit_capacity"] >= 0.0

    # Step 2: GET /ecosystem/risk
    print("Step 2: Retrieving systemic risk statistics...")
    risk_resp = client.get("/ecosystem/risk")
    assert risk_resp.status_code == 200, risk_resp.text
    risk_data = risk_resp.json()
    print("Systemic Risk:")
    print(risk_data)
    assert risk_data["systemic_risk"] in ["LOW", "MEDIUM", "HIGH"]
    assert risk_data["risk_score"] >= 0
    assert isinstance(risk_data["detected_events"], list)

    # Step 3: GET /ecosystem/distribution
    print("Step 3: Retrieving credit score bracket distribution...")
    dist_resp = client.get("/ecosystem/distribution")
    assert dist_resp.status_code == 200, dist_resp.text
    dist_data = dist_resp.json()
    print("Credit score distribution:")
    print(dist_data)
    assert "EXCELLENT" in dist_data
    assert "HIGH_RISK" in dist_data
    assert sum(dist_data.values()) >= 5

    # Step 4: GET /ecosystem/protocols
    print("Step 4: Retrieving active protocols performance analytics...")
    prot_resp = client.get("/ecosystem/protocols")
    assert prot_resp.status_code == 200, prot_resp.text
    prot_list = prot_resp.json()
    print(f"Total active protocols listed: {len(prot_list)}")
    assert len(prot_list) == 4
    for m in prot_list:
        assert m["protocol"] in ["LENDING", "INSURANCE", "RWA", "DAO"]
        assert m["users"] >= 0
        assert m["average_score"] >= 0
        assert m["risk"] in ["LOW", "MEDIUM", "HIGH"]

    # Step 5: GET /ecosystem/report
    print("Step 5: Retrieving narrative summary report...")
    rep_resp = client.get("/ecosystem/report")
    assert rep_resp.status_code == 200, rep_resp.text
    rep_data = rep_resp.json()
    print("AI Narrative Report:")
    print(rep_data)
    assert "report" in rep_data
    assert "health score" in rep_data["report"]

    # Step 6: GET /ecosystem/alerts
    print("Step 6: Retrieving systemic ecosystem alerts...")
    alert_resp = client.get("/ecosystem/alerts")
    assert alert_resp.status_code == 200, alert_resp.text
    alert_list = alert_resp.json()
    print(f"Total alerts triggered: {len(alert_list)}")
    assert len(alert_list) > 0
    for a in alert_list:
        assert a["severity"] in ["HIGH", "MEDIUM", "LOW"]
        assert a["category"] in ["LIQUIDITY", "CONCENTRATION", "DEFAULT", "HEALTH"]
        assert "message" in a
        assert "recommendation" in a

    print("All Ecosystem Intelligence Layer integration checks passed successfully!")

if __name__ == "__main__":
    test_ecosystem_engine_e2e()
