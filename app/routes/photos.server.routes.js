const photos = require('../controllers/photos.server.controller');
const authorise = require('../middleware/authorise');
const rawBodyParser = require('../middleware/raw_body_parser');

module.exports = function (app) {
    app.route(app.rootUrl + '/auctions/:id/photos')
        .get(photos.view)
        .post(rawBodyParser.rawParser, authorise.loginRequired, photos.add)
        .delete(authorise.loginRequired, photos.remove);
};
