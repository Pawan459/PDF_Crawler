import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import config from '../config.json';
import event from '../utils/event';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errors: {
                email: '',
                password: ''
            },
            isChecking: false,
            remember: false,
            authenticated: window.authenticated
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.toggleRemember = this.toggleRemember.bind(this);
    }
    onSubmit(e) {
        e.preventDefault();
        this.setState({ isChecking: true });
        let errors = {};
        if (!this.state.email) errors.email = "This field cannot be empty";
        else if (!/^[a-z0-9][a-z0-9-_\.]+@[a-z0-9][a-z0-9-]+[a-z0-9]\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(this.state.email))
            errors.email = "Invalid email";
        if (!this.state.password) errors.password = "This field cannot be empty";

        if (Object.keys(errors).length) return this.setState({ errors: errors, isChecking: false });

        axios.post(`${config.api}/api/login`, {
            email: this.state.email,
            password: this.state.password,
            remember: this.state.remember
        }, {withCredentials: true}).then((res) => {
            window.authenticated = true;
            window.email = this.state.email;            
            window.showSuccess("You have been logged in!");
            this.setState({ authenticated: true, isChecking: false });
            event.emit('login');
        }).catch((err) => {
            console.log(err);
            if (err.response.status == 403) errors.auth = "Invalid credentials";
            else errors.auth = "Looks like our database is down, try again later";
            window.showError(errors.auth);
            this.setState({
                isChecking: false,
                errors: {
                    email: '',
                    password: ''
                }
            });
        });
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    toggleRemember(e) {
        this.setState({ remember: !this.state.remember });
    }
    render() {
        const { email, password, errors, isChecking, remember, authenticated } = this.state;
        return authenticated ?  (<div><Redirect to="/dashboard" /></div>) : (
            <div className="container login-wrapper">
                <form role="form" onSubmit={this.onSubmit}>
                    <div className="cover"></div>
                    <center>
                        <h2>L O G I N</h2>
                        <hr />
                        <div className='input-group input-group-lg'>
                            <input type="text" className="form-control" placeholder="Email" aria-describedby="email"
                                name="email" value={email} onChange={this.onChange} disabled={isChecking} />
                            <div className="input-group-append">
                                <span className="input-group-text" id="email"><i className="fa fa-user"></i></span>
                            </div>
                        </div>
                        <span className="float-left">
                            {errors.email}
                        </span>
                        <div className='input-group input-group-lg'>
                            <input type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="password"
                                name="password" value={password} onChange={this.onChange} disabled={isChecking} />
                            <div className="input-group-append">
                                <span className="input-group-text" id="password"><i className="fa fa-unlock-alt"></i></span>
                            </div>
                        </div>
                        <span className="float-left">
                            {errors.password}
                        </span>
                        <br />
                        <button type="submit" className="customB" disabled={isChecking}><h4 className="spacing">{isChecking ? (<i className="fas fa-spinner fa-lg fa-spin"></i>) : 'LOG IN'}</h4></button>
                        <br /><br />
                        <input type="checkbox" id="remember" onChange={this.toggleRemember} checked={remember} disabled={isChecking} />
                        <label className="form-check-label" for="remember">
                            &nbsp;&nbsp;Remember me
                            </label>
                        <br /><br />
                    </center>
                </form>
            </div>
        );
    }
}
export default Login;