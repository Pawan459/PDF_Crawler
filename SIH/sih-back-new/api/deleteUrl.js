const db = require("../db");

module.exports = (req, res) => {
    if (!req.body.id) return res.sendStatus(400);
    db.query(`delete from "urlsToScrape" where id = $1`,[req.body.id])
        .then(result => {
            res.sendStatus(200);
        }).catch(err => {
            if (process.env.NODE_ENV != 'production') console.error(err);
            res.sendStatus(500);
        })
};