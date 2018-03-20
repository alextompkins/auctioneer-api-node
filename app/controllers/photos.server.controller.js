const Photos = require('../models/photos.server.model');
const Auctions = require('../models/auctions.server.model');

exports.view = function (req, res) {
    let auctionId = req.params.id;

    Photos.getPhotoByAuctionId(auctionId, function (result) {
        if (typeof result !== "undefined") {
            res.statusMessage = "OK";
            res.status(200)
                .send(result);
        } else {
            res.statusMessage = "Not found";
            res.status(404)
                .send();
        }
    });
};

exports.add = function (req, res) {
    let userId = parseInt(req.authorisedUserId);
    let auctionId = req.params.id;
    let image = req.rawBody;

    Auctions.getFullAuctionInfo(auctionId, function (auction) {
        if (typeof auction === "undefined") {
            res.statusMessage = "Not found";
            res.status(404)
                .send();
        } else if (auction.seller.id !== userId) {
            res.statusMessage = "Unauthorized.";
            res.status(401)
                .send();
        } else {
            Photos.addPhotoByAuctionId(auctionId, image, function (result) {
                if (result === true) {
                    res.statusMessage = "OK";
                    res.status(201)
                        .send();
                } else if (result === false) {
                    res.statusMessage = "Internal server error.";
                    res.status(500)
                        .send();
                }
            });
        }
    });
};

exports.remove = function (req, res) {
    let userId = parseInt(req.authorisedUserId);
    let auctionId = req.params.id;

    Auctions.getFullAuctionInfo(auctionId, function (auction) {
        if (typeof auction === "undefined") {
            res.statusMessage = "Not found";
            res.status(404)
                .send();
        } else if (auction.seller.id !== userId) {
            res.statusMessage = "Unauthorized.";
            res.status(401)
                .send();
        } else {
            Photos.deletePhotoByAuctionId(auctionId, function (result) {
                if (result === true) {
                    res.statusMessage = "OK";
                    res.status(201)
                        .send();
                } else if (result === false) {
                    res.statusMessage = "Not found";
                    res.status(404)
                        .send();
                }
            });
        }
    });
};
