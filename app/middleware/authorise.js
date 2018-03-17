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

exports.authorise = function (req, res, next) {
    let token = req.header('X-Authorization');

    findUserByToken(token, function (result) {
        if (typeof result !== "undefined") {
            req.authorisedUserId = result.user_id;
            next();
        } else {
            res.statusMessage = "Unauthorized";
            res.status(401)
                .send();
        }
    });
};
