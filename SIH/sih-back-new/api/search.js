const db = require("../db");

module.exports = (req, res) => {
    if (!req.body.text || !req.body.type || !req.body.days) return res.sendStatus(400);
    if (req.body.days == -1)
        db.query(`select reports.url rurl, reports."createdAt", reports.linktext, "urlsToScrape"."ministryName", "urlsToScrape".url FROM reports left join "urlsToScrape" on reports."extractedFrom" = "urlsToScrape".id where  reports."tokens" @@ to_tsquery($1)  OR reports.linktext LIKE $2`, [req.body.text.replace(/\s\s+/g, ' ').split(" ").join(req.body.type == '1' ? " | " : " & "), `%${req.body.text}%`])
            .then(result => {
                res.json(result.rows);
            }).catch(err => {
                if (process.env.NODE_ENV != 'production') console.error(err);
                res.sendStatus(500);
            })
    else db.query(`select reports.url rurl, reports."createdAt", reports.linktext, "urlsToScrape"."ministryName", "urlsToScrape".url FROM reports left join "urlsToScrape" on reports."extractedFrom" = "urlsToScrape".id where  (reports."tokens" @@ to_tsquery($1)  OR reports.linktext LIKE $2) AND reports."createdAt"::date > current_date - interval '${parseInt(req.body.days)}' day`, [req.body.text.replace(/\s\s+/g, ' ').split(" ").join(req.body.type == '1' ? " | " : " & "), `%${req.body.text}%`])
    .then(result => {
        res.json(result.rows);
    }).catch(err => {
        if (process.env.NODE_ENV != 'production') console.error(err);
        res.sendStatus(500);
    })
};