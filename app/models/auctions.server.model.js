const db = require('../../config/db');

const getBidsByAuctionId = function (id, done) {
    const selectSQL = "SELECT bid_amount, bid_datetime, user_id, user_username FROM bid JOIN " +
        "auction_user ON bid_userid = user_id WHERE bid_auctionid = ? ORDER BY bid_datetime ASC";

    db.get_pool().query(selectSQL, id)
        .then(function (rows) {
            let newRows = [];
            for (let bid of rows) {
                 newRows.push({
                    "amount": bid.bid_amount,
                    "datetime": bid.bid_datetime.getTime(),
                    "buyerId": bid.user_id,
                    "buyerUsername": bid.user_username
                });
            }
            return done(newRows);
        })
        .catch(function (err) {
            console.log(err);
            return done();
        });
};

exports.getFullAuctionInfo = function (id, done) {
    const selectSQL = "SELECT * FROM auction JOIN auction_user ON auction_userid = user_id " +
        "JOIN category ON auction_categoryid = category_id WHERE auction_id = ?";

    db.get_pool().query(selectSQL, id)
        .then(function (rows) {
            if (rows.length === 0) {
                return done();
            }
            return rows[0];
        })
        .then(function (auction) {
            if (typeof auction !== "undefined") {
                getBidsByAuctionId(id, function (bids) {
                    let auctionData = {
                        "categoryId": auction.category_id,
                        "categoryTitle": auction.category_title,
                        "title": auction.auction_title,
                        "reservePrice": auction.auction_reserveprice,
                        "startDateTime": auction.auction_startingdate.getTime(),
                        "endDateTime": auction.auction_endingdate.getTime(),
                        "description": auction.auction_description,
                        "creationDateTime": auction.auction_creationdate.getTime(),
                        "seller": {
                            "id": auction.user_id,
                            "username": auction.user_username
                        },
                        "startingBid": auction.auction_startingprice
                    };
                    let currentBid = 0;
                    for (let bid of bids) {
                        if (bid.amount > currentBid) {
                            currentBid = bid.amount;
                        }
                    }
                    auctionData.currentBid = currentBid;
                    auctionData.bids = bids;

                    return done(auctionData);
                });
            } else {
                return done();
            }
        })
        .catch(function (err) {
            console.log(err);
            return done();
        });
};
