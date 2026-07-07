import unittest
from app.services.hsp_trust_engine import HSPTrustEngine
from app.services.trust.financial_identity_engine import FinancialIdentityEngine

class TestHSPTrustEngine(unittest.TestCase):
    def setUp(self):
        self.engine = HSPTrustEngine()
        self.borrower = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"
        self.lender = "0xF1CecB4757fdD9dbE22cDb4e965300cA129b84CF"
        self.amount = 500.0
        self.loan_id = "loan_test_101"

    def test_create_and_execute_settlement(self):
        # 1. Create settlement
        create_res = self.engine.createTrustSettlement(
            borrower=self.borrower,
            lender=self.lender,
            amount=self.amount,
            loanId=self.loan_id,
            purpose="Test Settlement"
        )
        self.assertIn("settlementId", create_res)
        self.assertEqual(create_res["status"], "CREATED")
        
        settlement_id = create_res["settlementId"]

        # 2. Execute settlement
        execute_res = self.engine.executeHSPSettlement(settlement_id)
        self.assertIn("txHash", execute_res)
        self.assertTrue(execute_res["verified"])
        
        # 3. Verify settlement proof
        is_valid = self.engine.verifySettlementProof(
            settlement_id=settlement_id,
            tx_hash=execute_res["txHash"],
            amount=self.amount,
            borrower=self.borrower,
            lender=self.lender
        )
        self.assertTrue(is_valid)

    def test_calculate_trust_impact(self):
        self.assertEqual(self.engine.calculateTrustImpact("SUCCESS"), 25)
        self.assertEqual(self.engine.calculateTrustImpact("LATE"), -15)
        self.assertEqual(self.engine.calculateTrustImpact("FAILED"), -50)

    def test_financial_identity_integration(self):
        # Verify that record_settlement correctly updates statistics in FinancialIdentityEngine
        fi_engine = FinancialIdentityEngine()
        
        # Capture previous stats
        identity_before = fi_engine.generate_identity(self.borrower)
        count_before = identity_before.get("settlementCount", 0)
        success_before = identity_before.get("successfulSettlements", 0)

        # Record a new successful settlement
        fi_engine.record_settlement(self.borrower, success=True)

        # Capture updated stats
        identity_after = fi_engine.generate_identity(self.borrower)
        self.assertEqual(identity_after["settlementCount"], count_before + 1)
        self.assertEqual(identity_after["successfulSettlements"], success_before + 1)
        self.assertGreater(identity_after["hspReliability"], 0)

if __name__ == "__main__":
    unittest.main()
