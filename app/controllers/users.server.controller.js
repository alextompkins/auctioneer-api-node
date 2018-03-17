const Users = require('../models/users.server.model');

exports.create = function (req, res) {
    let values = [
        req.body.username,
        req.body.givenName,
        req.body.familyName,
        req.body.email,
        req.body.password
    ];

    Users.create(values, function (result) {
        res.statusMessage = result.statusMessage;
        res.status(result.status)
            .json(result.json);
    });
};

exports.login = function (req, res) {
    let id;

    Users.findByUsernameOrEmail(req.query.username, req.query.email, function (result) {
        if (typeof result === "undefined" || result.password !== req.query.password) {
            res.statusMessage = "Invalid username/email/password supplied";
            res.status(400)
                .send();
        } else {
            id = result.userId;
            Users.login(id, function (result) {
                if (typeof result === "undefined") {
                    res.statusMessage = "Internal server error";
                    res.status(500)
                        .send();
                } else {
                    res.statusMessage = "OK";
                    res.status(200)
                        .json(result);
                }
            });
        }
    });
};

exports.logout = function (req, res) {
    let id = req.authorisedUserId;
    console.log("Current user: " + req.authorisedUserId);

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
    console.log("ID requested: " + id + " Current user: " + req.authorisedUserId);

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
    let changes = req.body;

    Users.change(id, changes, function (result) {
        res.statusMessage = result.statusMessage;
        res.status(result.status)
            .send(result.body);
    });
};
