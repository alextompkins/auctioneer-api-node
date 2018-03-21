const db = require('../../config/db');
const randtoken = require('rand-token');

exports.create = function(values, done) {
    const createSQL = "INSERT INTO auction_user (user_username, user_givenname, " +
        "user_familyname, user_email, user_password) VALUES (?, ?, ?, ?, ?)";

    db.get_pool().query(createSQL, values)
        .then(function (result) {
            return done(result.insertId);
        })
        .catch(function (err) {
            console.log(err);
            return done();
        });
};

exports.findByUsernameOrEmail = function (username, email, done) {
    const findSQL = "SELECT * FROM auction_user WHERE user_username = ? OR user_email = ?";

    db.get_pool().query(findSQL, [username, email])
        .then(function (rows) {
            let userData = rows[0];
            if (typeof userData === "undefined") {
                return done();
            } else {
                let user = {
                    "userId": userData.user_id,
                    "username": userData.user_username,
                    "givenName": userData.user_givenname,
                    "familyName": userData.user_familyname,
                    "password": userData.user_password
                };
                return done(user);
            }
        })
        .catch(function (err) {
            console.log(err);
            return done();
        });
};

exports.login = function (id, done) {
    const loginSQL = "UPDATE auction_user SET user_token = ? WHERE user_id = ?";

    let token = randtoken.generate(32);

    db.get_pool().query(loginSQL, [token, id])
        .then(function () {
            return done({"id": id, "token": token});
        })
        .catch(function (err) {
            console.log(err);
            return done();
        });
};

exports.logout = function (id, done) {
    const logoutSQL = "UPDATE auction_user SET user_token = NULL WHERE user_id = ?";

    db.get_pool().query(logoutSQL, id)
        .then(function () {
            return done(true);
        })
        .catch(function (err) {
            console.log(err);
            return done(false);
        })
};

exports.findById = function (id, isCurrentUser, done) {
	const viewSQL = "SELECT * FROM auction_user WHERE user_id = ?";

	db.get_pool().query(viewSQL, id)
		.then(function (rows) {
			if (rows.length === 0) {
				return done();
			}

			let userData = rows[0];
			let user = {
                "username": userData.user_username,
                "givenName": userData.user_givenname,
                "familyName": userData.user_familyname,
            };
			if (isCurrentUser) {
			    user.email = userData.user_email;
			    user.accountBalance = userData.user_accountbalance;
			}

			return done(user);
		})
		.catch(function (err) {
			console.log(err);
			return done();
		});
};

function buildUpdateUserSQL(id, params) {
    const PROPERTIES = [
        "user_username", "user_password", "user_givenname", "user_familyname", "user_email"
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
        return "UPDATE auction_user SET " + changes.join(', ') + " WHERE user_id = " + id;
    }
}

exports.change = function (id, changes, done) {
    let updateSQL = buildUpdateUserSQL(id, changes);
    if (updateSQL === "") {
		return done(false);
    }

    db.get_pool().query(updateSQL)
        .then(function (result) {
            return done(true);
        })
        .catch(function (err) {
            console.log(err);
            return done();
        });
};
