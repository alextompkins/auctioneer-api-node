const express = require('express');
const bodyParser = require('body-parser');

module.exports = function() {
    // INITIALISE EXPRESS //
    const app = express();
    app.use(bodyParser.json());
    app.rootUrl = "/api/v1";

    // ROUTES //
    require('../app/routes/reset.server.routes')(app);
    require('../app/routes/resample.server.routes')(app);
    require('../app/routes/users.server.routes')(app);
    require('../app/routes/auctions.server.routes')(app);

    return app;
};
