const reset = require('../controllers/reset.server.controller');

module.exports = function (app) {
    app.route('/reset')
        .post(reset.resetDB);
};
