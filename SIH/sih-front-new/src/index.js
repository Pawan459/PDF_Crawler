import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import config from './config.json';
import './index.scss';
import App from './App';

window.authenticated = false;

axios.get(`${config.api}/api/authorize`, {withCredentials:true}).then((res) => {
    window.authenticated = true;
    window.email = res.data.email;
    ReactDOM.render(<App />, document.getElementById('root'), () => {
        window.jQuery("#loader").fadeOut(400, () =>  window.jQuery("#loader").removeClass("d-flex").hide());
    });
}).catch((err) => {
    ReactDOM.render(<App />, document.getElementById('root'), () => {
        window.jQuery("#loader").fadeOut(400, () =>  window.jQuery("#loader").removeClass("d-flex").hide());
    });
});


