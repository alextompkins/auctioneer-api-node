const auctions = require('../controllers/auctions.server.controller');
const authorise = require('../middleware/authorise');

module.exports = function (app) {
    app.route(app.rootUrl + '/auctions')
        .get(auctions.viewAll)
        .post(authorise.loginRequired, auctions.create);

    app.route(app.rootUrl + '/auctions/:id')
        .get(auctions.view)
        .patch(authorise.loginRequired, auctions.edit);

    app.route(app.rootUrl + '/auctions/:id/bids')
        .get(auctions.viewBids)
        .post(authorise.loginRequired, auctions.makeBid);

    app.route(app.rootUrl + '/categories')
        .get(auctions.getCategories)
};
