const reset = require('../controllers/reset.server.controller');

module.exports = function (app) {
    app.route(app.rootUrl + '/reset')
        .post(reset.resetDB);
};
