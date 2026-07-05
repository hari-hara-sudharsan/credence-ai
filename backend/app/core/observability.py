class ObservabilityEngine:
    def __init__(self):
        self.metrics = {
            "request_count": 0,
            "failed_signatures": 0,
            "oracle_failures": 0,
            "contract_errors": 0,
            "api_latency_total": 0.0,
            "api_latency_count": 0,
            "error_rate_total": 0,
        }
        self.errors = []

    def record_metric(self, metric_name: str, value: float = 1.0):
        if metric_name in self.metrics:
            if "latency" in metric_name:
                self.metrics["api_latency_total"] += value
                self.metrics["api_latency_count"] += 1
            else:
                self.metrics[metric_name] += int(value)

    def record_error(self, error_msg: str, trace: str = None):
        self.errors.append({"error": error_msg, "trace": trace})
        self.metrics["error_rate_total"] += 1

    def get_metrics(self) -> dict:
        avg_latency = 0.0
        if self.metrics["api_latency_count"] > 0:
            avg_latency = self.metrics["api_latency_total"] / self.metrics["api_latency_count"]

        return {
            "request_count": self.metrics["request_count"],
            "failed_signatures": self.metrics["failed_signatures"],
            "oracle_failures": self.metrics["oracle_failures"],
            "contract_errors": self.metrics["contract_errors"],
            "average_latency_ms": round(avg_latency, 2),
            "errors_logged": len(self.errors)
        }

    def generate_report(self) -> str:
        met = self.get_metrics()
        return (
            f"Observability Status Report: Total API requests processed: {met['request_count']}. "
            f"Average latency registered: {met['average_latency_ms']} ms. "
            f"Integrity alerts: {met['failed_signatures']} signature errors, "
            f"{met['oracle_failures']} oracle faults, {met['contract_errors']} contract faults."
        )

# Global singleton
observability = ObservabilityEngine()
