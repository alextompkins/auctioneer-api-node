const users = require('../controllers/users.server.controller');
const authorise = require('../middleware/authorise');

module.exports = function (app) {
    app.route(app.rootUrl + '/users')
        .post(users.create);

    app.route(app.rootUrl + '/users/login')
        .post(users.login);

    app.route(app.rootUrl + '/users/logout')
        .post(authorise.authorise, users.logout);

    app.route(app.rootUrl + '/users/:id')
        .get(users.view)
        .patch(users.change);
};
