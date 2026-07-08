import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

def test_demo_flow():
    print("Starting E2E Demo Flow State Machine tests...")
    client = TestClient(app)

    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"

    # 1. Start Demo Session
    print("1. Testing start session...")
    res = client.post("/demo-flow/start", json={"wallet": wallet})
    assert res.status_code == 200, res.text
    session = res.json()
    print("Started session:", session)
    assert "session_id" in session
    assert session["wallet"] == wallet.lower()
    assert session["current_stage"] == "CONNECT_WALLET"

    session_id = session["session_id"]

    # 2. Transition to ANALYZING stage
    print("2. Testing transition to ANALYZING...")
    res_next = client.post("/demo-flow/next", json={
        "session_id": session_id,
        "next_stage": "ANALYZING"
    })
    assert res_next.status_code == 200, res_next.text
    session_next = res_next.json()
    assert session_next["current_stage"] == "ANALYZING"
    assert "CONNECT_WALLET" in session_next["completed_steps"]

    # 3. Check Session Status
    print("3. Checking session status query...")
    res_status = client.get(f"/demo-flow/status/{session_id}")
    assert res_status.status_code == 200, res_status.text
    assert res_status.json()["current_stage"] == "ANALYZING"

    print("All Demo Flow State Machine tests passed successfully!")

if __name__ == "__main__":
    test_demo_flow()
