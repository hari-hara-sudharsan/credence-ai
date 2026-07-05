from app.database.persistence import read_json, write_json
from typing import List, Dict, Any

DB_FILENAME = "agent_memory.json"

class AgentMemory:
    def __init__(self):
        pass

    def get_history(self, wallet: str) -> List[Dict[str, Any]]:
        """
        Retrieves complete conversation logs history for a wallet.
        """
        data = read_json(DB_FILENAME, {})
        return data.get(wallet.lower(), [])

    def add_to_history(self, wallet: str, agent_type: str, question: str, response: dict):
        """
        Appends a conversation log to wallet history.
        """
        w_lower = wallet.lower()
        data = read_json(DB_FILENAME, {})
        
        history = data.get(w_lower, [])
        gen_at = response["generated_at"]
        if hasattr(gen_at, "isoformat"):
            gen_at = gen_at.isoformat().replace("+00:00", "Z")
        else:
            gen_at = str(gen_at)

        history.append({
            "agent_type": agent_type,
            "question": question,
            "answer": response["answer"],
            "confidence": response["confidence"],
            "recommendations": response["recommendations"],
            "decision_trace": response["decision_trace"],
            "generated_at": gen_at
        })


        # Cap memory length to last 20 messages to optimize context
        if len(history) > 20:
            history = history[-20:]

        data[w_lower] = history
        write_json(DB_FILENAME, data)

    def clear_history(self, wallet: str) -> bool:
        w_lower = wallet.lower()
        data = read_json(DB_FILENAME, {})
        if w_lower in data:
            del data[w_lower]
            write_json(DB_FILENAME, data)
            return True
        return False
