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
        Date.now(),
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

};

exports.viewBids = function (req, res) {

};

exports.makeBid = function (req, res) {

};
