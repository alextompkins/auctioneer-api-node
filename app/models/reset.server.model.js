const db = require('../../config/db');
const fs = require("mz/fs");

exports.resetDB = function(done) {
    fs.readFile("app/resources/create_database.sql", "utf8")
        .then(function (sql) {
            return db.get_pool().query(sql);
        })
        .then(function () {
            return done({"status": 200, "body": "OK"});
        })
        .catch(function (err) {
            console.log(err);
            return done({"status": 400, "body": "Malformed request."});
        });
};
