const Resample = require('../models/resample.server.model');

exports.resample = function (req, res) {
    Resample.loadData(function (result) {
        if (result === true) {
            res.statusMessage = "Sample of data has been reloaded.";
            res.status(201)
                .send();
        } else if (result === false) {
            res.statusMessage = "Internal server error";
            res.status(500)
                .send();
        }
    });
};
