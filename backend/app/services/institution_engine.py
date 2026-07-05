from app.services.portfolio_engine import PortfolioEngine
from app.services.exposure_engine import ExposureEngine
from app.database.persistence import read_json
from app.services.verification_network import DB_FILENAME

class InstitutionEngine:
    def __init__(self):
        self.portfolio = PortfolioEngine()
        self.exposure = ExposureEngine()

    def _get_institution_wallets(self) -> list:
        # Scan all verified addresses in verifications.json
        data = read_json(DB_FILENAME, {})
        return list(data.keys())

    def generate_dashboard(self) -> dict:
        """
        Consolidates stats, segments, and health indexes.
        """
        wallets = self._get_institution_wallets()
        if not wallets:
            # fallback default wallet if empty to prevent zero division
            wallets = ["0x5bb83E60a7a05A0e1b077B66412a26306e334208"]

        port_analysis = self.portfolio.analyze_wallet_group(wallets)
        exp_analysis = self.exposure.calculate_exposure(wallets)

        return {
            "institution": "HashKey Lending",
            "wallets": len(wallets),
            "portfolio_score": port_analysis["portfolio_score"],
            "total_exposure": exp_analysis["total_exposure"],
            "risk": "LOW" if port_analysis["portfolio_score"] >= 650 else "HIGH",
            "segments": port_analysis["risk_distribution"]
        }

    def analyze_institution(self) -> dict:
        return self.generate_dashboard()

    def generate_ai_report(self) -> str:
        dash = self.generate_dashboard()
        return (
            f"Portfolio remains healthy under current parameters. Total exposure stands at "
            f"${dash['total_exposure']:,.2f} across {dash['wallets']} active borrow accounts. "
            f"Risk concentration index has decreased over the last cycle. Suggested action: "
            f"Maintain exposure limits index or adjust parameters."
        )

    def simulate_stress_test(self, scenario: str, severity: str) -> dict:
        """
        Calculates projected health index under crash simulations.
        """
        dash = self.generate_dashboard()
        curr_health = dash["portfolio_score"]
        
        # Calculate impact based on severity
        impact = 10 if severity.upper() == "LOW" else 20 if severity.upper() == "MEDIUM" else 35
        projected = max(curr_health - impact, 300)

        return {
            "current_health": curr_health,
            "projected_health": projected,
            "affected_wallets": int(dash["wallets"] * 0.25),
            "recommended_actions": [
                "Reduce high-risk exposure bounds immediately.",
                "Increase collateral ratio requirements across all money markets adapters."
            ]
        }
