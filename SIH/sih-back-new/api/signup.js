const db = require("../db");
const Helper = require("../util");

module.exports = async (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.number || !Helper.isValidNumber(req.body.number) || !Helper.isValidEmail(req.body.email))
        return res.sendStatus(400);
   
    const createQuery = `INSERT INTO
        users(email, pass, phone_no)
        VALUES($1, crypt($2, gen_salt('bf', 8)), $3)
        returning id`;
    const values = [
        req.body.email,
        req.body.password,
        req.body.number
    ];
    try {
        await db.query(createQuery, values);
        return res.sendStatus(200);
    } catch (error) {
        if (process.env.NODE_ENV != 'production') console.error(error); 
        if (error.routine === '_bt_check_unique') {
            return res.status(400).json({ 'message': 'User with that EMAIL already exist' })
        }
        return res.sendStatus(500);
    }
};
