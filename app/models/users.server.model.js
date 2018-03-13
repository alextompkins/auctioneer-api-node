const db = require('../../config/db');

exports.create = function(values, done) {
    const createSQL = "INSERT INTO auction_user (user_username, user_givenname, " +
        "user_familyname, user_email, user_password) VALUES (?, ?, ?, ?, ?)";

    db.get_pool().getConnection()
        .then(function () {
            return db.get_pool().query(createSQL, values);
        })
        .then(function (result) {
            let json = {
                "id": result.insertId
            };
            return done({"status": 201, "statusMessage": "OK", "json": json});
        })
        .catch(function (err) {
            console.log(err);
            return done({"status": 400, "statusMessage": "Malformed request."});
        });
};

exports.view