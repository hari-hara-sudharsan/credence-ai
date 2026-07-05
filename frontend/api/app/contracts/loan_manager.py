import os
import json
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

LOAN_MANAGER_ABI = [
    {'anonymous': False, 'inputs': [{'indexed': False, 'internalType': 'string', 'name': 'loanId', 'type': 'string'}, {'indexed': False, 'internalType': 'uint256', 'name': 'dueDate', 'type': 'uint256'}], 'name': 'LoanActivated', 'type': 'event'},
    {'anonymous': False, 'inputs': [{'indexed': False, 'internalType': 'string', 'name': 'loanId', 'type': 'string'}], 'name': 'LoanCancelled', 'type': 'event'},
    {'anonymous': False, 'inputs': [{'indexed': False, 'internalType': 'string', 'name': 'loanId', 'type': 'string'}, {'indexed': True, 'internalType': 'address', 'name': 'borrower', 'type': 'address'}, {'indexed': False, 'internalType': 'uint256', 'name': 'approvedAmount', 'type': 'uint256'}], 'name': 'LoanCreated', 'type': 'event'},
    {'anonymous': False, 'inputs': [{'indexed': False, 'internalType': 'string', 'name': 'loanId', 'type': 'string'}], 'name': 'LoanRepaid', 'type': 'event'},
    {
        "anonymous": False,
        "inputs": [
            {"indexed": False, "internalType": "string", "name": "loanId", "type": "string"},
            {"indexed": False, "internalType": "address", "name": "borrower", "type": "address"},
            {"indexed": False, "internalType": "uint256", "name": "amount", "type": "uint256"},
            {"indexed": False, "internalType": "bytes32", "name": "settlementReference", "type": "bytes32"}
        ],
        "name": "LoanSettled",
        "type": "event"
    },
    {'inputs': [], 'name': 'MAX_COLLATERAL_RATIO', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'},
    {'inputs': [], 'name': 'MAX_DURATION', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'},
    {'inputs': [], 'name': 'MIN_COLLATERAL_RATIO', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'},
    {'inputs': [{'internalType': 'string', 'name': 'loanId', 'type': 'string'}], 'name': 'activateLoan', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'},
    {'inputs': [{'internalType': 'address', 'name': '', 'type': 'address'}, {'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'name': 'borrowerLoans', 'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}], 'stateMutability': 'view', 'type': 'function'},
    {'inputs': [{'internalType': 'string', 'name': 'loanId', 'type': 'string'}], 'name': 'cancelLoan', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'},
    {'inputs': [{'internalType': 'string', 'name': 'loanId', 'type': 'string'}, {'internalType': 'address', 'name': 'borrower', 'type': 'address'}, {'internalType': 'uint256', 'name': 'approvedAmount', 'type': 'uint256'}, {'internalType': 'uint256', 'name': 'interestRate', 'type': 'uint256'}, {'internalType': 'uint256', 'name': 'collateralRatio', 'type': 'uint256'}, {'internalType': 'uint256', 'name': 'duration', 'type': 'uint256'}, {'internalType': 'bytes32', 'name': 'offerHash', 'type': 'bytes32'}, {'internalType': 'string', 'name': 'offerId', 'type': 'string'}], 'name': 'createLoan', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'},
    {'inputs': [{'internalType': 'address', 'name': 'borrower', 'type': 'address'}], 'name': 'getBorrowerLoans', 'outputs': [{'internalType': 'string[]', 'name': '', 'type': 'string[]'}], 'stateMutability': 'view', 'type': 'function'},
    {'inputs': [{'internalType': 'string', 'name': 'loanId', 'type': 'string'}], 'name': 'getLoan', 'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}, {'internalType': 'address', 'name': '', 'type': 'address'}, {'internalType': 'uint256', 'name': '', 'type': 'uint256'}, {'internalType': 'uint256', 'name': '', 'type': 'uint256'}, {'internalType': 'uint256', 'name': '', 'type': 'uint256'}, {'internalType': 'uint256', 'name': '', 'type': 'uint256'}, {'internalType': 'uint256', 'name': '', 'type': 'uint256'}, {'internalType': 'uint256', 'name': '', 'type': 'uint256'}, {'internalType': 'enum LoanManager.LoanStatus', 'name': '', 'type': 'uint8'}, {'internalType': 'bytes32', 'name': '', 'type': 'bytes32'}, {'internalType': 'string', 'name': '', 'type': 'string'}], 'stateMutability': 'view', 'type': 'function'},
    {'inputs': [{'internalType': 'string', 'name': '', 'type': 'string'}], 'name': 'loans', 'outputs': [{'internalType': 'string', 'name': 'loanId', 'type': 'string'}, {'internalType': 'address', 'name': 'borrower', 'type': 'address'}, {'internalType': 'uint256', 'name': 'approvedAmount', 'type': 'uint256'}, {'internalType': 'uint256', 'name': 'interestRate', 'type': 'uint256'}, {'internalType': 'uint256', 'name': 'collateralRatio', 'type': 'uint256'}, {'internalType': 'uint256', 'name': 'duration', 'type': 'uint256'}, {'internalType': 'uint256', 'name': 'creationTime', 'type': 'uint256'}, {'internalType': 'uint256', 'name': 'dueDate', 'type': 'uint256'}, {'internalType': 'enum LoanManager.LoanStatus', 'name': 'status', 'type': 'uint8'}, {'internalType': 'bytes32', 'name': 'offerHash', 'type': 'bytes32'}, {'internalType': 'string', 'name': 'offerId', 'type': 'string'}], 'stateMutability': 'view', 'type': 'function'},
    {'inputs': [{'internalType': 'string', 'name': 'loanId', 'type': 'string'}], 'name': 'repayLoan', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'},
    {
        "inputs": [
            {"internalType": "string", "name": "loanId", "type": "string"},
            {"internalType": "bytes32", "name": "settlementReference", "type": "bytes32"}
        ],
        "name": "markSettled",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "loanId", "type": "string"}
        ],
        "name": "getSettlementStatus",
        "outputs": [
            {"internalType": "uint8", "name": "", "type": "uint8"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

class LoanManagerClient:
    def __init__(self):
        hsk_rpc = os.getenv('HSK_RPC')
        if not hsk_rpc:
            raise ValueError('HSK_RPC environment variable is required')
        
        from app.contracts.web3_provider import create_web3_with_retry
        self.w3 = create_web3_with_retry(hsk_rpc)
        
        private_key = os.getenv('PRIVATE_KEY')
        if not private_key:
            raise ValueError('PRIVATE_KEY environment variable is required')
            
        key = private_key
        if not key.startswith("0x"):
            key = "0x" + key
            
        self.account = self.w3.eth.account.from_key(key)
        
        contract_address = os.getenv('LOAN_MANAGER_ADDRESS') or os.getenv('LOAN_MANAGER')
        if not contract_address:
            raise ValueError('LOAN_MANAGER_ADDRESS or LOAN_MANAGER environment variable is required')
        self.contract_address = Web3.to_checksum_address(contract_address)
        
        self.contract = self.w3.eth.contract(
            address=self.contract_address,
            abi=LOAN_MANAGER_ABI
        )

    def create_loan(
        self,
        borrower: str,
        amount: float,
        interest: float,
        collateral_ratio: float,
        duration: int,
        offer_id: str,
        offer_hash: str
    ) -> str:
        checksum_borrower = Web3.to_checksum_address(borrower)
        amount_wei = int(amount * (10 ** 18))
        interest_uint = int(interest)
        collateral_ratio_uint = int(collateral_ratio)
        duration_seconds = int(duration) * 24 * 60 * 60
        
        if isinstance(offer_hash, str):
            if offer_hash.startswith('0x'):
                offer_hash_bytes = Web3.to_bytes(hexstr=offer_hash)
            else:
                offer_hash_bytes = Web3.to_bytes(hexstr='0x' + offer_hash)
        else:
            offer_hash_bytes = offer_hash

        nonce = self.w3.eth.get_transaction_count(self.account.address)
        
        tx_func = self.contract.functions.createLoan(
            offer_id,
            checksum_borrower,
            amount_wei,
            interest_uint,
            collateral_ratio_uint,
            duration_seconds,
            offer_hash_bytes,
            offer_id
        )
        
        try:
            gas_estimate = tx_func.estimate_gas({'from': self.account.address})
            gas_limit = int(gas_estimate * 1.2)
        except Exception:
            gas_limit = 600000
            
        tx = tx_func.build_transaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': gas_limit,
            'gasPrice': self.w3.eth.gas_price,
            'chainId': 177
        })
        
        signed = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed.raw_transaction)
        
        self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return "0x" + tx_hash.hex().removeprefix("0x")

    def mark_settled(self, loan_id: str, settlement_reference: str) -> str:
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        
        # Convert settlement reference to bytes32, properly padded
        if isinstance(settlement_reference, str):
            hex_str = settlement_reference
            if hex_str.startswith("0x"):
                hex_str = hex_str[2:]
            # Pad to 64 hex chars (32 bytes) if needed
            hex_str = hex_str.ljust(64, '0')[:64]
            ref_bytes = bytes.fromhex(hex_str)
        else:
            ref_bytes = settlement_reference

        tx_func = self.contract.functions.markSettled(
            loan_id,
            ref_bytes
        )
        
        try:
            gas_estimate = tx_func.estimate_gas({'from': self.account.address})
            gas_limit = int(gas_estimate * 1.2)
        except Exception:
            gas_limit = 600000
            
        tx = tx_func.build_transaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': gas_limit,
            'gasPrice': self.w3.eth.gas_price,
            'chainId': 177
        })
        
        signed = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed.raw_transaction)
        self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return "0x" + tx_hash.hex().removeprefix("0x")

    def get_settlement_status(self, loan_id: str) -> int:
        return self.contract.functions.getSettlementStatus(loan_id).call()
