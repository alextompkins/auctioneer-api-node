const Resample = require('../models/resample.server.model');

exports.resample = function (req, res) {
    Resample.loadData(function (result) {
        res.statusMessage = result.statusMessage;
        res.status(result.status)
            .send();
    });
};
