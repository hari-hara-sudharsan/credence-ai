import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

def test_ai_agents_e2e():
    print("Starting AI Financial Agent Network E2E integration test...")
    client = TestClient(app)

    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"

    # Step 1: POST /agents/ask (BORROWER_AGENT)
    print("Step 1: Asking BORROWER_AGENT advisor...")
    borrower_payload = {
        "wallet": wallet,
        "agent_type": "BORROWER_AGENT",
        "question": "How can I improve my credit score trajectory index?"
    }
    b_resp = client.post("/agents/ask", json=borrower_payload)
    assert b_resp.status_code == 200, b_resp.text
    b_data = b_resp.json()
    print("Borrower Agent Response:")
    print(b_data)
    assert b_data["wallet"].lower() == wallet.lower()
    assert b_data["agent_type"] == "BORROWER_AGENT"
    assert "answer" in b_data
    assert b_data["confidence"] >= 0.0
    assert isinstance(b_data["recommendations"], list)
    assert "decision_trace" in b_data
    assert len(b_data["decision_trace"]) > 0

    # Step 2: POST /agents/ask (LENDER_AGENT)
    print("Step 2: Asking LENDER_AGENT advisor...")
    lender_payload = {
        "wallet": wallet,
        "agent_type": "LENDER_AGENT",
        "question": "Is it safe to lend funds to this wallet address?"
    }
    l_resp = client.post("/agents/ask", json=lender_payload)
    assert l_resp.status_code == 200, l_resp.text
    l_data = l_resp.json()
    print("Lender Agent Response:")
    print(l_data)
    assert l_data["agent_type"] == "LENDER_AGENT"
    assert len(l_data["decision_trace"]) > 0

    # Step 3: GET /agents/history/{wallet}
    print("Step 3: Loading wallet session conversation logs...")
    hist_resp = client.get(f"/agents/history/{wallet}")
    assert hist_resp.status_code == 200, hist_resp.text
    hist_list = hist_resp.json()
    print(f"Conversation history count: {len(hist_list)}")
    assert len(hist_list) >= 2
    assert hist_list[0]["agent_type"] == "BORROWER_AGENT"
    assert hist_list[1]["agent_type"] == "LENDER_AGENT"

    # Step 4: GET /agents/insights/{wallet}
    print("Step 4: Retrieving dynamic credit insights indexes...")
    ins_resp = client.get(f"/agents/insights/{wallet}")
    assert ins_resp.status_code == 200, ins_resp.text
    ins_list = ins_resp.json()
    print("Agent Insights:")
    print(ins_list)
    assert len(ins_list) > 0
    for ins in ins_list:
        assert ins["type"] in ["IMPROVEMENT", "ALERT", "OPPORTUNITY"]
        assert "title" in ins
        assert "description" in ins
        assert ins["severity"] in ["HIGH", "MEDIUM", "LOW"]

    print("All AI Financial Agent Network integration checks passed successfully!")

if __name__ == "__main__":
    test_ai_agents_e2e()
