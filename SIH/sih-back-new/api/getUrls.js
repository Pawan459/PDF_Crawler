const db = require("../db");

module.exports = (req, res) => {
    db.query(`select * from "urlsToScrape"`)
        .then(result => {
            res.json(result.rows);
        }).catch(err => {
            if (process.env.NODE_ENV != 'production') console.error(err);
            res.sendStatus(500);
        });
};