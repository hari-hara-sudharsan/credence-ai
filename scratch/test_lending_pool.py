import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

def test_lending_pool():
    print("Starting E2E Lending Pool tests...")
    client = TestClient(app)

    wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208"

    # 1. Deposit Liquidity
    print("1. Testing deposit liquidity...")
    res_dep = client.post("/pool/deposit", json={"wallet": wallet, "amount": 10000.0})
    assert res_dep.status_code == 200, res_dep.text
    pos = res_dep.json()
    print("Lender position after deposit:", pos)
    assert pos["balance"] >= 10000.0

    # 2. Get Pool Stats & Utilization
    print("2. Testing pool stats...")
    res_stats = client.get("/pool/stats")
    assert res_stats.status_code == 200, res_stats.text
    stats = res_stats.json()
    print("Pool stats:", stats)
    assert stats["total_liquidity"] >= 10000.0

    # 3. Dynamic Interest Calculations check
    print("3. Testing dynamic interest calculations...")
    from app.services.interest_engine import DynamicInterestEngine
    ie = DynamicInterestEngine()
    
    # Prime borrower (Score 750, low risk, low utilization)
    prime_terms = ie.calculate_rate(750, "LOW_RISK", 0.01, 0.25)
    print("Prime Terms:", prime_terms)
    assert prime_terms["borrow_rate"] < 5.0  # Discounted

    # Subprime borrower (Score 500, high risk, high utilization)
    subprime_terms = ie.calculate_rate(500, "HIGH_RISK", 0.15, 0.85)
    print("Subprime Terms:", subprime_terms)
    assert subprime_terms["borrow_rate"] > 10.0  # Penalized

    # 4. Capital Efficiency
    print("4. Testing capital efficiency stats...")
    res_eff = client.get("/pool/capital-efficiency")
    assert res_eff.status_code == 200, res_eff.text
    eff = res_eff.json()
    print("Capital savings details:", eff)
    assert "capital_saved" in eff

    print("All Lending Pool Integration tests passed successfully!")

if __name__ == "__main__":
    test_lending_pool()
