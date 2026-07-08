import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

def test_system_e2e():
    print("Starting System status & Reliability hardening E2E integration test...")
    client = TestClient(app)

    # Step 1: GET /system/health
    print("Step 1: Fetching consolidated system health...")
    h_resp = client.get("/system/health")
    assert h_resp.status_code == 200, h_resp.text
    h_data = h_resp.json()
    print("Health Status:")
    print(h_data)
    assert h_data["status"] in ["HEALTHY", "DEGRADED", "CRITICAL"]
    assert h_data["uptime"] > 0

    # Step 2: GET /system/metrics
    print("Step 2: Retrieving API metrics counters...")
    m_resp = client.get("/system/metrics")
    assert m_resp.status_code == 200, m_resp.text
    m_data = m_resp.json()
    print("Observability Metrics:")
    print(m_data)
    assert m_data["request_count"] > 0

    # Step 3: GET /system/security
    print("Step 3: Listing logged security events...")
    s_resp = client.get("/system/security")
    assert s_resp.status_code == 200, s_resp.text
    s_list = s_resp.json()
    print("Security Events:")
    print(s_list)
    assert len(s_list) > 0
    assert "type" in s_list[0]

    # Step 4: GET /system/incidents
    print("Step 4: Fetching incidents logs timeline...")
    i_resp = client.get("/system/incidents")
    assert i_resp.status_code == 200, i_resp.text
    i_data = i_resp.json()
    print("Incidents Logs:")
    print(i_data)
    assert "active_incidents" in i_data

    # Step 5: GET /system/contracts
    print("Step 5: Retrieving deployed contracts addresses...")
    c_resp = client.get("/system/contracts")
    assert c_resp.status_code == 200, c_resp.text
    c_list = c_resp.json()
    print("Active Contracts:")
    print(c_list)
    assert len(c_list) > 0
    assert "address" in c_list[0]

    # Step 6: GET /system/readiness
    print("Step 6: Calculating composite production readiness score...")
    r_resp = client.get("/system/readiness")
    assert r_resp.status_code == 200, r_resp.text
    r_data = r_resp.json()
    print("Production Readiness:")
    print(r_data)
    assert r_data["production_score"] > 0
    assert r_data["status"] in ["READY", "DEGRADED"]

    print("All System status & Reliability integration checks passed successfully!")

if __name__ == "__main__":
    test_system_e2e()
