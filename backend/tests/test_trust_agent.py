import unittest
from app.services.ai.trust_agent import CredenceTrustAgent

class TestCredenceTrustAgent(unittest.TestCase):
    def setUp(self):
        self.agent = CredenceTrustAgent()
        self.test_wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"

    def test_predict_default_risk(self):
        res = self.agent.predict_default_risk(self.test_wallet)
        self.assertEqual(res["wallet"], self.test_wallet.lower())
        self.assertIn("defaultRisk", res)
        self.assertIn("confidence", res)
        self.assertIn("riskTrend", res)
        self.assertIn("reasons", res)
        self.assertTrue(len(res["reasons"]) > 0)

    def test_detect_behavior_change(self):
        res = self.agent.detect_behavior_change(self.test_wallet)
        self.assertIn("previousTrust", res)
        self.assertIn("currentPrediction", res)
        self.assertIn("change", res)
        self.assertIn("reason", res)

    def test_recommend_financial_action(self):
        res = self.agent.recommend_financial_action(self.test_wallet)
        self.assertIn("decision", res)
        self.assertIn("recommendedLoan", res)
        self.assertIn("interest", res)
        self.assertIn("reason", res)
        self.assertIn(res["decision"], ["APPROVE", "REJECT", "ADJUST_TERMS"])

    def test_generate_trust_report(self):
        res = self.agent.generate_trust_report(self.test_wallet)
        self.assertIn("identity", res)
        self.assertIn("trustScore", res)
        self.assertIn("defaultPrediction", res)
        self.assertIn("recommendation", res)
        self.assertIn("confidence", res)

    def test_recommend_ecosystem_access(self):
        res = self.agent.recommend_ecosystem_access(self.test_wallet)
        self.assertEqual(res["wallet"], self.test_wallet.lower())
        self.assertIn("qualifications", res)
        self.assertIn("receiptsCount", res)
        self.assertIn("recommendation", res)
        self.assertTrue(len(res["qualifications"]) > 0)

    def test_analyze_settlement_reliability(self):
        res = self.agent.analyzeSettlementReliability(self.test_wallet)
        self.assertEqual(res["wallet"], self.test_wallet.lower())
        self.assertIn("total_settlements", res)
        self.assertIn("verified_settlements", res)
        self.assertIn("failed_settlements", res)
        self.assertIn("reliability_ratio", res)
        self.assertIn("analysis_report", res)
        self.assertIn("recommendations", res)

if __name__ == "__main__":
    unittest.main()
