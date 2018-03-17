const Auctions = require('../models/auctions.server.model');

exports.viewAll = function (req, res) {

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
