const mysql = require('mysql');

let state = {
    pool: null
};

exports.connect = function(done) {
    state.pool = mysql.createPool({
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
