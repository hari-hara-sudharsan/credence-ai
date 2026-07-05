from app.adapters.lending_adapter import LendingAdapter
from app.adapters.insurance_adapter import InsuranceAdapter
from app.adapters.rwa_adapter import RwaAdapter
from app.adapters.dao_adapter import DaoAdapter
from app.adapters.institutional_adapter import InstitutionalAdapter

class ProtocolProfileEngine:
    @staticmethod
    def get_protocol_profile(wallet: str) -> dict:
        """
        Consolidates raw wallet features, reputation logs, and credit profiles
        into a unified, protocol-agnostic profile context.
        """
        from app.services.wallet_analyzer import WalletAnalyzer
        from app.services.credit_engine import CreditEngine
        from app.services.reputation_engine import ReputationEngine
        
        analyzer = WalletAnalyzer()
        credit_engine = CreditEngine()
        reputation_engine = ReputationEngine()
        
        # 1. Analyze wallet features
        wallet_features = analyzer.analyze(wallet)
        
        # 2. Compute credit engine profile
        credit_profile = credit_engine.calculate(wallet_features)
        
        # 3. Fetch dynamically updated reputation profile
        reputation_profile = reputation_engine.generate_reputation_profile(wallet)
        
        return {
            "credit_score": credit_profile.credit_score,
            "rating": credit_profile.rating,
            "confidence": credit_profile.confidence,
            "probability_of_default": credit_profile.probability_of_default,
            "trust_score": reputation_profile["trust_score"],
            "reputation_rating": reputation_profile["rating"],
            "successful_loans": reputation_profile["successful_loans"],
            "repaid_on_time": reputation_profile["repaid_on_time"],
            "late_payments": reputation_profile["late_payments"],
            "balance": wallet_features["balance"],
            "wallet_age_days": wallet_features["wallet_age_days"],
            "transaction_count": wallet_features["transaction_count"],
            "activity_score": wallet_features["activity_score"],
            "asset_stability_score": wallet_features["asset_stability_score"],
            "protocol_diversity_score": wallet_features["protocol_diversity_score"],
            "financial_reliability_score": wallet_features["financial_reliability_score"],
            "sybil_risk_score": wallet_features["sybil_risk_score"]
        }

class AdapterFactory:
    _adapters = {
        "LENDING": LendingAdapter(),
        "INSURANCE": InsuranceAdapter(),
        "RWA": RwaAdapter(),
        "DAO": DaoAdapter(),
        "INSTITUTIONAL": InstitutionalAdapter()
    }

    @classmethod
    def get_adapter(cls, protocol: str):
        """
        Instantiates and returns the selected ProtocolAdapter.
        Raises ValueError if protocol type is unsupported.
        """
        upper_protocol = protocol.upper()
        if upper_protocol not in cls._adapters:
            raise ValueError(f"Unsupported protocol type: '{protocol}'. Supported options are: {list(cls._adapters.keys())}")
        return cls._adapters[upper_protocol]

    @classmethod
    def get_supported_protocols(cls) -> list:
        """
        Returns a list of all supported protocol integrations.
        """
        return list(cls._adapters.keys())
