import os
import uuid
import json
import time
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from web3 import Web3

from app.database.persistence import read_json, write_json
from app.services.wallet_analyzer import WalletAnalyzer
from app.services.credit_engine import CreditEngine
from app.services.credit_analyst import CreditAnalyst
from app.services.ai.trust_agent import CredenceTrustAgent
from app.services.trust.financial_identity_engine import FinancialIdentityEngine
from app.services.trust.trust_receipt_engine import TrustReceiptEngine
from app.services.oracle_attestation_service import OracleAttestationService
from app.services.signature_engine import SignatureEngine

P2P_DB = "p2p_loans.json"

P2P_MARKET_ABI = [
    {
        "inputs": [
            {"internalType": "uint256", "name": "amount", "type": "uint256"},
            {"internalType": "uint256", "name": "interestRate", "type": "uint256"},
            {"internalType": "uint256", "name": "duration", "type": "uint256"},
            {"internalType": "uint256", "name": "creditScore", "type": "uint256"},
            {"internalType": "bytes32", "name": "purpose", "type": "bytes32"}
        ],
        "name": "createLoanRequest",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "requestId", "type": "uint256"}
        ],
        "name": "fundLoan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "requestId", "type": "uint256"}
        ],
        "name": "activateLoan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "requestId", "type": "uint256"}
        ],
        "name": "repayLoan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "requestId", "type": "uint256"}
        ],
        "name": "getLoanRequest",
        "outputs": [
            {
                "components": [
                    {"internalType": "uint256", "name": "id", "type": "uint256"},
                    {"internalType": "address", "name": "borrower", "type": "address"},
                    {"internalType": "address", "name": "lender", "type": "address"},
                    {"internalType": "uint256", "name": "amount", "type": "uint256"},
                    {"internalType": "uint256", "name": "interestRate", "type": "uint256"},
                    {"internalType": "uint256", "name": "duration", "type": "uint256"},
                    {"internalType": "uint256", "name": "status", "type": "uint8"},
                    {"internalType": "uint256", "name": "creditScore", "type": "uint256"},
                    {"internalType": "bytes32", "name": "purpose", "type": "bytes32"},
                    {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
                    {"internalType": "uint256", "name": "fundedAt", "type": "uint256"},
                    {"internalType": "uint256", "name": "dueDate", "type": "uint256"}
                ],
                "internalType": "struct P2PLendingMarket.LoanRequest",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getOpenRequests",
        "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "borrower", "type": "address"}
        ],
        "name": "getBorrowerRequests",
        "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "lender", "type": "address"}
        ],
        "name": "getLenderFundedLoans",
        "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
    }
]

