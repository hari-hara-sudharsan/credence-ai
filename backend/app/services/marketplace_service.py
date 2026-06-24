class MarketplaceService:
    listings = []

    @classmethod
    def create_listing(cls, listing):
        cls.listings.append(listing)
        return listing

    @classmethod
    def get_listings(cls):
        return cls.listings
