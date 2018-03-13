const Reset = require('../models/reset.server.model');

exports.resetDB = function (req, res) {
    Reset.resetDB(function (result) {
        res.status(result.status).send(result.body);
    });
};
