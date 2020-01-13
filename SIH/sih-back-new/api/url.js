const axios = require("axios");

module.exports = (req, res) => {
    let url = decodeURI(req.params.url);
    axios.get(url).then(response => {
        res.send(response.data);
    });
};