class P2PLendingEngine:
    def __init__(self):
        self.analyzer = WalletAnalyzer()
        self.engine = CreditEngine()
        self.analyst = CreditAnalyst()
        
        self.hsk_rpc = os.getenv("HSK_RPC", "http://127.0.0.1:8545")
        self.private_key = os.getenv("PRIVATE_KEY")
        self.market_address = os.getenv("P2P_MARKET_ADDRESS")
        
        if self.hsk_rpc and self.market_address:
            try:
                from app.contracts.web3_provider import create_web3_with_retry
                self.w3 = create_web3_with_retry(self.hsk_rpc)
                self.contract = self.w3.eth.contract(
                    address=Web3.to_checksum_address(self.market_address),
                    abi=P2P_MARKET_ABI
                )
            except Exception as e:
                print(f"Warning: failed to initialize onchain P2P Market: {e}")
                self.contract = None
        else:
            self.contract = None

    def _map_loan_request(self, req_tuple) -> dict:
        status_map = {0: "REQUESTED", 1: "FUNDED", 2: "ACTIVE", 3: "REPAID", 4: "DEFAULTED"}
        
        purpose_hex = req_tuple[8].hex()
        purpose = "Financial Need"
        if "0000" not in purpose_hex:
            try:
                purpose = bytes.fromhex(purpose_hex.replace("0x", "")).decode("utf-8").strip("\x00")
            except Exception:
                pass
                
        credit_score = req_tuple[7]
        risk_level = self._score_to_risk(credit_score)
        badge = self._score_to_badge(credit_score)
        ai_confidence = self._calculate_ai_confidence(credit_score, risk_level)
                
        return {
            "request_id": str(req_tuple[0]),
            "borrower": req_tuple[1],
            "lender": req_tuple[2] if req_tuple[2] != "0x0000000000000000000000000000000000000000" else None,
            "amount": float(Web3.from_wei(req_tuple[3], 'ether')),
            "interest_rate": float(req_tuple[4]) / 100.0,
            "duration_days": int(req_tuple[5] / 86400),
            "status": status_map.get(req_tuple[6], "REQUESTED"),
            "credit_score": credit_score,
            "risk_level": risk_level,
            "badge": badge,
            "ai_confidence": round(ai_confidence, 1),
            "created_at": datetime.fromtimestamp(req_tuple[9], tz=timezone.utc).isoformat() if req_tuple[9] > 0 else datetime.now(timezone.utc).isoformat(),
            "funded_at": datetime.fromtimestamp(req_tuple[10], tz=timezone.utc).isoformat() if req_tuple[10] > 0 else None,
            "due_date": datetime.fromtimestamp(req_tuple[11], tz=timezone.utc).isoformat() if req_tuple[11] > 0 else None,
        }

    def _send_tx(self, func_call) -> str:
        if not self.private_key:
            raise ValueError("Private key not configured for onchain transactions")
        account = self.w3.eth.account.from_key(self.private_key)
        nonce = self.w3.eth.get_transaction_count(account.address)
        
        tx = func_call.build_transaction({
            "from": account.address,
            "nonce": nonce,
            "gas": 400000,
            "gasPrice": self.w3.eth.gas_price,
            "chainId": 177
        })
        
        signed = account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed.raw_transaction)
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt.transactionHash.hex()

    def create_request(
        self,
        wallet: str,
        amount: float,
        duration_days: int,
        purpose: str,
        interest_rate: Optional[float] = None,
    ) -> dict:
        wallet = wallet.lower()

        # 1. Credit Score: Fetch real credit data
        try:
            features = self.analyzer.analyze(wallet)
            profile = self.engine.calculate(features)
            analysis = self.analyst.analyze(features, profile)
            credit_score = analysis.credit_score
            risk_level = self._score_to_risk(credit_score)
            badge = self._score_to_badge(credit_score)
        except Exception:
            credit_score = 0
            risk_level = "UNKNOWN"
            badge = "UNRATED"

        if credit_score <= 0:
            raise ValueError("Credit score not available. Complete wallet verification first.")

        # 2. Check for active defaults
        if self.contract:
            try:
                req_ids = self.contract.functions.getBorrowerRequests(Web3.to_checksum_address(wallet)).call()
                for rid in req_ids:
                    req_tuple = self.contract.functions.getLoanRequest(rid).call()
                    if req_tuple[6] == 4:
                        raise ValueError("Cannot create request: wallet has an active default.")
            except Exception as e:
                if "active default" in str(e):
                    raise e
        else:
            db = read_json(P2P_DB, {})
            for req in db.values():
                if req.get("borrower") == wallet and req.get("status") == "DEFAULTED":
                    raise ValueError("Cannot create request: wallet has an active default.")

        # 3. Trust Receipts
        receipts_engine = TrustReceiptEngine()
        receipts = receipts_engine.get_wallet_receipts(wallet)
        if not receipts:
            receipts_engine.generate_receipt(wallet, "PASSPORT_CREATED")

        # 4. AI Trust Agent
        trust_agent = CredenceTrustAgent()
        risk_pred = trust_agent.predict_default_risk(wallet)
        rec = trust_agent.recommend_financial_action(wallet)

        if risk_pred.get("riskTrend") == "INCREASING" and risk_pred.get("defaultRisk", 0.0) >= 35.0:
            raise ValueError("AI Risk Agent Block: default risk probability exceeds protocol safety thresholds.")

        if interest_rate is None:
            interest_rate = float(rec.get("interest").replace("%", ""))
            if rec.get("decision") != "APPROVE":
                interest_rate += 2.0

        if self.contract:
            try:
                amount_wei = Web3.to_wei(amount, 'ether')
                interest_bp = int((interest_rate or 5.0) * 100)
                duration_sec = int(duration_days * 86400)
                
                purpose_bytes = purpose.encode("utf-8")[:32].ljust(32, b"\x00")
                purpose_hash = bytes(purpose_bytes)
                
                self._send_tx(
                    self.contract.functions.createLoanRequest(
                        amount_wei,
                        interest_bp,
                        duration_sec,
                        int(credit_score),
                        purpose_hash
                    )
                )
                
                req_ids = self.contract.functions.getBorrowerRequests(Web3.to_checksum_address(wallet)).call()
                new_id = req_ids[-1]
                req_tuple = self.contract.functions.getLoanRequest(new_id).call()
                request = self._map_loan_request(req_tuple)
            except Exception as e:
                print(f"Onchain create request failed: {e}. Falling back to database...")
                self.contract = None
        
        if not self.contract:
            ai_confidence = self._calculate_ai_confidence(credit_score, risk_level)
            request_id = f"p2p_{uuid.uuid4().hex[:12]}"
            request = {
                "request_id": request_id,
                "borrower": wallet,
                "amount": amount,
                "interest_rate": round(interest_rate, 2),
                "duration_days": duration_days,
                "purpose": purpose,
                "credit_score": credit_score,
                "risk_level": risk_level,
                "badge": badge,
                "ai_confidence": round(ai_confidence, 1),
                "status": "REQUESTED",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "lender": None,
                "funded_at": None,
                "due_date": None,
            }
            db = read_json(P2P_DB, {})
            db[request_id] = request
            write_json(P2P_DB, db)

        # Record trust event to the on-chain TrustGraphRegistry
        try:
            from app.services.graph.blockchain_publisher import GraphRegistryPublisher
            publisher = GraphRegistryPublisher()
            publisher.record_event(wallet, "LOAN_CREATED")
        except Exception as e:
            print(f"Warning: failed to record graph event: {e}")

        return request

    def fund_loan(self, request_id: str, lender_wallet: str) -> dict:
        lender_wallet = lender_wallet.lower()
        if self.contract and request_id.isdigit():
            try:
                req_id = int(request_id)
                self._send_tx(self.contract.functions.fundLoan(req_id))
                self._send_tx(self.contract.functions.activateLoan(req_id))
                
                req_tuple = self.contract.functions.getLoanRequest(req_id).call()
                return self._map_loan_request(req_tuple)
            except Exception as e:
                print(f"Onchain fund loan failed: {e}. Falling back to database...")
                self.contract = None

        db = read_json(P2P_DB, {})
        req = db.get(request_id)
        if not req:
            raise ValueError(f"Request {request_id} not found")
        if req["status"] != "REQUESTED":
            raise ValueError(f"Request is not open (status: {req['status']})")
        if req["borrower"] == lender_wallet:
            raise ValueError("Cannot fund your own request")

        req["lender"] = lender_wallet
        req["status"] = "ACTIVE"
        req["funded_at"] = datetime.now(timezone.utc).isoformat()
        due = datetime.now(timezone.utc) + timedelta(days=req["duration_days"])
        req["due_date"] = due.isoformat()

        db[request_id] = req
        write_json(P2P_DB, db)
        return req

    def repay_loan(self, request_id: str, borrower_wallet: str) -> dict:
        borrower_wallet = borrower_wallet.lower()
        if self.contract and request_id.isdigit():
            try:
                req_id = int(request_id)
                self._send_tx(self.contract.functions.repayLoan(req_id))
                
                req_tuple = self.contract.functions.getLoanRequest(req_id).call()
                return self._map_loan_request(req_tuple)
            except Exception as e:
                print(f"Onchain repay loan failed: {e}. Falling back to database...")
                self.contract = None

        db = read_json(P2P_DB, {})
        req = db.get(request_id)
        if not req:
            raise ValueError(f"Request {request_id} not found")
        if req["status"] != "ACTIVE":
            raise ValueError(f"Loan is not active (status: {req['status']})")
        if req["borrower"] != borrower_wallet:
            raise ValueError("Only the borrower can repay")

        req["status"] = "REPAID"
        req["repaid_at"] = datetime.now(timezone.utc).isoformat()

        db[request_id] = req
        write_json(P2P_DB, db)
        return req

    def get_open_requests(self) -> List[dict]:
        if self.contract:
            try:
                ids = self.contract.functions.getOpenRequests().call()
                results = []
                for rid in ids:
                    req_tuple = self.contract.functions.getLoanRequest(rid).call()
                    results.append(self._map_loan_request(req_tuple))
                return results
            except Exception as e:
                print(f"Onchain get open requests failed: {e}. Falling back to database...")
                self.contract = None
                
        db = read_json(P2P_DB, {})
        return [r for r in db.values() if r["status"] == "REQUESTED"]

    def get_all_requests(self) -> List[dict]:
        if self.contract:
            try:
                total = self.contract.functions.totalRequests().call()
                results = []
                for rid in range(total):
                    try:
                        req_tuple = self.contract.functions.getLoanRequest(rid).call()
                        results.append(self._map_loan_request(req_tuple))
                    except Exception:
                        pass
                return results
            except Exception as e:
                print(f"Onchain get all requests failed: {e}. Falling back to database...")
                self.contract = None

        db = read_json(P2P_DB, {})
        return list(db.values())

    def get_request(self, request_id: str) -> Optional[dict]:
        if self.contract and request_id.isdigit():
            try:
                req_tuple = self.contract.functions.getLoanRequest(int(request_id)).call()
                return self._map_loan_request(req_tuple)
            except Exception as e:
                print(f"Onchain get request failed: {e}. Falling back to database...")
                self.contract = None

        db = read_json(P2P_DB, {})
        return db.get(request_id)

    def get_borrower_requests(self, wallet: str) -> List[dict]:
        wallet = wallet.lower()
        if self.contract:
            try:
                ids = self.contract.functions.getBorrowerRequests(Web3.to_checksum_address(wallet)).call()
                results = []
                for rid in ids:
                    req_tuple = self.contract.functions.getLoanRequest(rid).call()
                    results.append(self._map_loan_request(req_tuple))
                return results
            except Exception as e:
                print(f"Onchain get borrower requests failed: {e}. Falling back to database...")
                self.contract = None

        db = read_json(P2P_DB, {})
        return [r for r in db.values() if r["borrower"] == wallet]

    def get_lender_funded(self, wallet: str) -> List[dict]:
        wallet = wallet.lower()
        if self.contract:
            try:
                ids = self.contract.functions.getLenderFundedLoans(Web3.to_checksum_address(wallet)).call()
                results = []
                for rid in ids:
                    req_tuple = self.contract.functions.getLoanRequest(rid).call()
                    results.append(self._map_loan_request(req_tuple))
                return results
            except Exception as e:
                print(f"Onchain get lender funded failed: {e}. Falling back to database...")
                self.contract = None

        db = read_json(P2P_DB, {})
        return [r for r in db.values() if r.get("lender") == wallet]

    def _calculate_ai_confidence(self, score: int, risk: str) -> float:
        base = min(100, max(20, score / 8.5))
        risk_penalty = {"LOW": 0, "MEDIUM": 8, "HIGH": 18, "CRITICAL": 30}
        return max(10, base - risk_penalty.get(risk, 10))

    def _score_to_risk(self, score: int) -> str:
        if score >= 700:
            return "LOW"
        elif score >= 500:
            return "MEDIUM"
        elif score >= 300:
            return "HIGH"
        return "CRITICAL"

    def _score_to_badge(self, score: int) -> str:
        if score >= 750:
            return "PRIME"
        elif score >= 600:
            return "TRUSTED"
        elif score >= 400:
            return "STANDARD"
        elif score >= 200:
            return "WATCHLIST"
        return "HIGH_RISK"
