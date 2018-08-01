const db = require('../../config/db');

exports.getBidsByAuctionId = function (id, done) {
    const selectSQL = "SELECT bid_amount, bid_datetime, user_id, user_username FROM bid JOIN " +
        "auction_user ON bid_userid = user_id WHERE bid_auctionid = ? ORDER BY bid_datetime DESC";

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
            console.log("An error occurred when executing: \n" + err.sql + "\nERROR: " + err.sqlMessage + "\n");
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
                module.exports.getBidsByAuctionId(id, function (bids) {
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
                    if (typeof bids !== "undefined") {
                        for (let bid of bids) {
                            if (bid.amount > currentBid) {
                                currentBid = bid.amount;
                            }
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
            console.log("An error occurred when executing: \n" + err.sql + "\nERROR: " + err.sqlMessage + "\n");
            return done();
        });
};

function buildSearchSQL(params) {
    let searchSQL =
        "\nSELECT  " +
        "\n  auction_id AS id, " +
        "\n  category_title AS categoryTitle, " +
        "\n  auction_categoryid AS categoryId, " +
        "\n  auction_title as title, " +
        "\n  auction_reserveprice AS reservePrice, " +
        "\n  auction_startingdate AS startDateTime, " +
        "\n  auction_endingdate AS endDateTime, " +
        "\n  MAX(bid_amount) AS currentBid " +
        "\nFROM " +
        "\n  (((auction " +
        "\n  JOIN category ON ((category_id = auction_categoryid))) " +
        "\n  JOIN auction_user seller ON ((auction_userid = seller.user_id))) " +
        "\n  LEFT JOIN bid ON ((auction_id = bid_auctionid))) " +
        "\nWHERE ";

    let conditions = [];
    let values = [];

    if (typeof params.q !== "undefined") {
        conditions.push("\nauction_title LIKE ?");
        values.push("%" + params.q + "%");
    }

    if (typeof params["category-id"] !== "undefined") {
        conditions.push("\nauction_categoryid = ?");
        values.push(parseInt(params["category-id"]));
    }

    if (typeof params.seller !== "undefined") {
        conditions.push("\nseller.user_id = ?");
        values.push(parseInt(params.seller));
    }

    if (typeof params.bidder !== "undefined") {
        conditions.push("\n? IN (SELECT bid_userid FROM bid WHERE bid_auctionid = auction_id)");
        values.push(parseInt(params.bidder));
    }

    if (typeof params.winner !== "undefined") {
        conditions.push("\n? IN (" +
            "\nSELECT bid_userid FROM bid" +
            "\nWHERE bid_auctionid = auction_id" +
            "\nAND bid_amount IN" +
            "\n  (" +
            "\n  SELECT MAX(bid_amount)" +
            "\n  FROM bid" +
            "\n  WHERE bid_auctionid = auction_id" +
            "\n  AND CURRENT_TIMESTAMP > auction_endingdate" +
            "\n  )" +
            "\n)");
        values.push(parseInt(params.winner));
    }

    switch (params.status) {
        case "upcoming":
            conditions.push("\nauction_startingdate > CURRENT_TIMESTAMP()");
            break;
        case "active":
            conditions.push("\nauction_startingdate <= CURRENT_TIMESTAMP() " +
                "\nAND auction_endingdate > CURRENT_TIMESTAMP()");
            break;
        case "expired":
            conditions.push("\nauction_endingdate <= CURRENT_TIMESTAMP() " +
                "\nAND (bid_amount < auction_reserveprice OR bid_amount IS NULL)");
            break;
        case "won":
            conditions.push("\nauction_endingdate <= CURRENT_TIMESTAMP() " +
                "\nAND bid_amount >= auction_reserveprice");
            break;
    }

    searchSQL += (conditions.length ? conditions.join(" AND ") : 1);
    searchSQL += "\nGROUP BY auction_id \nORDER BY auction_startingdate DESC";

    if (typeof params.count !== "undefined") {
        searchSQL += "\nLIMIT ? ";
        values.push(parseInt(params.count));
    }

    if (typeof params.startIndex !== "undefined") {
        if (typeof params.count === "undefined") {
            searchSQL += "\nLIMIT ? ";
            values.push(1000000000);
        }
        searchSQL += "\nOFFSET ? ";
        values.push(parseInt(params.startIndex));
    }

    return {
        searchSQL: searchSQL,
        values: values
    };
}

exports.getAllAuctionInfo = function (params, done) {
    let search = buildSearchSQL(params);

    db.get_pool().query(search.searchSQL, search.values)
        .then(function (rows) {
            for (let row of rows) {
                row.startDateTime = row.startDateTime.getTime();
                row.endDateTime = row.endDateTime.getTime();
                if (typeof row.currentBid !== "undefined" && row.currentBid === null) {
                    row.currentBid = 0;
                }
            }
            return done(rows);
        })
        .catch(function (err) {
            console.log("An error occurred when executing: \n" + err.sql + "\nERROR: " + err.sqlMessage + "\n");
            return done();
        });
};

exports.create = function (values, done) {
    const createSQL = "INSERT INTO auction (auction_title, auction_categoryid, auction_description, " +
        "auction_creationdate, auction_startingdate, auction_endingdate, auction_reserveprice, " +
        "auction_startingprice, auction_userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    db.get_pool().query(createSQL, values)
        .then(function (result) {
            return done(result.insertId);
        })
        .catch(function (err) {
            console.log("An error occurred when executing: \n" + err.sql + "\nERROR: " + err.sqlMessage + "\n");
            return done();
        });
};

function buildUpdateAuctionSQL(id, params) {
    const PROPERTIES = [
        "auction_categoryid", "auction_title", "auction_description", "auction_startingdate",
        "auction_endingdate", "auction_reserveprice", "auction_startingprice"
    ];

    let changes = [];
    for (let property of PROPERTIES) {
        if (typeof params[property] !== "undefined") {
            changes.push(property + " = '" + params[property] + "'");
            delete params[property];
        }
    }

    if (changes.length === 0) {
        return "";
    } else {
        return "UPDATE auction SET " + changes.join(', ') + " WHERE auction_id = " + id;
    }
}

exports.change = function (id, changes, done) {
    let updateSQL = buildUpdateAuctionSQL(id, changes);
    if (updateSQL === "") {
        return done(false);
    }

    db.get_pool().query(updateSQL)
        .then(function () {
            return done(true);
        })
        .catch(function (err) {
            console.log("An error occurred when executing: \n" + err.sql + "\nERROR: " + err.sqlMessage + "\n");
            return done();
        });
};

exports.createBidOnAuction = function (values, done) {
    let createSQL = "INSERT INTO bid (bid_userid, bid_auctionid, bid_amount, bid_datetime) " +
        "VALUES (?, ?, ?, ?)";

    db.get_pool().query(createSQL, values)
        .then(function (result) {
            return done(true);
        })
        .catch(function (err) {
            console.log("An error occurred when executing: \n" + err.sql + "\nERROR: " + err.sqlMessage + "\n");
            return done();
        });
};

exports.getAllCategories = function (done) {
    db.get_pool().query("SELECT category_id AS categoryId, category_title AS categoryTitle, " +
        "category_description AS categoryDescription FROM category")
        .then(function (result) {
            return done(result);
        })
        .catch(function (err) {
            console.log("An error occurred when executing: \n" + err.sql + "\nERROR: " + err.sqlMessage + "\n");
            return done();
        });
};
