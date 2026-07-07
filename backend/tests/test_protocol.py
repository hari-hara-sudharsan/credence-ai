import unittest
import time
from app.services.ecosystem.protocol_consumer_engine import ProtocolConsumerEngine
from app.services.signature_engine import SignatureEngine
from web3 import Web3

class TestProtocolConsumerEngine(unittest.TestCase):
    def setUp(self):
        self.engine = ProtocolConsumerEngine()
        self.signature_engine = SignatureEngine()
        self.test_wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"

    def test_verify_trust_for_protocol(self):
        res = self.engine.verifyTrustForProtocol(self.test_wallet, "LENDING")
        self.assertIn("approved", res)
        self.assertIn("score", res)
        self.assertIn("tier", res)
        self.assertTrue(res["score"] >= 300)

    def test_generate_protocol_decision_and_signature(self):
        res = self.engine.generateProtocolDecision(self.test_wallet, "PAYFI")
        self.assertIn("decision", res)
        self.assertIn("trustScore", res)
        self.assertIn("terms", res)
        self.assertIn("proof", res)
        
        proof = res["proof"]
        self.assertIn("signature", proof)
        self.assertIn("timestamp", proof)
        
        # Verify the signature using SignatureEngine
        is_valid = self.signature_engine.verify_protocol_decision(
            wallet=self.test_wallet,
            application="PAYFI",
            trust_score=res["trustScore"],
            limit=res["terms"]["limit"],
            timestamp=proof["timestamp"],
            signature=proof["signature"]
        )
        self.assertTrue(is_valid)

    def test_calculate_access_level(self):
        self.assertEqual(self.engine.calculateAccessLevel(self.test_wallet, 800), "PRIME")
        self.assertEqual(self.engine.calculateAccessLevel(self.test_wallet, 550), "STANDARD")
        self.assertEqual(self.engine.calculateAccessLevel(self.test_wallet, 350), "SUBPRIME")

if __name__ == "__main__":
    unittest.main()
