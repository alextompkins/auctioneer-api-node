## Assumptions based on questions to lecturers: ##

Q. What timezone are the timestamps in the load_data.sql script in?
All given timestamps in the resample script are in the local timezone (Auckland/NZ).

Q. Are empty strings acceptable for username/password/title/etc?
No.

Q. When should you be able to PATCH an auction? after start, after end, after bids have been made?
No PATCHing allowed after startDateTime.

Q. Can you change/delete the photo after an auction has started?
No.

Q. Will there be some malformed JSON requests?
Yes.

Q. What error code should duplicate key errors from SQL incur?
400 (Austen) or 500 (Ash). Who do you love more?

## Additional Assumptions ##

* Users should not be able to bid on their own auctions.
* Users should not be able to bid on an auction that has already ended.
* A new bid must be higher than the highest bid already existing on an auction.
* GET /auctions and GET /auctions/:id should have currentBid as 0 when no bids exist yet
* Adding a photo to an auction that already has one will overwrite the old one (and return a 201 response).
* When there's no photo for an auction, GET returns a default photo.
* /users/:id PATCH should throw 401 if anyone other than that user tries to PATCH a user.
* Don't worry about any extra invalid fields in a JSON request.
