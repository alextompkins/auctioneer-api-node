const db = require('./config/db');
const express = require('./config/express');
const app = express();
const port = 4941;

// Test connection to MySQL on start-up
new Promise(
    function (resolve, reject) {
        db.create_pool(function (err) {
            if (err) {
                reject("Error: couldn't create MySQL pool.");
            } else {
                resolve();
            }
        });
    })
    .then(function () {
        return db.get_pool().getConnection();
    })
    .then(function () {
        app.listen(port, function () {
            console.log("Listening on port: " + port);
        });
    })
    .catch(function (err) {
        console.log("Unable to connect to MySQL.");
        process.exit(1);
    });