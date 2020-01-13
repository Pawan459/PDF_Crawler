const { Pool } = require('pg');
const config = require('./config.json');

const pool = new Pool({
    user: config.user,
    host: config.dbHost,
    database: config.db,
    password: config.password,
    port: config.dbPort
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1);
});

pool.connect()
    .then(client => {
        client.release()
        console.log("Connected to database successfully!")
    })
    .catch(err => {
        console.log("[ERROR] Can't connect to database")
        console.error(err.stack)
        process.exit(-1)
    })

module.exports = pool;