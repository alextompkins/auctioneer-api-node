const Users = require('../models/users.server.model');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

function isValidEmail(email) {
    return email.includes("@")
}

exports.create = function (req, res) {
    let isValid = true;
    let values = [
        req.body.username,
        req.body.givenName,
        req.body.familyName,
        req.body.email,
        req.body.password
    ];

    for (let value of values) {
        if ((typeof value === "undefined") ||
            (typeof value === "string" && value === "")
        ) {
            isValid = false;
        }
    }
    if (!isValidEmail(req.body.email)) {
        isValid = false
    }

    if (!isValid) {
        res.statusMessage = "Malformed request.";
        res.status(400)
            .send();
    } else {
        let password = values.pop();

        bcrypt.hash(password, SALT_ROUNDS)
            .then(function (hash) {
                values.push(hash);
                Users.create(values, function (result) {
                    if (typeof result === "undefined") {
                        res.statusMessage = "Internal server error";
                        res.status(500)
                            .send();
                    } else {
                        let json = {
                            "id": result
                        };

                        res.statusMessage = "OK";
                        res.status(201)
                            .json(json);
                    }
                });
            });
    }
};

exports.login = function (req, res) {
    new Promise(function (resolve, reject) {
        Users.findByUsernameOrEmail(req.query.username, req.query.email, function (foundUser) {
            if (typeof foundUser === "undefined") {
                reject(new Error("No user could be found with the given username/email."));
            } else {
                resolve(foundUser);
            }
        });
    })
    .then(function (foundUser) {
        return bcrypt.compare(req.query.password, foundUser.password)
            .then(function (isCorrect) {
                if (isCorrect) {
                    Users.login(foundUser.userId, function (loginResult) {
                        if (typeof loginResult === "undefined") {
                            res.statusMessage = "Internal server error";
                            res.status(500)
                                .send();
                        } else {
                            res.statusMessage = "OK";
                            res.status(200)
                                .json(loginResult);
                        }
                    });
                } else {
                    throw Error("Passwords do not match.");
                }
            })
            .catch(function (err) {
                throw err;
            });
    })
    .catch(function (err) {
        console.log(err);
        res.statusMessage = "Invalid username/email/password supplied";
        res.status(400)
            .send();
    });
};

exports.logout = function (req, res) {
    let id = req.authorisedUserId;

    Users.logout(id, function (result) {
        if (result === true) {
            res.statusMessage = "OK";
            res.status(200)
                .send();
        } else if (result === false) {
            res.statusMessage = "Internal server error";
            res.status(500)
                .send();
        }
    });
};

exports.view = function (req, res) {
    let id = req.params.id;
    let isCurrentUser = id === req.authorisedUserId;

    Users.findById(id, isCurrentUser, function (result) {
        if (typeof result !== "undefined") {
            res.statusMessage = "OK";
            res.status(200)
                .json(result);
        } else {
            res.statusMessage = "Not found";
            res.status(404)
                .send();
        }
    });
};

exports.change = function (req, res) {
    let id =  req.params.id;
    let isValid = true;

    let changes = {
        "user_username": req.body.username,
        "user_password": req.body.password,
        "user_givenname": req.body.givenName,
        "user_familyname": req.body.familyName,
        "user_email": req.body.email
    };

    if (isNaN(parseInt(id)) || parseInt(id) < 0) {
        isValid = false;
    }
    for (let change of Object.keys(changes)) {
        if (typeof changes[change] === "string" && changes[change] === "") {
            isValid = false;
        }
    }

    if (id !== req.authorisedUserId) {
        res.statusMessage = "Unauthorized";
        res.status(401)
            .send();
    } else if (!isValid) {
        res.statusMessage = "Malformed request";
        res.status(400)
            .send();
    } else {
        Users.findByUsernameOrEmail(changes.user_username, changes.user_email, function (foundUser) {
            if (typeof foundUser !== "undefined") {
                res.statusMessage = "Bad request - a user already exists with that username/email.";
                res.status(400)
                    .send()
            } else {
                Users.change(id, changes, function (result) {
                    if (result === true) {
                        res.statusMessage = "OK";
                        res.status(201)
                            .send();
                    } else if (result === false) {
                        res.statusMessage = "Malformed request - no changes to the user were provided.";
                        res.status(400)
                            .send();
                    } else {
                        res.statusMessage = "Internal server error";
                        res.status(500)
                            .send();
                    }
                });
            }
        });
    }
};
