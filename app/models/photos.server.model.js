const db = require('../../config/db');
const fs = require("mz/fs");

function getPhotoInfoByAuctionId(auctionId, done) {
    const selectSQL = "SELECT * FROM photo WHERE photo_auctionid = ?";

    db.get_pool().query(selectSQL, auctionId)
        .then(function (rows) {
            if (rows.length === 0) {
                return done();
            } else {
                return done(rows[0]);
            }
        })
        .catch(function (err) {
            console.log(err);
            return done();
        });
}

exports.getPhotoByAuctionId = function (auctionId, done) {
    getPhotoInfoByAuctionId(auctionId, function (photoInfo) {
        if (typeof photoInfo === "undefined") {
            photoInfo = {"photo_image_URI": "./storage/photos/default.png"};
        }
        fs.readFile(photoInfo.photo_image_URI)
            .then(function (image) {
                return done(image);
            })
            .catch(function (err) {
                console.log(err);
                return done();
            });
    });
};

exports.addPhotoByAuctionId = function (auctionId, image, done) {
    const insertSQL = "INSERT INTO photo (photo_auctionid, photo_image_URI) VALUES (?, ?)";
    let path = "./storage/photos/auction_" + auctionId + ".png";

    fs.writeFile(path, image)
        .then(function () {
            return db.get_pool().query(insertSQL, [auctionId, path]);
        })
        .then(function () {
            return done(true);
        })
        .catch(function (err) {
            console.log(err);
            return done(false);
        });
};

exports.deletePhotoByAuctionId = function (auctionId, done) {
    const deleteSQL = "DELETE FROM photo WHERE photo_auctionid = ?";

    getPhotoInfoByAuctionId(auctionId, function (photoInfo) {
        if (typeof photoInfo !== "undefined") {
            db.get_pool().query(deleteSQL, auctionId)
                .then(function () {
                    return fs.unlink(photoInfo.photo_image_URI);
                })
                .then(function () {
                    return done(true);
                })
                .catch(function (err) {
                    console.log(err);
                    return done(false);
                });
        } else {
            return done(false);
        }
    });
};
