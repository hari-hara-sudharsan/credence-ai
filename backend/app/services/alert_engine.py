import uuid
import queue
from datetime import datetime, timezone
from typing import List, Dict, Any
from app.database.persistence import read_json, write_json

DB_FILENAME = "alerts.json"

# In-memory subscription queues mapped by wallet address
_subscribers: Dict[str, List[queue.Queue]] = {}

class AlertEngine:
    def __init__(self):
        pass

    def get_alerts(self, wallet: str, resolved: bool = None) -> List[Dict[str, Any]]:
        """
        Retrieves active or resolved alerts matching a wallet.
        """
        data = read_json(DB_FILENAME, {})
        wallet_alerts = []
        for alert in data.values():
            if alert["wallet"].lower() == wallet.lower():
                if resolved is None or alert["resolved"] == resolved:
                    wallet_alerts.append(alert)
        return self.prioritize_alerts(wallet_alerts)

    def list_all_alerts(self) -> List[Dict[str, Any]]:
        data = read_json(DB_FILENAME, {})
        return list(data.values())

    def create_alert(self, wallet: str, alert_type: str, severity: str, title: str, description: str, recommendation: str, source: str) -> dict:
        """
        Registers a new credit alert event and pushes it to active stream subscribers.
        """
        alert_id = "alt_" + str(uuid.uuid4()).replace("-", "")[:12]
        now = datetime.now(timezone.utc)

        alert = {
            "alert_id": alert_id,
            "wallet": wallet,
            "alert_type": alert_type.upper(),
            "severity": severity.upper(),
            "title": title,
            "description": description,
            "recommendation": recommendation,
            "source": source,
            "created_at": now.isoformat().replace("+00:00", "Z"),
            "resolved": False
        }

        data = read_json(DB_FILENAME, {})
        data[alert_id] = alert
        write_json(DB_FILENAME, data)

        # Notify active stream queues
        w_lower = wallet.lower()
        if w_lower in _subscribers:
            for q in _subscribers[w_lower]:
                try:
                    q.put_nowait(alert)
                except Exception:
                    pass

        return alert

    def resolve_alert(self, alert_id: str) -> bool:
        """
        Resolves an active alert event flag.
        """
        data = read_json(DB_FILENAME, {})
        if alert_id in data:
            data[alert_id]["resolved"] = True
            write_json(DB_FILENAME, data)
            return True
        return False

    def prioritize_alerts(self, alerts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Sorts alerts by severity (CRITICAL > HIGH > MEDIUM > LOW > INFO) and timestamp.
        """
        severity_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3, "INFO": 4}
        return sorted(
            alerts,
            key=lambda x: (severity_order.get(x["severity"], 5), x["created_at"]),
            reverse=False
        )

    @staticmethod
    def subscribe(wallet: str) -> queue.Queue:
        """
        Subscribes a queue to receive real-time alerts.
        """
        w_lower = wallet.lower()
        q = queue.Queue()
        if w_lower not in _subscribers:
            _subscribers[w_lower] = []
        _subscribers[w_lower].append(q)
        return q

    @staticmethod
    def unsubscribe(wallet: str, q: queue.Queue):
        """
        Removes subscription.
        """
        w_lower = wallet.lower()
        if w_lower in _subscribers:
            try:
                _subscribers[w_lower].remove(q)
            except ValueError:
                pass
            if not _subscribers[w_lower]:
                del _subscribers[w_lower]
