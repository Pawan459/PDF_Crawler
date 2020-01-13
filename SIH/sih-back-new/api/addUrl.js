const db = require("../db");

module.exports = (req, res) => {
    if (!req.body.name || !req.body.url || !/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi.test(req.body.url)) return res.sendStatus(400);
    db.query(`insert into "urlsToScrape"("ministryName", url) VALUES($1, $2)`,[req.body.name, req.body.url])
        .then(result => {
            res.sendStatus(200);
        }).catch(err => {
            if (process.env.NODE_ENV != 'production') console.error(err);
            res.sendStatus(500);
        })
};