class AnomalyDetector:
    def __init__(self):
        pass

    def detect(self, metrics: dict) -> list:
        """
        Scans parameter counts identifying abnormal activity anomalies.
        """
        anomalies = []
        
        # Check signature errors spike
        if metrics.get("failed_signatures", 0) > 10:
            anomalies.append({
                "type": "SIGNATURE_REPLAY_ATTACK",
                "severity": "CRITICAL",
                "value": metrics["failed_signatures"]
            })

        # Check latency threshold
        if metrics.get("average_latency_ms", 0.0) > 1000.0:
            anomalies.append({
                "type": "LATENCY_SPIKE",
                "severity": "HIGH",
                "value": metrics["average_latency_ms"]
            })

        # Check oracle failure bounds
        if metrics.get("oracle_failures", 0) > 0:
            anomalies.append({
                "type": "ORACLE_CONNECTION_FAULT",
                "severity": "HIGH",
                "value": metrics["oracle_failures"]
            })

        return anomalies

    def classify(self, anomaly: dict) -> str:
        return anomaly["severity"]

    def recommend_action(self, anomaly: dict) -> str:
        a_type = anomaly["type"]
        if a_type == "SIGNATURE_REPLAY_ATTACK":
            return "Trigger emergency circuit pause and cycle oracle validation keys."
        elif a_type == "LATENCY_SPIKE":
            return "Increase server scaling resources or check RPC endpoint throttle limits."
        elif a_type == "ORACLE_CONNECTION_FAULT":
            return "Failover to secondary backup HashKey RPC provider."
        return "Inspect system logs immediately."
