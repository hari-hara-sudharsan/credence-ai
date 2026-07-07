import unittest
from app.services.trust.trust_evolution_engine import TrustEvolutionEngine
from app.services.finance.dynamic_terms_engine import DynamicTermsEngine

class TestTrustEvolution(unittest.TestCase):
    def setUp(self):
        self.evolution_engine = TrustEvolutionEngine()
        self.terms_engine = DynamicTermsEngine()
        self.test_wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"

    def test_calculate_trust_growth(self):
        growth = self.evolution_engine.calculateTrustGrowth(self.test_wallet, "HSP_SETTLEMENT", "proof_id_101")
        self.assertEqual(growth["change"], "+25")
        self.assertIn("verified", growth["reason"].lower())
        self.assertEqual(growth["newScore"], growth["previousScore"] + 25)

    def test_dynamic_terms_mapping(self):
        prime_terms = self.terms_engine.calculateLoanTerms(820)
        self.assertEqual(prime_terms["limit"], 10000.0)
        self.assertEqual(prime_terms["interest"], 5.0)

        emerging_terms = self.terms_engine.calculateLoanTerms(620)
        self.assertEqual(emerging_terms["limit"], 1000.0)
        self.assertEqual(emerging_terms["interest"], 15.0)

        subprime_terms = self.terms_engine.calculateLoanTerms(350)
        self.assertEqual(subprime_terms["limit"], 100.0)
        self.assertEqual(subprime_terms["interest"], 25.0)

    def test_generate_before_after_snapshot(self):
        snapshot = self.evolution_engine.generateBeforeAfterSnapshot(self.test_wallet)
        self.assertIn("before", snapshot)
        self.assertIn("after", snapshot)
        self.assertEqual(snapshot["before"]["tier"], "EMERGING")
        self.assertEqual(snapshot["after"]["tier"], "PRIME")
        self.assertEqual(snapshot["after"]["loanLimit"], 10000)

if __name__ == "__main__":
    unittest.main()
