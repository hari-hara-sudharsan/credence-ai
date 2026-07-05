import os

from web3 import Web3

from dotenv import load_dotenv

# pyrefly: ignore [missing-import]
from app.contracts.credit_registry_abi import (
    CREDIT_REGISTRY_ABI
)

load_dotenv()


class BlockchainPublisher:

    def __init__(self):

        self.w3 = Web3(
            Web3.HTTPProvider(
                os.getenv("HSK_RPC")
            )
        )

        self.account = self.w3.eth.account.from_key(
            os.getenv("PRIVATE_KEY")
        )

        self.contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(
                os.getenv("CREDIT_REGISTRY")
            ),
            abi=CREDIT_REGISTRY_ABI
        )

    def publish_score(

        self,

        wallet,

        score,

        rating,

        confidence

    ):
        checksum_wallet = Web3.to_checksum_address(wallet)
        nonce = self.w3.eth.get_transaction_count(
            self.account.address
        )

        tx = (
            self.contract.functions
            .updateCreditProfile(
                checksum_wallet,
                score,
                rating,
                confidence
            )
            .build_transaction(
                {
                    "from":
                    self.account.address,

                    "nonce":
                    nonce,

                    "gas":
                    300000,

                    "gasPrice":
                    self.w3.eth.gas_price,

                    "chainId":
                    177
                }
            )
        )

        signed = (
            self.account
            .sign_transaction(tx)
        )

        tx_hash = (
            self.w3.eth
            .send_raw_transaction(
                signed.raw_transaction
            )
        )

        receipt = (
            self.w3.eth
            .wait_for_transaction_receipt(
                tx_hash
            )
        )

        return receipt.transactionHash.hex()