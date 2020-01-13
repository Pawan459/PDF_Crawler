const db = require("../db");

module.exports = (req, res, next) => {
    if(!req.session.usrID) return res.sendStatus(403);
    db.query("select email from users where id=$1", [req.session.usrID]).then(result => {
        if(result.rowCount == 0)return res.sendStatus(403);        
        req.email = result.rows[0].email;
        next();
    }).catch(err =>  
        {
            if (process.env.NODE_ENV != 'production') console.error(err); 
            res.sendStatus(500); 
        }   
    );
}