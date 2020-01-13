module.exports = (req, res) => {
    req.session.userID = '';
    req.session.destroy(function(err) {
        res.sendStatus(200);
    });
};