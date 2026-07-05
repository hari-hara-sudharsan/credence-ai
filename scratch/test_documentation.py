import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

def test_documentation_endpoints():
    print("Starting Documentation & Submission audit APIs verification checks...")
    client = TestClient(app)

    # 1. GET /submission/summary
    print("1. Fetching Investor/Judge Technical Summary...")
    s_resp = client.get("/submission/summary")
    assert s_resp.status_code == 200, s_resp.text
    summary = s_resp.json()
    print("Summary:")
    print(summary)
    assert summary["project"] == "Credence AI"
    assert len(summary["core_layers"]) > 0

    # 2. GET /submission/audit-report
    print("2. Retrieving production preparedness Release score audit report...")
    a_resp = client.get("/submission/audit-report")
    assert a_resp.status_code == 200, a_resp.text
    report = a_resp.json()
    print("Audit Report:")
    print(report)
    assert report["security_score"] == 96
    assert report["production_ready"] is True

    # 3. GET /submission/endpoints
    print("3. Fetching REST API endpoints directory docs...")
    e_resp = client.get("/submission/endpoints")
    assert e_resp.status_code == 200, e_resp.text
    endpoints = e_resp.json()
    print("Endpoints categories:", len(endpoints["categories"]))
    assert len(endpoints["categories"]) > 0

    print("All submission & documentation verification checks passed successfully!")

if __name__ == "__main__":
    test_documentation_endpoints()
