const mysql = require('mysql');

let state = {
    pool: null
};

exports.connect = function(done) {
    state.pool = mysql.createPool({
        multipleStatements: true,
        host: "HOST",
        user: "USERNAME",
        password: "PASSWORD",
        database: "DATABASE"
    });
    done();
};

exports.get_pool = function() {
    return state.pool;
};
