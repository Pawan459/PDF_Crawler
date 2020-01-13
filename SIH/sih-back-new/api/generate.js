const db = require("../db");
const spawn = require("child_process").spawn;
const path = require("path")

const root = path.join(__dirname, './python/');

module.exports = (req, res) => {
    if (!req.body.ids) return res.sendStatus(400);
    try {
    const pythonProcess = spawn('python',[root+"test.py", req.session.usrID, req.body.ids.join(',') ]);

    pythonProcess.stdout.on('data', (data) => {
        res.status(200).send(data);
    });
    }
    catch(e) {
        if (process.env.NODE_ENV != 'production') console.error(e);
        res.status(500).send(e);
    }
};