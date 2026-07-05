import time
from app.contracts.loan_reader import LoanReader
from app.services.history_service import HistoryService
from app.database.reputation_history import (
    get_reputation_history,
    add_profile_version,
    add_evolution_event
)

class ReputationEngine:
    def __init__(self):
        self.reader = LoanReader()

    def update_after_loan(self, wallet: str, loan_id: str, credit_score: int) -> dict:
        """
        Updates the reputation profile and trust score after a loan is created on-chain.
        """
        history_record = get_reputation_history(wallet, current_credit_score=credit_score)
        prev_trust = history_record["trust_score"]
        
        # Temporary decrease in trust score due to new debt liability
        new_trust = max(0, prev_trust - 3)
        delta = new_trust - prev_trust
        
        add_profile_version(wallet, credit_score, new_trust, "Loan Created")
        add_evolution_event(
            wallet,
            previous_score=prev_trust,
            current_score=new_trust,
            delta=delta,
            reason=f"New loan liability created: #{loan_id[:8]}."
        )
        
        return {
            "previous_score": prev_trust,
            "current_score": new_trust,
            "delta": delta,
            "reason": f"New loan liability created: #{loan_id[:8]}."
        }

    def update_after_repayment(self, wallet: str, loan_id: str, credit_score: int, is_on_time: bool) -> dict:
        """
        Updates the reputation profile and trust score after a loan is repaid on-chain.
        """
        history_record = get_reputation_history(wallet, current_credit_score=credit_score)
        prev_trust = history_record["trust_score"]
        
        if is_on_time:
            delta = 12
            reason = f"Loan #{loan_id[:8]} repaid successfully on time."
            trigger = "Loan repaid on time"
        else:
            delta = -25
            reason = f"Loan #{loan_id[:8]} repaid late."
            trigger = "Loan repaid late"
            
        new_trust = min(100, max(0, prev_trust + delta))
        final_delta = new_trust - prev_trust
        
        add_profile_version(wallet, credit_score, new_trust, trigger)
        add_evolution_event(
            wallet,
            previous_score=prev_trust,
            current_score=new_trust,
            delta=final_delta,
            reason=reason
        )
        
        return {
            "previous_score": prev_trust,
            "current_score": new_trust,
            "delta": final_delta,
            "reason": reason
        }

    def calculate_trust_score(self, wallet: str) -> int:
        """
        Returns the current trust score for the wallet.
        """
        history_record = get_reputation_history(wallet)
        return history_record["trust_score"]

    def generate_reputation_profile(self, wallet: str) -> dict:
        """
        Retrieves the complete reputation profile of the wallet by combining
        immutable on-chain loan/repayment states and saved reputation history.
        """
        # Read on-chain loans
        loans = self.reader.get_loans(wallet)
        
        # Read events from blockchain for repayment history
        w3 = self.reader.w3
        contract = self.reader.contract
        
        try:
            events = contract.events.LoanRepaid.get_logs(from_block=29868000)
            repaid_timestamps = {}
            block_cache = {}
            for event in events:
                loan_id = event.args.loanId
                block_num = event.blockNumber
                if block_num not in block_cache:
                    block = w3.eth.get_block(block_num)
                    block_cache[block_num] = block.timestamp
                repaid_timestamps[loan_id] = block_cache[block_num]
        except Exception:
            repaid_timestamps = {}
            
        # Compute metrics
        successful_loans = 0
        repaid_on_time = 0
        late_payments = 0
        current_time = int(time.time())
        
        for loan in loans:
            status_val = loan["status_val"]
            if status_val == 2:  # REPAID
                successful_loans += 1
                loan_id = loan["loan_id"]
                repaid_time = repaid_timestamps.get(loan_id, 0)
                if repaid_time > 0 and loan["due_date_timestamp"] > 0:
                    if repaid_time <= loan["due_date_timestamp"]:
                        repaid_on_time += 1
                    else:
                        late_payments += 1
                else:
                    repaid_on_time += 1  # Default fallback
            elif status_val == 1:  # ACTIVE
                if loan["due_date_timestamp"] > 0 and current_time > loan["due_date_timestamp"]:
                    late_payments += 1
                    
        # Get credit score history
        history_records = HistoryService.get_history(wallet)
        if history_records:
            current_credit_score = history_records[-1]["score"]
        else:
            current_credit_score = 600
            
        # Get reputation history from database
        history_record = get_reputation_history(wallet, current_credit_score=current_credit_score)
        trust_score = history_record["trust_score"]
        
        # Rating mapping
        if trust_score >= 90:
            rating = "Institutional"
        elif trust_score >= 75:
            rating = "Trusted"
        elif trust_score >= 60:
            rating = "Reliable"
        elif trust_score >= 40:
            rating = "Developing"
        else:
            rating = "High Risk"
            
        # Protocol confidence formula
        # Baseline confidence is the trust score. Successful loans boost it, late payments penalize it.
        confidence = trust_score
        confidence += successful_loans * 3
        confidence -= late_payments * 20
        protocol_confidence = min(100, max(0, confidence))
        
        # Format score history
        score_history = []
        for entry in history_record.get("history", []):
            score_history.append({
                "date": entry["timestamp"],
                "score": entry["credit_score"]
            })
            
        # Fallback if history is empty
        if not score_history:
            score_history.append({
                "date": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "score": current_credit_score
            })
            
        # Generate behavior summary
        if late_payments > 0:
            behavior_summary = "High risk profile detected due to late payments or default events. Refinancing eligibility restricted."
        elif successful_loans >= 3:
            behavior_summary = "Excellent repayment behavior. High protocol participation. Low financial risk."
        elif successful_loans > 0:
            behavior_summary = "Consistently repays loans before due dates."
        else:
            behavior_summary = "New protocol participant with baseline reputation. No active credit history on-chain."
            
        return {
            "wallet": wallet,
            "trust_score": trust_score,
            "rating": rating,
            "protocol_confidence": protocol_confidence,
            "successful_loans": successful_loans,
            "repaid_on_time": repaid_on_time,
            "late_payments": late_payments,
            "current_credit_score": current_credit_score,
            "score_history": score_history,
            "behavior_summary": behavior_summary,
            "events": history_record.get("events", [])
        }
