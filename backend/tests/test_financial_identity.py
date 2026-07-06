import unittest
from app.services.trust.financial_identity_engine import FinancialIdentityEngine

class TestFinancialIdentityEngine(unittest.TestCase):
    def setUp(self):
        self.engine = FinancialIdentityEngine()
        self.test_wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"

    def test_classify_entity(self):
        # Asserts entity classification works on the standard test wallet address
        res = self.engine.classify_entity(self.test_wallet)
        self.assertIn("type", res)
        self.assertIn("confidence", res)
        self.assertIn(res["type"], ["HUMAN", "AI_AGENT", "DAO", "BUSINESS", "INSTITUTION"])

    def test_calculate_financial_dna(self):
        # Asserts DNA values compute within standard ranges
        dna = self.engine.calculate_financial_dna(self.test_wallet)
        self.assertIn("trust", dna)
        self.assertIn("credit", dna)
        self.assertIn("reliability", dna)
        self.assertIn("risk", dna)
        self.assertIn("activity", dna)
        self.assertTrue(0 <= dna["trust"] <= 1000)
        self.assertTrue(0 <= dna["credit"] <= 1000)
        self.assertTrue(0 <= dna["reliability"] <= 1000)

    def test_generate_identity(self):
        # Asserts that generating full identities includes all required attributes
        identity = self.engine.generate_identity(self.test_wallet)
        self.assertEqual(identity["wallet"], self.test_wallet.lower())
        self.assertIn("type", identity)
        self.assertIn("confidence", identity)
        self.assertIn("tier", identity)
        self.assertIn("financialDNA", identity)
        self.assertIn("passportStatus", identity)
        self.assertIn("recommendation", identity)
        self.assertIn("timeline", identity)

    def test_generate_identity_timeline(self):
        # Asserts that timeline logs consolidate correctly
        timeline = self.engine.generate_identity_timeline(self.test_wallet)
        self.assertTrue(len(timeline) > 0)
        first_event = timeline[0]
        self.assertIn("event", first_event)
        self.assertIn("impact", first_event)
        self.assertIn("reason", first_event)
        self.assertIn("timestamp", first_event)

if __name__ == "__main__":
    unittest.main()
