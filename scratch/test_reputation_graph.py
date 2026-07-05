import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

def test_reputation_graph_e2e():
    print("Starting Reputation Graph E2E integration test...")
    client = TestClient(app)

    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"

    # Step 1: GET /graph/{wallet}
    print("Step 1: Fetching complete reputation graph...")
    g_resp = client.get(f"/graph/{wallet}")
    assert g_resp.status_code == 200, g_resp.text
    g_data = g_resp.json()
    print("Graph Data:")
    print(g_data)
    assert g_data["wallet"].lower() == wallet.lower()
    assert len(g_data["nodes"]) > 0
    assert len(g_data["edges"]) > 0
    assert "network_score" in g_data

    # Step 2: GET /graph/{wallet}/insights
    print("Step 2: Retrieving graph-narrated AI insights...")
    in_resp = client.get(f"/graph/{wallet}/insights")
    assert in_resp.status_code == 200, in_resp.text
    in_data = in_resp.json()
    print("AI Insights:")
    print(in_data)
    assert "insights" in in_data
    assert "reputation" in in_data["insights"].lower()

    # Step 3: GET /graph/{wallet}/connections
    print("Step 3: Listing direct protocol connections edges...")
    c_resp = client.get(f"/graph/{wallet}/connections")
    assert c_resp.status_code == 200, c_resp.text
    c_data = c_resp.json()
    print("Connections:")
    print(c_data)
    assert "connections" in c_data
    assert len(c_data["connections"]) > 0

    # Step 4: GET /graph/{wallet}/trust-flow
    print("Step 4: Fetching trust flow propagation parameters...")
    tf_resp = client.get(f"/graph/{wallet}/trust-flow")
    assert tf_resp.status_code == 200, tf_resp.text
    tf_data = tf_resp.json()
    print("Trust Flow:")
    print(tf_data)
    assert tf_data["wallet"].lower() == wallet.lower()
    assert len(tf_data["trust_sources"]) > 0
    assert len(tf_data["trust_path"]) > 0

    print("All Reputation Graph integration checks passed successfully!")

if __name__ == "__main__":
    test_reputation_graph_e2e()
