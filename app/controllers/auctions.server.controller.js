const Auctions = require('../models/auctions.server.model');

exports.viewAll = function (req, res) {
    Auctions.getAllAuctionInfo(req.query, function (results) {
        if (typeof results !== "undefined") {
            res.statusMessage = "OK";
            res.status(200)
                .json(results);
        } else {
            res.statusMessage = "Bad request.";
            res.status(400)
                .send();
        }
    });
};

exports.view = function (req, res) {
    let id = req.params.id;

    Auctions.getFullAuctionInfo(id, function (result) {
        if (typeof result !== "undefined") {
            res.statusMessage = "OK";
            res.status(200)
                .json(result);
        } else {
            res.statusMessage = "Not found";
            res.status(404)
                .send();
        }
    });
};

exports.create = function (req, res) {
    let values = [
        req.body.title,
        req.body.categoryId,
        req.body.description,
        new Date(),
        new Date(req.body.startDateTime),
        new Date(req.body.endDateTime),
        req.body.reservePrice,
        req.body.startingBid,
        req.authorisedUserId
    ];

    Auctions.create(values, function (result) {
        if (typeof result !== "undefined") {
            let json = {
                "id": result
            };

            res.statusMessage = "OK";
            res.status(201)
                .json(json);
        } else {
            res.statusMessage = "Bad request.";
            res.status(400)
                .send();
        }
    });
};

exports.edit = function (req, res) {
    let id = req.params.id;

    let changes = {
        "auction_categoryid": req.body.categoryId,
        "auction_title": req.body.title,
        "auction_description": req.body.description,
        "auction_startingdate": typeof req.body.startDateTime !== "undefined" ?
            new Date(req.body.startDateTime) : undefined,
        "auction_endingdate": typeof req.body.endDateTime !== "undefined" ?
            new Date(req.body.endDateTime) : undefined,
        "auction_reserveprice": req.body.reservePrice,
        "auction_startingprice": req.body.startingBid
    };

    Auctions.getFullAuctionInfo(id, function (auction) {
        if (typeof auction === "undefined") {
            res.statusMessage = "Not found.";
            res.status(404)
                .send();
        } else if (auction.seller.id !== parseInt(req.authorisedUserId)) {
            res.statusMessage = "Unauthorized.";
            res.status(401)
                .send();
        } else if (new Date() > auction.startDateTime) {
            res.statusMessage = "Forbidden - bidding has begun on the auction.";
            res.status(403)
                .send();
        } else {
            Auctions.change(id, changes, function (result) {
                if (result === true) {
                    res.statusMessage = "OK";
                    res.status(201)
                        .send();
                } else if (result === false) {
                    res.statusMessage = "Bad request.";
                    res.status(400)
                        .send();
                } else {
                    res.statusMessage = "Internal server error";
                    res.status(500)
                        .send();
                }
            });
        }
    });
};

exports.viewBids = function (req, res) {
    let bidId = req.params.id;

    Auctions.getBidsByAuctionId(bidId, function (results) {
        if (typeof results !== "undefined") {
            res.statusMessage = "OK";
            res.status(200)
                .json(results);
        } else {
            res.statusMessage = "Not found";
            res.status(404)
                .send();
        }
    });
};

exports.makeBid = function (req, res) {
    let userId = req.authorisedUserId;
    let auctionId = req.params.id;
    let amount = req.query.amount;
    let bidDateTime = new Date();

    Auctions.getFullAuctionInfo(auctionId, function (auction) {
        if (typeof auction === "undefined") {
            res.statusMessage = "Not found";
            res.status(404)
                .send();
        } else if (auction.seller.id === parseInt(req.authorisedUserId)) {
            res.statusMessage = "Bad request - you cannot bid on your own auction.";
            res.status(400)
                .send();
        } else if (new Date() >= auction.endDateTime) {
            res.statusMessage = "Bad request - the auction has ended.";
            res.status(400)
                .send();
        } else if (amount <= auction.currentBid) {
            res.statusMessage = "Bad request - you cannot make a bid that is not higher than the current bid.";
            res.status(400)
                .send();
        } else if (amount < auction.startingBid) {
            res.statusMessage = "Bad request - you cannot make a bid that is lower than the starting bid.";
            res.status(400)
                .send();
        } else {
            let values = [
                userId,
                auctionId,
                amount,
                bidDateTime
            ];

            Auctions.createBidOnAuction(values, function (result) {
                if (result === true) {
                    res.statusMessage = "OK";
                    res.status(201)
                        .send();
                } else if (result === false) {
                    res.statusMessage = "Bad request.";
                    res.status(400)
                        .send();
                } else {
                    res.statusMessage = "Internal server error";
                    res.status(500)
                        .send();
                }
            });
        }
    });
};
