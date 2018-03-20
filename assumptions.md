It is acceptable to set the database to store all timestamps as UTC timestamps
    (all given timestamps in the resample script are in UTC not NZT)
Users should not be able to bid on their own auctions.
Users should not be able to bid on an auction that has already ended.
A new bid must be higher than the highest bid already existing on an auction.
JSON format for GET /auctions has currentBid set to null if there are no bids on the auction yet
Adding a photo to an auction that already has one will overwrite the old one (and return a 201 response).