What timezone are the timestamps in the load_data.sql script in?
- all given timestamps in the resample script are in NZT

Users should not be able to bid on their own auctions.
- true

Users should not be able to bid on an auction that has already ended.
- true

A new bid must be higher than the highest bid already existing on an auction.
- true

GET /auctions should have currentBid set to 0, not null when no bids exist yet

Adding a photo to an auction that already has one will overwrite the old one (and return a 201 response).
- true

Are empty strings acceptable for username/password/title or whatever
- no

When should you be able to PATCH an auction? (definitive) after start, after end, after bids have been made?
- no PATCH after startDateTime

Can you change/delete the photo after an auction has started?
- no

when there's no photo for an auction, it return a default photo




Will there be some malformed JSON requests?
- yes

could he put tested conditions into api eg. for auction patch, startDateTime < endDateTime i.e. DOMAINS for inputs

What error code should duplicate key errors from sql incur
- 400 (Austen) or 500 (Ash)? who do you love more

User PATCH
- should throw 401 if anyone other than that user tries to PATCH a user

Don't worry about extra invalid fields in a JSON request

should check startDateTime < endDateTime