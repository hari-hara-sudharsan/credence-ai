import os
import json
import time
from datetime import datetime
from app.services.wallet_analyzer import WalletAnalyzer
from app.services.credit_engine import CreditEngine
from app.services.reputation_engine import ReputationEngine
from app.services.passport_v2_service import PassportV2Service
from app.database.persistence import read_json

class FinancialIdentityEngine:
    def __init__(self):
        self.analyzer = WalletAnalyzer()
        self.credit = CreditEngine()
        self.reputation = ReputationEngine()
        
        # Instantiate passport service lazily to prevent env missing crashes during bootstrap
        try:
            self.passport_service = PassportV2Service()
        except Exception as e:
            print(f"Warning: PassportV2Service init failed: {e}")
            self.passport_service = None

    def generate_identity(self, wallet: str) -> dict:
        """
        Generates and returns complete financial identity.
        """
        wallet_lower = wallet.lower()
        
        # 1. Retrieve Passport data
        passport = None
        if self.passport_service:
            try:
                passport = self.passport_service.get_passport_by_wallet(wallet_lower)
            except Exception:
                pass
                
        # If passport doesn't exist yet, build fallback/metadata dynamically
        if not passport:
            try:
                features = self.analyzer.analyze(wallet_lower)
                credit_profile = self.credit.calculate(features)
                trust_score = self.reputation.calculate_trust_score(wallet_lower)
                passport = {
                    "passport_id": abs(hash(wallet_lower)) % 1000 + 1,
                    "wallet": wallet_lower,
                    "passport_status": "ACTIVE",
                    "credit_score": int(credit_profile.credit_score),
                    "trust_score": int(trust_score),
                    "risk_level": getattr(credit_profile, "risk_level", "LOW")
                }
            except Exception:
                passport = {
                    "passport_id": 999,
                    "wallet": wallet_lower,
                    "passport_status": "ACTIVE",
                    "credit_score": 600,
                    "trust_score": 50,
                    "risk_level": "LOW"
                }

        # 2. Classify Entity Type
        classification = self.classify_entity(wallet_lower)
        entity_type = classification["type"]
        confidence = classification["confidence"]

        # 3. Calculate Financial DNA
        dna = self.calculate_financial_dna(wallet_lower)

        # 4. Generate identity timeline
        timeline = self.generate_identity_timeline(wallet_lower)

        # Financial tier calculation based on trust score (DNA)
        trust_val = dna["trust"]
        if trust_val >= 750:
            tier = "PRIME"
        elif trust_val >= 600:
            tier = "RETAIL"
        else:
            tier = "WATCHLIST"

        recommendation = "Eligible for premium lending" if tier == "PRIME" else "Standard rate applies" if tier == "RETAIL" else "Risk monitoring active"

        return {
            "wallet": wallet_lower,
            "type": entity_type,
            "confidence": confidence,
            "tier": tier,
            "financialDNA": dna,
            "passportStatus": passport.get("passport_status") or passport.get("passportStatus") or "ACTIVE",
            "passportId": passport.get("passport_id") or passport.get("passportId") or 1,
            "recommendation": recommendation,
            "timeline": timeline
        }

    def classify_entity(self, wallet: str) -> dict:
        """
        Detect entity type dynamically based on wallet activity patterns.
        """
        wallet_lower = wallet.lower()
        try:
            features = self.analyzer.analyze(wallet_lower)
            tx_count = features.get("transaction_count", 0)
            balance = features.get("balance", 0.0)
            unique_contracts = features.get("protocol_diversity_score", 0) / 2
        except Exception:
            tx_count = 0
            balance = 0.0
            unique_contracts = 0

        # Heuristic rules for entity detection
        if balance >= 10000.0:
            return {"type": "INSTITUTION", "confidence": 92}
        elif unique_contracts >= 15:
            return {"type": "DAO", "confidence": 88}
        elif tx_count >= 100 and balance >= 2500.0:
            return {"type": "BUSINESS", "confidence": 85}
        elif tx_count > 0 and tx_count < 15 and unique_contracts >= 1:
            return {"type": "AI_AGENT", "confidence": 80}
        else:
            return {"type": "HUMAN", "confidence": 95}

    def calculate_financial_dna(self, wallet: str) -> dict:
        """
        Calculate trust score, credit, reliability, default risk, and activity levels.
        """
        wallet_lower = wallet.lower()
        try:
            features = self.analyzer.analyze(wallet_lower)
            credit_profile = self.credit.calculate(features)
            credit_score = int(credit_profile.credit_score)
            pod = getattr(credit_profile, "probability_of_default", 5.0)
            risk = int(pod)
            reliability = int(features.get("financial_reliability_score", 90.0) * 10)
            activity = int(features.get("activity_score", 88.0))
        except Exception:
            credit_score = 600
            reliability = 900
            risk = 5
            activity = 80

        try:
            reputation_score = int(self.reputation.calculate_trust_score(wallet_lower))
        except Exception:
            reputation_score = 50

        # Retrieve verified trust receipts
        try:
            from app.services.trust.trust_receipt_engine import TrustReceiptEngine
            receipts_engine = TrustReceiptEngine()
            receipts = receipts_engine.get_wallet_receipts(wallet_lower)
        except Exception:
            receipts = []

        trust_receipts_count = len(receipts)
        positive_events = 0
        negative_events = 0
        positive_impact = 0
        negative_impact = 0

        for r in receipts:
            if r.get("verified", True):
                impact_str = r.get("impact", "+0")
                try:
                    impact_val = int(impact_str.replace("+", ""))
                except Exception:
                    impact_val = 0
                if impact_val >= 0:
                    positive_impact += impact_val
                    positive_events += 1
                else:
                    negative_impact += abs(impact_val)
                    negative_events += 1

        # Trust Score = Credit + Reputation + Verified Receipts - Risk Events
        raw_trust = credit_score + reputation_score + positive_impact - negative_impact
        trust_score = max(min(raw_trust, 1000), 300)

        return {
            "trust": trust_score,
            "credit": credit_score,
            "reliability": reliability,
            "risk": risk,
            "activity": activity,
            "trustReceipts": trust_receipts_count,
            "positiveEvents": positive_events,
            "negativeEvents": negative_events
        }

    def generate_identity_timeline(self, wallet: str) -> list:
        """
        Amalgamates reputation changes, HSP settlements, loan history, and verifiable trust receipts into an audit timeline.
        """
        wallet_lower = wallet.lower()
        timeline = []
        
        # 1. Fetch reputation events
        try:
            profile = self.reputation.generate_reputation_profile(wallet_lower)
            events = profile.get("events", [])
            for ev in events:
                delta = ev.get("delta", 0)
                impact = f"+{delta}" if delta >= 0 else f"{delta}"
                timeline.append({
                    "event": "REPUTATION_UPDATE",
                    "impact": impact,
                    "reason": ev.get("reason", "Reputation change recorded."),
                    "timestamp": ev.get("timestamp") or datetime.utcnow().isoformat() + "Z"
                })
        except Exception:
            pass

        # 2. Fetch P2P loans history
        try:
            loans = read_json("p2p_loans.json", [])
            for loan in loans:
                if loan.get("borrower", "").lower() == wallet_lower:
                    created_at = loan.get("created_at") or loan.get("timestamp")
                    if created_at:
                        timeline.append({
                            "event": "CREDIT_CREATED",
                            "impact": "+50",
                            "reason": f"Requested loan offer of {loan.get('amount')} HSK.",
                            "timestamp": created_at
                        })
                    if loan.get("status") == "REPAID":
                        repaid_at = loan.get("repaid_at") or loan.get("updated_at") or created_at
                        timeline.append({
                            "event": "LOAN_REPAID",
                            "impact": "+100",
                            "reason": f"Successfully repaid loan offer of {loan.get('amount')} HSK.",
                            "timestamp": repaid_at
                        })
        except Exception:
            pass

        # 3. Fetch HSP settlements history
        try:
            settlements = read_json("settlements.json", [])
            for s in settlements:
                if s.get("borrower", "").lower() == wallet_lower:
                    executed_at = s.get("executedAt") or s.get("timestamp")
                    if executed_at:
                        timeline.append({
                            "event": "SETTLEMENT_VERIFIED",
                            "impact": "+75",
                            "reason": f"HSP settlement complete. Verified amount: {s.get('amount')}.",
                            "timestamp": executed_at
                        })
        except Exception:
            pass

        # 4. Fetch Verifiable Trust Receipts
        try:
            from app.services.trust.trust_receipt_engine import TrustReceiptEngine
            receipts_engine = TrustReceiptEngine()
            receipts = receipts_engine.get_wallet_receipts(wallet_lower)
            for r in receipts:
                timeline.append({
                    "event": r["type"],
                    "impact": r["impact"],
                    "reason": f"Verifiable cryptographic receipt issued. Proof: {r['proof'][:10]}...",
                    "timestamp": r.get("timestamp") or datetime.utcnow().isoformat() + "Z"
                })
        except Exception:
            pass

        # Default fallback
        if not timeline:
            timeline.append({
                "event": "PASSPORT_CREATED",
                "impact": "+50",
                "reason": "Universal trust passport V2 initialized on Cancun.",
                "timestamp": datetime.utcnow().isoformat() + "Z"
            })
            
        # Sort chronologically
        try:
            timeline.sort(key=lambda x: x["timestamp"])
        except Exception:
            pass
            
        return timeline
