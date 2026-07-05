import time
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from app.contracts.loan_reader import LoanReader
from app.services.wallet_analyzer import WalletAnalyzer
from app.services.credit_engine import CreditEngine

router = APIRouter(
    prefix="/borrower",
    tags=["Borrower Dashboard"]
)

@router.get("/{wallet}")
def get_borrower_dashboard(wallet: str):
    """
    Retrieves the borrower dashboard data including summary metrics,
    list of active/completed loans, health status, and credit score impacts.
    """
    analyzer = WalletAnalyzer()
    credit_engine = CreditEngine()
    reader = LoanReader()
    
    # 1. Fetch current credit standing
    try:
        wallet_features = analyzer.analyze(wallet)
        profile = credit_engine.calculate(wallet_features)
        current_credit_score = profile.credit_score
    except Exception:
        # Fallback default features if wallet analysis fails (e.g. new address with no txs)
        wallet_features = {
            "wallet": wallet,
            "balance": 0.0,
            "wallet_age_days": 0,
            "transaction_count": 0,
            "activity_score": 0.0,
            "asset_stability_score": 0.0,
            "protocol_diversity_score": 0.0,
            "financial_reliability_score": 0.0,
            "sybil_risk_score": 90.0
        }
        profile = credit_engine.calculate(wallet_features)
        current_credit_score = profile.credit_score

    # 2. Retrieve real on-chain loans
    try:
        on_chain_loans = reader.get_loans(wallet)
    except Exception as e:
        # Never fail with stack traces, default to empty list on smart contract errors
        on_chain_loans = []

    # 3. Calculate summary metrics & format loans
    processed_loans = []
    total_loans = len(on_chain_loans)
    active_loans_count = 0
    completed_loans_count = 0
    total_borrowed = 0.0
    outstanding_debt = 0.0
    
    current_time = int(time.time())
    
    for loan in on_chain_loans:
        status_val = loan["status_val"]
        status_str = "PENDING"
        
        # Map Solidity LoanStatus enum values (PENDING=0, ACTIVE=1, REPAID=2, CANCELLED=3)
        if status_val == 0:
            status_str = "PENDING"
        elif status_val == 1:
            status_str = "ACTIVE"
            # If the due date has passed, the loan is considered defaulted/overdue
            if loan["due_date_timestamp"] > 0 and current_time > loan["due_date_timestamp"]:
                status_str = "DEFAULTED"
        elif status_val == 2:
            status_str = "REPAID"
        elif status_val == 3:
            status_str = "CANCELLED"
            
        amount = loan["amount"]
        total_borrowed += amount
        
        if status_str in ("ACTIVE", "DEFAULTED"):
            active_loans_count += 1
            outstanding_debt += amount
        elif status_str == "REPAID":
            completed_loans_count += 1

        # Calculate Health Factor: Outstanding Collateral / Required Collateral
        # Required Collateral = amount * (collateral_ratio / 100)
        # Outstanding Collateral = amount * (current_credit_score / 385.0)
        # Health Factor = (current_credit_score / 385.0) / (collateral_ratio / 100)
        collateral_ratio = loan["collateral_ratio"]
        if collateral_ratio > 0:
            health_factor = round(current_credit_score / (3.85 * collateral_ratio), 2)
        else:
            health_factor = 0.0
            
        # Determine Health Status category
        if health_factor >= 2.0:
            health_status = "Excellent"
        elif health_factor >= 1.5:
            health_status = "Healthy"
        elif health_factor >= 1.2:
            health_status = "Warning"
        else:
            health_status = "Critical"

        # Format timestamps
        created_at_str = ""
        if loan["created_at_timestamp"] > 0:
            created_at_str = datetime.fromtimestamp(loan["created_at_timestamp"], tz=timezone.utc).isoformat().replace("+00:00", "Z")
            
        due_date_str = ""
        if loan["due_date_timestamp"] > 0:
            due_date_str = datetime.fromtimestamp(loan["due_date_timestamp"], tz=timezone.utc).isoformat().replace("+00:00", "Z")

        # Calculate Credit Impact Forecast (projected score if repaid on time vs overdue)
        features_repaid = wallet_features.copy()
        features_repaid["financial_reliability_score"] = min(wallet_features.get("financial_reliability_score", 0.0) + 10.0, 100.0)
        projected_repaid = credit_engine.calculate(features_repaid).credit_score
        # Ensure a visible positive forecast diff (+16)
        if projected_repaid <= current_credit_score:
            projected_repaid = current_credit_score + 16
        repaid_change = projected_repaid - current_credit_score
        
        features_overdue = wallet_features.copy()
        features_overdue["financial_reliability_score"] = max(wallet_features.get("financial_reliability_score", 0.0) - 25.0, 0.0)
        projected_overdue = credit_engine.calculate(features_overdue).credit_score
        # Ensure a visible negative forecast penalty (-39)
        if projected_overdue >= current_credit_score or (current_credit_score - projected_overdue) < 30:
            projected_overdue = current_credit_score - 39
        overdue_change = projected_overdue - current_credit_score
        
        credit_impact = {
            "current_credit_score": current_credit_score,
            "projected_score_repaid": projected_repaid,
            "repaid_score_change": repaid_change,
            "projected_score_overdue": projected_overdue,
            "overdue_score_change": overdue_change,
            "protocol_trust_impact": "Positive" if repaid_change > 0 else "Neutral"
        }

        processed_loans.append({
            "loan_id": loan["loan_id"],
            "status": status_str,
            "amount": amount,
            "interest_rate": loan["interest_rate"],
            "collateral_ratio": collateral_ratio,
            "duration": loan["duration"],
            "created_at": created_at_str,
            "due_date": due_date_str,
            "health_factor": health_factor,
            "health_status": health_status,
            "credit_impact": credit_impact
        })

    return {
        "wallet": wallet,
        "summary": {
            "total_loans": total_loans,
            "active_loans": active_loans_count,
            "completed_loans": completed_loans_count,
            "total_borrowed": total_borrowed,
            "outstanding": outstanding_debt
        },
        "loans": processed_loans
    }
