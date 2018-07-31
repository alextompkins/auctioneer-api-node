const mysql = require('promise-mysql');

let state = {
    pool: null
};

exports.create_pool = function(done) {
    state.pool = mysql.createPool({
        multipleStatements: true,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE
    });
    done();
};

exports.get_pool = function() {
    return state.pool;
};
