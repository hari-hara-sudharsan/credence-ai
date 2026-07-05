class PassportNFTService:

    def mint(
        self,
        wallet,
        score,
        rating
    ):

        return {
            "wallet":
            wallet,

            "score":
            score,

            "rating":
            rating,

            "status":
            "NFT_MINTED"
        }
