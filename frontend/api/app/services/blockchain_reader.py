from web3 import Web3

class BlockchainReader:

    def __init__(self):

        self.rpc = Web3(
            Web3.HTTPProvider(
                "https://mainnet.hsk.xyz"
            )
        )

    def is_connected(self):

        return self.rpc.is_connected()