const db = require("../db");

module.exports = (req, res) => {
    res.json({'email':req.email});
};