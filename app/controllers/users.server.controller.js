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
    Users.login(function (result) {
        res.statusMessage = result.statusMessage;
        res.status(result.status)
            .json(result.json);
    });
};

exports.logout = function (req, res) {
    Users.logout(function (result) {
        res.statusMessage = result.statusMessage;
        res.status(result.status)
            .send(result.body);
    });
};

exports.view = function (req, res) {
    Users.view(function (result) {
        res.statusMessage = result.statusMessage;
        res.status(result.status)
            .json(result.json);
    });
};

exports.change = function (req, res) {
    Users.change(function (result) {
        res.statusMessage = result.statusMessage;
        res.status(result.status)
            .send(result.body);
    });
};
