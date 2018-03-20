const Photos = require('../models/photos.server.model');

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
    let auctionId = req.params.id;
    let image = req.rawBody;

    Photos.addPhotoByAuctionId(auctionId, image, function (result) {
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
};

exports.remove = function (req, res) {
    let auctionId = req.params.id;

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
};
