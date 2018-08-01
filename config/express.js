const express = require('express');
const bodyParser = require('body-parser');

const allowCrossOriginRequests = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
};

module.exports = function() {
    // INITIALISE EXPRESS //
    const app = express();
    app.use(bodyParser.json());
    app.use(allowCrossOriginRequests);
    app.rootUrl = "/api/v1";

    // ROUTES //
    require('../app/routes/reset.server.routes')(app);
    require('../app/routes/resample.server.routes')(app);
    require('../app/routes/users.server.routes')(app);
    require('../app/routes/auctions.server.routes')(app);
    require('../app/routes/photos.server.routes')(app);

    return app;
};
