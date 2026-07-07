import unittest
from app.services.security.trust_defense_engine import TrustDefenseEngine
from app.services.trust.financial_identity_engine import FinancialIdentityEngine

class TestTrustDefense(unittest.TestCase):
    def setUp(self):
        self.defense_engine = TrustDefenseEngine()
        self.identity_engine = FinancialIdentityEngine()
        self.normal_wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"
        self.sybil_wallet = "0xbad_sybil_farming_address_102"
        self.circular_wallet = "0xcirc_volume_loop_address"

    def test_normal_user_clearance(self):
        report = self.defense_engine.generate_defense_report(self.normal_wallet)
        self.assertEqual(report["sybilRisk"], "LOW")
        self.assertTrue(report["trustSafe"])
        self.assertEqual(report["authenticityScore"], 100)

    def test_sybil_farming_blocked(self):
        report = self.defense_engine.generate_defense_report(self.sybil_wallet)
        self.assertEqual(report["sybilRisk"], "HIGH")
        self.assertFalse(report["trustSafe"])
        self.assertEqual(report["authenticityScore"], 30) # 100 - 40 (sybil) - 30 (circular) - 20 (farming) = 10, capped at 30

    def test_circular_transaction_penalized(self):
        report = self.defense_engine.generate_defense_report(self.circular_wallet)
        self.assertFalse(report["trustSafe"])
        self.assertEqual(report["authenticityScore"], 70) # 100 - 30 (circular) = 70

    def test_identity_incorporates_metrics(self):
        identity = self.identity_engine.generate_identity(self.normal_wallet)
        self.assertIn("authenticityScore", identity)
        self.assertIn("sybilRisk", identity)
        self.assertIn("trustConfidence", identity)
        self.assertEqual(identity["trustConfidence"], "VERIFIED")

if __name__ == "__main__":
    unittest.main()
