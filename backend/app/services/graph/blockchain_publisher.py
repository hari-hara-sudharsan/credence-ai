import os
import time
from web3 import Web3

class GraphRegistryPublisher:
    def __init__(self):
        self.rpc = os.getenv("HSK_RPC", "http://127.0.0.1:8545")
        self.w3 = Web3(Web3.HTTPProvider(self.rpc))
        self.private_key = os.getenv("PRIVATE_KEY")
        
        self.abi = [
            {
                "inputs": [
                    {"internalType": "bytes32", "name": "eventHash", "type": "bytes32"},
                    {"internalType": "address", "name": "entity", "type": "address"},
                    {"internalType": "string", "name": "eventType", "type": "string"}
                ],
                "name": "recordTrustEvent",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
        
        self.contract_address = os.getenv("TRUST_GRAPH_REGISTRY")
        if self.contract_address:
            self.contract = self.w3.eth.contract(
                address=Web3.to_checksum_address(self.contract_address),
                abi=self.abi
            )
        else:
            self.contract = None

    def record_event(self, wallet: str, event_type: str) -> str:
        """
        Submits a transaction to record a trust event on-chain to TrustGraphRegistry.
        """
        if not self.contract or not self.private_key:
            return "0x" + "0" * 64
            
        try:
            wallet_checksum = Web3.to_checksum_address(wallet)
            account = self.w3.eth.account.from_key(self.private_key)
            
            event_hash = Web3.keccak(text=f"{wallet_checksum}:{event_type}:{time.time()}")
            
            nonce = self.w3.eth.get_transaction_count(account.address)
            tx = self.contract.functions.recordTrustEvent(
                event_hash,
                wallet_checksum,
                event_type
            ).build_transaction({
                "from": account.address,
                "nonce": nonce,
                "gas": 200000,
                "gasPrice": self.w3.eth.gas_price,
                "chainId": 177
            })
            
            signed = account.sign_transaction(tx)
            tx_hash = self.w3.eth.send_raw_transaction(signed.raw_transaction)
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            return receipt.transactionHash.hex()
        except Exception as e:
            print(f"Warning: failed to record onchain graph event: {e}")
            return "0x" + "0" * 64
