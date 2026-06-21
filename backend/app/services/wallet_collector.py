from app.models.raw_wallet import RawWallet

class WalletCollector:

    def collect(self, wallet: str):

        return RawWallet(
            wallet=wallet,
            balance=100.0,
            tx_count=250,
            first_seen_block=1000
        )