const db = require("../db");
const Helper = require("../util");

module.exports = (req, res) => {
    if(!(req.body.email && req.body.password)) return res.sendStatus(400);
    if(!Helper.isValidEmail(req.body.email))return res.sendStatus(400);
    db.query("select id from users where email = $1 and pass = crypt($2, pass)", [req.body.email, req.body.password]).then(result => {
        if(result.rowCount == 0)return res.sendStatus(403);
        req.session.usrID = result.rows[0].id;
        if(!req.body.remember) 
            req.session.cookie.expires = false;
        else
            req.session.cookie.expires = new Date(Date.now() + 1296000000 ) //15 days
        res.sendStatus(200);
    }).catch(err =>  
        {
            if (process.env.NODE_ENV != 'production') console.error(err); 
            res.sendStatus(500);  
        }   
    );
};