const Express = require("express");

const authorize = require("../util/authorize"),
    login = require("./login"),
    protected = require("./protected"),
    logout = require("./logout"),
    signup = require("./signup"),
    search = require("./search"),
    getUrls =  require("./getUrls"),
    addUrl = require("./addUrl"),
    deleteUrl = require("./deleteUrl"),
    generate = require('./generate');

let router = Express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/logout", logout);


//router.get("/url/:url", url);

//protected routes:
router.get("/authorize", authorize, protected);
router.post("/search", authorize, search);
router.get("/get/urls", authorize, getUrls);
router.post("/add/url", authorize, addUrl);
router.post("/delete/url", authorize, deleteUrl);
router.post("/generate", authorize, generate);

router.get('*', (req, res) => res.sendStatus(404));
module.exports = router;