const resample = require('../controllers/resample.server.controller');

module.exports = function (app) {
    app.route('/resample')
        .post(resample.resample);
};
