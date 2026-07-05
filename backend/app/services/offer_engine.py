from datetime import datetime, timezone, timedelta
import uuid
import hashlib
import json
from app.schemas.loan_offer import LoanOffer

class LoanOfferEngine:
    def generate_offer(
        self,
        wallet: str,
        credit_profile,
        lending_profile,
        balance: float = None
    ) -> LoanOffer:
        # Determine approval status based on lending eligibility
        approved = lending_profile.eligible
        score = credit_profile.credit_score
        
        if approved:
            # Reconstruct balance from lending_profile if not passed
            if balance is None:
                if score >= 800:
                    balance = lending_profile.max_loan_amount / 0.9
                elif score >= 700:
                    balance = lending_profile.max_loan_amount / 0.8
                elif score >= 600:
                    balance = lending_profile.max_loan_amount / 0.7
                elif score >= 500:
                    balance = lending_profile.max_loan_amount / 0.5
                else:
                    balance = 0.0
            
            # Map max_ltv based on credit score
            if score >= 900:
                max_ltv = 95.0
            elif score >= 800:
                max_ltv = 90.0
            elif score >= 700:
                max_ltv = 85.0
            elif score >= 600:
                max_ltv = 75.0
            else:
                max_ltv = 60.0
                
            # approved_amount = balance * max_ltv / 100, capped at 1000 HSK
            approved_amount = (balance * max_ltv) / 100.0
            if approved_amount > 1000.0:
                approved_amount = 1000.0
        else:
            approved_amount = 0.0

        # Protocol default configuration values
        duration_days = 30
        
        # Expiration is current UTC time + 15 minutes, truncated to seconds
        expires_at = (datetime.now(timezone.utc) + timedelta(minutes=15)).replace(microsecond=0)
        
        # Build initial dict for the offer
        offer_id = str(uuid.uuid4())
        
        # Reason: Use lending decision reason
        reason = lending_profile.decision_reason
        
        # Prepare the fields to construct LoanOffer
        # Format datetime objects as ISO format string for hashing
        def serialize_datetime(dt: datetime) -> str:
            s = dt.isoformat()
            if s.endswith("+00:00"):
                return s[:-6] + "Z"
            return s
            
        hash_data = {
            "offer_id": offer_id,
            "wallet": wallet,
            "credit_score": score,
            "rating": credit_profile.rating,
            "risk_level": lending_profile.risk_level,
            "approved": approved,
            "approved_amount": approved_amount,
            "interest_rate": lending_profile.interest_rate,
            "collateral_ratio": float(lending_profile.collateral_ratio),
            "duration_days": duration_days,
            "expires_at": serialize_datetime(expires_at),
            "reason": reason
        }
        
        # Create SHA-256 digest of the serialized dict
        serialized = json.dumps(hash_data, sort_keys=True)
        hasher = hashlib.sha256()
        hasher.update(serialized.encode("utf-8"))
        offer_hash = "0x" + hasher.hexdigest()
        
        return LoanOffer(
            offer_id=offer_id,
            wallet=wallet,
            credit_score=score,
            rating=credit_profile.rating,
            risk_level=lending_profile.risk_level,
            approved=approved,
            approved_amount=approved_amount,
            interest_rate=lending_profile.interest_rate,
            collateral_ratio=float(lending_profile.collateral_ratio),
            duration_days=duration_days,
            expires_at=expires_at,
            reason=reason,
            offer_hash=offer_hash
        )
