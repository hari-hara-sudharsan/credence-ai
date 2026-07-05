import json
import uuid
import os
from datetime import datetime, timezone
from app.database.persistence import read_json, write_json

AUDIT_DB_FILENAME = "audit_logs.json"

class AuditEngine:
    def __init__(self):
        pass

    def record_event(self, action: str, performed_by: str, resource: str, result: str) -> dict:
        """
        Appends an immutable audit event to the file database log.
        """
        log_entry = {
            "log_id": f"aud_{uuid.uuid4().hex[:12]}",
            "action": action,
            "performed_by": performed_by,
            "resource": resource,
            "result": result,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

        data = read_json(AUDIT_DB_FILENAME, [])
        data.append(log_entry)
        write_json(AUDIT_DB_FILENAME, data)
        return log_entry

    def get_logs(self) -> list:
        return read_json(AUDIT_DB_FILENAME, [])

    def search_logs(self, query: str) -> list:
        logs = self.get_logs()
        if not query.strip():
            return logs
        
        q_lower = query.lower()
        results = []
        for log in logs:
            if (q_lower in log["action"].lower() or 
                q_lower in log["performed_by"].lower() or 
                q_lower in log["resource"].lower() or 
                q_lower in log["result"].lower()):
                results.append(log)
        return results

    def export_logs(self) -> str:
        return json.dumps(self.get_logs(), indent=2)
