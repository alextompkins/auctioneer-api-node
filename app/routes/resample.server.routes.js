const resample = require('../controllers/resample.server.controller');

module.exports = function (app) {
    app.route(app.rootUrl + '/resample')
        .post(resample.resample);
};
