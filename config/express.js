const express = require('express');
const bodyParser = require('body-parser');

module.exports = function() {
    // INITIALISE EXPRESS //
    const app = express();
    app.use(bodyParser.json());

    // ROUTES //
    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/reset.server.routes.js')(app);
    require('../app/routes/resample.server.routes.js')(app);
    require('../app/routes/users.server.routes')(app);

    return app;
};
