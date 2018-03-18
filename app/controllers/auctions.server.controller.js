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

};

exports.edit = function (req, res) {

};

exports.viewBids = function (req, res) {

};

exports.makeBid = function (req, res) {

};
