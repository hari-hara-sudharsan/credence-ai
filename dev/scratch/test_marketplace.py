import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

def test_marketplace_e2e():
    print("Starting Decentralized Credit Marketplace E2E integration test...")
    client = TestClient(app)

    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"

    # Step 1: GET /marketplace/borrowers
    print("Step 1: Retrieving all verified borrower profiles...")
    b_resp = client.get("/marketplace/borrowers")
    assert b_resp.status_code == 200, b_resp.text
    b_list = b_resp.json()
    print(f"Total marketplace borrowers: {len(b_list)}")
    assert len(b_list) > 0
    assert "wallet" in b_list[0]
    assert "credit_score" in b_list[0]
    assert "trust_badge" in b_list[0]

    # Step 2: GET /marketplace/top-wallets
    print("Step 2: Retrieving top-ranked wallets leaderboard...")
    top_resp = client.get("/marketplace/top-wallets")
    assert top_resp.status_code == 200, top_resp.text
    top_list = top_resp.json()
    print("Leaderboard Top 3:")
    print(top_list[:3])
    assert len(top_list) > 0
    assert top_list[0]["rank"] == 1
    assert "badge" in top_list[0]

    # Step 3: GET /marketplace/match/lender/{wallet}
    print("Step 3: Calculating compatible lender matches...")
    l_resp = client.get(f"/marketplace/match/lender/{wallet}")
    assert l_resp.status_code == 200, l_resp.text
    l_list = l_resp.json()
    print("Lender Matches:")
    print(l_list)
    assert len(l_list) > 0
    assert "compatibility_score" in l_list[0]
    assert "suggested_terms" in l_list[0]

    # Step 4: GET /marketplace/match/protocol/{wallet}
    print("Step 4: Fetching protocol eligibility matches...")
    p_resp = client.get(f"/marketplace/match/protocol/{wallet}")
    assert p_resp.status_code == 200, p_resp.text
    p_list = p_resp.json()
    print("Protocol Matches:")
    print(p_list)
    assert len(p_list) > 0
    assert "eligibility" in p_list[0]
    assert "reason" in p_list[0]

    # Step 5: GET /marketplace/search
    print("Step 5: Testing filters search queries...")
    s_resp = client.get("/marketplace/search?risk_level=HIGH")
    assert s_resp.status_code == 200, s_resp.text
    s_list = s_resp.json()
    print(f"High risk borrowers count: {len(s_list)}")
    # We should have our high-risk seeded wallets returned
    for p in s_list:
        assert p["risk_level"] == "HIGH"

    # Step 6: GET /marketplace/network/{wallet}
    print("Step 6: Constructing trust graph connections network...")
    n_resp = client.get(f"/marketplace/network/{wallet}")
    assert n_resp.status_code == 200, n_resp.text
    n_data = n_resp.json()
    print("Trust Network Graph:")
    print(n_data)
    assert n_data["wallet"].lower() == wallet.lower()
    assert len(n_data["connections"]) > 0
    assert n_data["network_score"] > 0
    for conn in n_data["connections"]:
        assert conn["type"] in ["PROTOCOL", "WALLET", "POOL"]
        assert "name" in conn
        assert conn["trust_relationship"] > 0

    print("All Credit Marketplace & Trust Network integration checks passed successfully!")

if __name__ == "__main__":
    test_marketplace_e2e()
