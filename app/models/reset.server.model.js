const db = require('../../config/db');
const fs = require('mz/fs');

exports.resetDB = function(done) {
    const directory = "./storage/photos/";

    fs.readFile("app/resources/create_database.sql", "utf8")
        .then(function (sql) {
            return db.get_pool().query(sql);
        })
        .then(function () {
            return fs.readdir(directory);
        })
        .then(function (files) {
            for (let file of files) {
                if (file !== "default.png") {
                    fs.unlink(directory + file);
                }
            }
            return done(true);
        })
        .catch(function (err) {
            console.log(err);
            return done(false);
        });
};
