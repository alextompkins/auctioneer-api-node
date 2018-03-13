const db = require('./config/db');
const express = require('./config/express');
const app = express();
const port = 4941;

// Connect to MySQL on start-up
db.connect(function (err) {
    if (err) {
        console.log('Unable to connect to MySQL.');
        process.exit(1);
    } else {
        app.listen(port, function () {
            console.log("Listening on port: " + port);
        });
    }
});
