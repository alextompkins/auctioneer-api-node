const Reset = require('../models/reset.server.model');

exports.resetDB = function (req, res) {
    Reset.resetDB(function (result) {
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
