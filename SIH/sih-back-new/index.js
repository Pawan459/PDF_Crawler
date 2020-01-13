const Express = require('express'),
    session = require('express-session'),
    pgSession = require('connect-pg-simple')(session),
    pgPool = require('./db');

const config = require("./config.json"),
    ApiHandler = require("./api");



const app = Express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
    next();
});
app.use(Express.json());
app.use(Express.urlencoded({extended:true}));
app.use(session({
    store: new pgSession({
      pool : pgPool                  
    }),
    secret: 'Knh33wAZ1lfTP2DXYo62',
    name: 'iwashere',
    resave: true,
    saveUninitialized: false
}));

app.use('/api', ApiHandler);

app.disable('x-powered-by');

app.get('*', (req, res) => {
    res.sendStatus(404);
});

app.listen(config.appPort, () => {
    console.log('\x1b[36m', `SIH Backend app is now running and listening to port ${config.appPort}`, '\x1b[0m');
});
