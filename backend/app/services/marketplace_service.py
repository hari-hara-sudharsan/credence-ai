from app.database.persistence import read_json, write_json


class MarketplaceService:

    @classmethod
    def create_listing(cls, listing):
        listings = read_json("marketplace.json", [])
        listings.append(listing)
        write_json("marketplace.json", listings)
        return listing

    @classmethod
    def get_listings(cls):
        return read_json("marketplace.json", [])

