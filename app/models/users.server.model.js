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

exports.view = function (id, done) {
    const viewSQL = "SELECT * FROM view_auction_user WHERE userId = ?";

    db.get_pool().getConnection()
        .then(function () {
            return db.get_pool().query(viewSQL, id);
        })
        .then(function (rows) {
            if (rows.length === 0) {
                return done({"status": 404, "statusMessage": "Not found"});
            }

            let userData = rows[0];
            let json = {
                "username": userData.username,
                "givenName": userData.givenName,
                "familyName": userData.familyName,
                "email": userData.email,
                "accountBalance": userData.accountBalance
            };
            // TODO: email and accountBalance properties only included if request is for own user_id
            return done({"status": 200, "statusMessage": "OK", "json": json});
        })
        .catch(function (err) {
            console.log(err);
            return done({"status": 400, "statusMessage": "Malformed request."});
        });
};

function buildUpdateUserSQL(id, params) {
    const PROPERTIES = [
        "username", "password", "givenName", "familyName", "email"
    ];

    let changes = [];
    for (let property of PROPERTIES) {
        if (typeof params[property] !== "undefined") {
            changes.push(property + " = '" + params[property] + "'");
        }
    }

    if (changes.length === 0) {
        return "";
    } else {
        return "UPDATE view_auction_user SET " + changes.join(', ') + " WHERE userId = " + id;
    }
}

exports.change = function (id, changes, done) {
    db.get_pool().getConnection()
        .then(function () {
            // TODO: Should an error be returned if an invaid property is given in the request?
            // TODO: Should an error be returned if no valid properties are given?
            let updateSQL = buildUpdateUserSQL(id, changes);
            if (updateSQL !== "") {
                return db.get_pool().query(updateSQL);
            }
        })
        .then(function (result) {
            // TODO: Should an error be returned if the given id does not exist?
            return done({"status": 201, "statusMessage": "OK"});
        })
        .catch(function (err) {
            console.log(err);
            return done({"status": 401, "statusMessage": "Unauthorized"});
        });
};
