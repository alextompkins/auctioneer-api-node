const mysql = require('promise-mysql');

let state = {
    pool: null
};

exports.create_pool = function(done) {
    state.pool = mysql.createPool({
        multipleStatements: true,
        host: "HOST",
        user: "USERNAME",
        password: "PASSWORD",
        database: "DATABASE",
        timezone: 'utc'
    });
    done();
};

exports.get_pool = function() {
    return state.pool;
};
