const db = require('../../config/db');

const findUserByToken = function (token, done) {
    const findSQL = "SELECT * FROM auction_user WHERE user_token = ?";

    db.get_pool().query(findSQL, token)
        .then(function (rows) {
            return done(rows[0]);
        })
        .catch(function (err) {
            console.log(err);
            return done();
        })
};

exports.setAuthorisedUser = function (req, res, next) {
    let token = req.header('X-Authorization');

    if (typeof token !== "undefined") {
        findUserByToken(token, function (result) {
            if (typeof result !== "undefined") {
                console.log("Authorised user: " + result.user_id);
                req.authorisedUserId = result.user_id;
            }
        });
    }
    next();
};

exports.loginRequired = function (req, res, next) {
    let token = req.header('X-Authorization');
    let authorised = false;

    if (typeof token !== "undefined") {
        findUserByToken(token, function (result) {
            if (typeof result !== "undefined") {
                console.log("Authorised user when login required: " + result.user_id);
                req.authorisedUserId = result.user_id;
                authorised = true;
                next();
            }
        });
    }

    if (!authorised) {
        console.log("Login required not met");
        res.statusMessage = "Unauthorized";
        res.status(401)
            .send();
    }
};
