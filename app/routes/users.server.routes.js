const users = require('../controllers/users.server.controller');
const authorise = require('../middleware/authorise');
const bodyParser = require('body-parser');

module.exports = function (app) {
    app.route(app.rootUrl + '/users')
        .post(users.create);

    app.route(app.rootUrl + '/users/login')
        .post(bodyParser.urlencoded({ extended: false }), users.login);

    app.route(app.rootUrl + '/users/logout')
        .post(authorise.loginRequired, users.logout);

    app.route(app.rootUrl + '/users/:id')
        .get(authorise.loginRequired, users.view)
        .patch(authorise.loginRequired, users.change);
};
