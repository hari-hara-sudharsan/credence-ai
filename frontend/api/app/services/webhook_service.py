import urllib.request
import threading
import json
from datetime import datetime, timezone
from app.database.persistence import read_json, write_json

class WebhookService:
    SUPPORTED_EVENTS = [
        "credit.updated",
        "loan.created",
        "loan.repaid",
        "passport.minted",
        "reputation.updated",
        "profile.updated"
    ]

    def __init__(self):
        pass

    def _read_db(self) -> dict:
        return read_json("webhooks.json", {})

    def _save_db(self, db: dict):
        write_json("webhooks.json", db)

    def register(self, url: str, events: list) -> dict:
        """
        Registers a webhook endpoint URL for specific events.
        """
        # Validate events
        valid_events = [e for e in events if e in self.SUPPORTED_EVENTS]
        if not valid_events:
            raise ValueError(f"No valid events specified. Supported: {self.SUPPORTED_EVENTS}")

        db = self._read_db()
        db[url] = {
            "events": valid_events,
            "created_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        }
        self._save_db(db)
        return {"url": url, "events": valid_events, "created_at": db[url]["created_at"]}

    def unregister(self, url: str) -> bool:
        """
        Unregisters a webhook subscription URL.
        """
        db = self._read_db()
        if url in db:
            del db[url]
            self._save_db(db)
            return True
        return False

    def list_webhooks(self) -> list:
        """
        Lists all registered webhook subscriptions.
        """
        db = self._read_db()
        return [{"url": url, "events": meta["events"], "created_at": meta["created_at"]} for url, meta in db.items()]

    def emit(self, event_type: str, payload: dict):
        """
        Spawns a background thread to broadcast an event payload to all subscribed webhook endpoints.
        """
        if event_type not in self.SUPPORTED_EVENTS:
            print(f"Skipping webhook emission: Event type '{event_type}' not supported.")
            return

        db = self._read_db()
        subscribers = [url for url, meta in db.items() if event_type in meta["events"]]
        
        if not subscribers:
            return

        # Prepare envelope
        envelope = {
            "event": event_type,
            "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "payload": payload
        }

        # Deliver asynchronously to prevent blocking the main API thread
        for url in subscribers:
            threading.Thread(
                target=self._send_payload_safe,
                args=(url, envelope),
                daemon=True
            ).start()

    def _send_payload_safe(self, url: str, envelope: dict):
        data = json.dumps(envelope).encode("utf-8")
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "Credence-Webhook-Relayer/1.0"
        }
        
        # Simple retry loop
        max_retries = 3
        for attempt in range(max_retries):
            try:
                req = urllib.request.Request(url, data=data, headers=headers, method="POST")
                with urllib.request.urlopen(req, timeout=5) as response:
                    if response.status == 200:
                        print(f"Webhook delivered successfully to {url} (Attempt {attempt+1})")
                        return
            except Exception as e:
                print(f"Webhook delivery attempt {attempt+1} failed to {url}: {e}")
        print(f"Webhook permanently failed to deliver to {url} after {max_retries} attempts.")
