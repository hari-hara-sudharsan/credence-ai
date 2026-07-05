import os
from web3 import Web3
from dotenv import load_dotenv
from app.contracts.loan_manager import LOAN_MANAGER_ABI

load_dotenv()

class RepaymentClient:
    def __init__(self):
        hsk_rpc = os.getenv('HSK_RPC')
        if not hsk_rpc:
            raise ValueError('HSK_RPC environment variable is required')
        from app.contracts.web3_provider import create_web3_with_retry
        self.w3 = create_web3_with_retry(hsk_rpc)
        
        private_key = os.getenv('PRIVATE_KEY')
        if not private_key:
            raise ValueError('PRIVATE_KEY environment variable is required')
        self.account = self.w3.eth.account.from_key(private_key)
        
        contract_address = os.getenv('LOAN_MANAGER_ADDRESS') or os.getenv('LOAN_MANAGER')
        if not contract_address:
            raise ValueError('LOAN_MANAGER_ADDRESS or LOAN_MANAGER environment variable is required')
        self.contract_address = Web3.to_checksum_address(contract_address)
        
        self.contract = self.w3.eth.contract(
            address=self.contract_address,
            abi=LOAN_MANAGER_ABI
        )

    def repay_loan(self, loan_id: str) -> str:
        """
        Builds, signs, and broadcasts a repayLoan transaction for a loan on-chain.
        Returns the transaction hash.
        """
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        
        # Build transaction call
        tx_func = self.contract.functions.repayLoan(loan_id)
        
        try:
            gas_estimate = tx_func.estimate_gas({'from': self.account.address})
            gas_limit = int(gas_estimate * 1.2)
        except Exception:
            gas_limit = 350000
            
        tx = tx_func.build_transaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': gas_limit,
            'gasPrice': self.w3.eth.gas_price,
            'chainId': 177
        })
        
        signed = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed.raw_transaction)
        
        # Wait for block confirmation
        self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return tx_hash.hex()
