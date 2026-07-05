import unittest
from app.services.trust_graph_engine import TrustGraphEngine
from app.services.ai_risk_monitor import AIRiskMonitor

class TestTrustGraphEngine(unittest.TestCase):
    def setUp(self):
        self.engine = TrustGraphEngine()
        self.risk_monitor = AIRiskMonitor()
        self.test_wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"

    def test_generate_trust_graph(self):
        graph = self.engine.generate_trust_graph(self.test_wallet)
        self.assertEqual(graph["entity"], self.test_wallet)
        self.assertIn("trust_score", graph)
        self.assertIn("nodes", graph)
        self.assertIn("edges", graph)
        self.assertTrue(len(graph["nodes"]) > 0)
        self.assertTrue(len(graph["edges"]) > 0)

    def test_calculate_network_reputation(self):
        rep = self.engine.calculate_network_reputation(self.test_wallet)
        self.assertIn("score", rep)
        self.assertIn("repayments", rep)
        self.assertIn("defaults", rep)
        self.assertIn("history", rep)

    def test_analyze_protocol_relationship(self):
        rel = self.engine.analyze_protocol_relationship(self.test_wallet, "Lending")
        self.assertEqual(rel["wallet"], self.test_wallet)
        self.assertEqual(rel["protocol"], "Lending")
        self.assertIn("health_index", rel)
        self.assertIn("status", rel)

    def test_risk_monitor_default_risk(self):
        risk = self.risk_monitor.detect_default_risk(self.test_wallet)
        self.assertEqual(risk["wallet"], self.test_wallet)
        self.assertIn("default_probability", risk)
        self.assertIn("risk_level", risk)
        self.assertIn("risk_triggers", risk)

    def test_risk_monitor_credit_change(self):
        change = self.risk_monitor.predict_credit_change(self.test_wallet)
        self.assertIn("direction", change)
        self.assertIn("expected_change", change)
        self.assertIn("prediction_horizon", change)

    def test_risk_monitor_recommend_actions(self):
        rec = self.risk_monitor.recommend_actions(self.test_wallet)
        self.assertEqual(rec["wallet"], self.test_wallet)
        self.assertTrue(len(rec["recommendations"]) > 0)

if __name__ == "__main__":
    unittest.main()
