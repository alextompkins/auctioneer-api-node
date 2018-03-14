const db = require('../../config/db');
const uid = require('uid');

exports.create = function(values, done) {
    const createSQL = "INSERT INTO auction_user (user_username, user_givenname, " +
        "user_familyname, user_email, user_password) VALUES (?, ?, ?, ?, ?)";

    db.get_pool().query(createSQL, values)
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

exports.findByUsernameOrEmail = function (username, email, done) {
    const findSQL = "SELECT * FROM view_auction_user WHERE username = ? OR email = ?;";

    db.get_pool().query(findSQL, [username, email])
        .then(function (rows) {
            return done(rows[0]);
        })
        .catch(function (err) {
            console.log(err);
            return done();
        });
};

exports.login = function(id, done) {
    const loginSQL = "UPDATE view_auction_user SET token = ? WHERE userId = ?";

    let token = uid(32);

    db.get_pool().query(loginSQL, [token, id])
        .then(function () {
            return done({"id": id, "token": token})
        })
        .catch(function (err) {
            console.log(err);
            return done();
        });
};

exports.view = function (id, done) {
    const viewSQL = "SELECT * FROM view_auction_user WHERE userId = ?";

    db.get_pool().query(viewSQL, id)
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

/*
exports.selectUser = function (id, done) {
	const viewSQL = "SELECT * FROM view_auction_user WHERE userId = ?";

	db.get_pool().query(viewSQL, id)
		.then(function (rows) {
			if (rows.length === 0) {
				return done( {err: 404} );
			}

			let userData = rows[0];
			let user = {
				"username": userData.username,
				"givenName": userData.givenName,
				"familyName": userData.familyName,
				"email": userData.email,
				"accountBalance": userData.accountBalance
			};
			// TODO: email and accountBalance properties only included if request is for own user_id
			return done( {user: user} );
		})
		.catch(function (err) {
			console.log(err);
			return done( {err: 400} );
		});
};
*/

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
    // TODO: Should an error be returned if an invaid property is given in the request?
    // TODO: Should an error be returned if no valid properties are given?
    let updateSQL = buildUpdateUserSQL(id, changes);
    if (updateSQL === "") {
		return done({"status": 400, "statusMessage": "Malformed request."});
    }

    db.get_pool().query(updateSQL)
        .then(function (result) {
            // TODO: Should an error be returned if the given id does not exist?
            return done({"status": 201, "statusMessage": "OK"});
        })
        .catch(function (err) {
            console.log(err);
            return done({"status": 401, "statusMessage": "Unauthorized"});
        });
};
