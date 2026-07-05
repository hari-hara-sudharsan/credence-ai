import time
from app.services.scenario_engine import ScenarioEngine
from app.database.persistence import read_json, write_json

DEMO_DB = "demo_state.json"

def make_serializable(data):
    if isinstance(data, dict):
        return {k: make_serializable(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [make_serializable(x) for x in data]
    elif hasattr(data, "isoformat"):
        return data.isoformat()
    return data

class DemoEngine:
    def __init__(self):
        self.scenarios = ScenarioEngine()

    def run_scenario(self, scenario_id: str, wallet: str = "") -> dict:
        """
        Executes active sequence paths.
        """
        start_time = time.time()
        scen_id_upper = scenario_id.upper()

        steps = []
        result_desc = ""

        if scen_id_upper == "BORROWER_JOURNEY":
            steps = self.scenarios.borrower_flow(wallet)
            result_desc = "Wallet successfully converted into verified credit identity."
        elif scen_id_upper == "PROTOCOL_JOURNEY":
            steps = self.scenarios.protocol_flow(wallet)
            result_desc = "Protocol criteria successfully evaluated and permission gate resolved."
        elif scen_id_upper == "INSTITUTION_JOURNEY":
            steps = self.scenarios.institution_flow(wallet)
            result_desc = "Institutional exposure checked and portfolio risk segment parsed."
        else:
            raise ValueError(f"Unknown scenario ID: {scenario_id}")

        duration = round(time.time() - start_time, 2)
        
        # Clean steps to ensure there are no datetime object serialization errors
        steps_clean = make_serializable(steps)

        # Save run history in persistence
        run_record = {
            "scenario_id": scen_id_upper,
            "steps": steps_clean,
            "status": "COMPLETED",
            "duration": duration,
            "result": result_desc
        }

        db = read_json(DEMO_DB, [])
        db.append(run_record)
        write_json(DEMO_DB, db)

        return {
            "scenario": scen_id_upper,
            "completed": True,
            "steps_passed": len(steps_clean),
            "total_steps": len(steps_clean),
            "execution_time": f"{duration}s",
            "result": result_desc,
            "steps": steps_clean
        }

    def generate_demo_report(self) -> dict:
        runs = read_json(DEMO_DB, [])
        return {
            "total_runs": len(runs),
            "scenarios_executed": list(set(r["scenario_id"] for r in runs)),
            "average_duration_sec": round(sum(r["duration"] for r in runs) / len(runs), 2) if runs else 0.0,
            "history": runs[-10:]
        }

    def reset_demo(self) -> bool:
        write_json(DEMO_DB, [])
        return True
