import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

def test_optimization_engine_e2e():
    print("Starting Autonomous Credit Optimization E2E integration test...")
    client = TestClient(app)

    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"

    # Step 1: GET /optimize/{wallet}
    print("Step 1: Retrieving dynamic credit optimization actions plan...")
    plan_resp = client.get(f"/optimize/{wallet}")
    assert plan_resp.status_code == 200, plan_resp.text
    plan_data = plan_resp.json()
    print("Optimization Plan:")
    print(plan_data)
    assert plan_data["wallet"].lower() == wallet.lower()
    assert plan_data["current_score"] > 0
    assert plan_data["target_score"] >= plan_data["current_score"]
    assert isinstance(plan_data["actions"], list)
    assert len(plan_data["actions"]) > 0

    # Step 2: POST /optimize/simulate (REPAY_LOAN)
    print("Step 2: Simulating REPAY_LOAN action impact...")
    sim_resp = client.post("/optimize/simulate", json={
        "wallet": wallet,
        "action": "REPAY_LOAN"
    })
    assert sim_resp.status_code == 200, sim_resp.text
    sim_data = sim_resp.json()
    print("Simulation Output:")
    print(sim_data)
    assert sim_data["action"] == "REPAY_LOAN"
    assert sim_data["score_difference"] == 55
    assert sim_data["predicted_score"] == sim_data["current_score"] + 55

    # Step 3: GET /optimize/progress/{wallet}
    print("Step 3: Fetching wallet optimization progress indicators...")
    prog_resp = client.get(f"/optimize/progress/{wallet}")
    assert prog_resp.status_code == 200, prog_resp.text
    prog_data = prog_resp.json()
    print("Progress Stats:")
    print(prog_data)
    assert prog_data["progress_percent"] >= 0.0
    assert "completed_actions_count" in prog_data

    # Step 4: POST /optimize/goal
    print("Step 4: Running goal optimization query...")
    goal_resp = client.post("/optimize/goal", json={
        "wallet": wallet,
        "target_goal": "Institutional Grade"
    })
    assert goal_resp.status_code == 200, goal_resp.text
    goal_data = goal_resp.json()
    print("Goal Engine Response:")
    print(goal_data)
    assert "target" in goal_data
    assert goal_data["target"] == "Institutional Grade"
    assert isinstance(goal_data["required_actions"], list)

    print("All Credit Optimization Engine integration checks passed successfully!")

if __name__ == "__main__":
    test_optimization_engine_e2e()
