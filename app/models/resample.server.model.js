const db = require('../../config/db');
const fs = require("mz/fs");

exports.loadData = function(done) {
    fs.readFile("app/resources/load_data.sql", "utf8")
        .then(function (sql) {
            return db.get_pool().query(sql);
        })
        .then(function () {
            return done(true);
        })
        .catch(function (err) {
            console.log(err);
            return done(false);
        });
};
