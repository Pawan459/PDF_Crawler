import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import config from '../config.json';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            rpassword: '',
            number: '',
            errors: {
                email: '',
                password: '',
                rpassword: '',
                number: ''
            },
            isChecking: false,
            remember: false,
            done:false
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    onSubmit(e) {
        e.preventDefault();
        this.setState({ isChecking: true });
        let errors = {};
        if (!this.state.email) errors.email = "This field cannot be empty";
        else if (!/^[a-z0-9][a-z0-9-_\.]+@[a-z0-9][a-z0-9-]+[a-z0-9]\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(this.state.email))
            errors.email = "Invalid email";
        if (!this.state.password) errors.password = "This field cannot be empty";
        else if(!this.state.rpassword) errors.rpassword = "This field cannot be empty";
        else if(this.state.password != this.state.rpassword) errors.rpassword = "Passwords do not match";

        if (!this.state.number) errors.number = "This field cannot be empty";
        else if(!/^[0-9]{10}$/.test(this.state.number)) errors.number = "Invalid number";

        if (Object.keys(errors).length) return this.setState({ errors: errors, isChecking: false });

        axios.post(`${config.api}/api/signup`, {
            email: this.state.email,
            password: this.state.password,
            number: this.state.number
        }).then((res) => {           
            window.showSuccess("You have successfully signed up");
            this.setState({ done: true });
        }).catch((err) => {
            console.log(err);
            if (err.response.status == 400) errors.auth = "Email already exists";
            else errors.auth = "Looks like our database is down, try again later";
            window.showError(errors.auth);
            this.setState({
                isChecking: false,
                errors: {
                    email: '',
                    password: '',
                    rpassword: '',
                    number: ''
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
        const { email, password,  rpassword, errors, isChecking, number, done } = this.state;
        return window.authenticated  ? (<div><Redirect to="/dashboard" /></div>) : done ? <div><Redirect to="/registered" /></div> : (            
            <div className="container login-wrapper">
                <form role="form" onSubmit={this.onSubmit}>
                    <div className="cover"></div>
                    <center>
                        <h2>S I G N - U P</h2>
                        <hr />
                        <div className='input-group input-group-lg'>
                            <input type="text" className="form-control" placeholder="Email" aria-describedby="email"
                                name="email" onChange={this.onChange} value={email} disabled={isChecking} />
                            <div className="input-group-append">
                                <span className="input-group-text" id="email"><i className="fa fa-user"></i></span>
                            </div>
                        </div>
                        <span className="float-left">
                        {errors.email}
                        </span>
                        <div className='input-group input-group-lg'>
                            <input type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="password"
                                name="password" onChange={this.onChange} value={password} disabled={isChecking} />
                            <div className="input-group-append">
                                <span className="input-group-text" id="password"><i className="fa fa-unlock-alt"></i></span>
                            </div>
                        </div>
                        <span className="float-left">
                        {errors.password}
                        </span>
                        <div className='input-group input-group-lg'>
                            <input type="password" className="form-control" placeholder="Retype password" aria-label="Password" aria-describedby="password"
                                name="rpassword" onChange={this.onChange} value={rpassword} disabled={isChecking} />
                            <div className="input-group-append">
                                <span className="input-group-text" id="rpassword"><i className="fa fa-unlock-alt"></i></span>
                            </div>
                        </div>
                        <span className="float-left">
                        {errors.rpassword}
                        </span>
                        <div className='input-group input-group-lg'>
                            <input type="texxt" className="form-control" placeholder="Phone Number" aria-label="number" aria-describedby="number"
                                name="number" onChange={this.onChange} value={number} disabled={isChecking} />
                            <div className="input-group-append">
                                <span className="input-group-text" id="number"><i className="fa fa-phone"></i></span>
                            </div>
                        </div>
                        <span className="float-left">
                        {errors.number}
                        </span>
                        <br />
                        <button type="submit" className="customB" disabled={isChecking}><h4 className="spacing">{isChecking ? (<i className="fas fa-spinner fa-lg fa-spin"></i>) : 'SIGN UP'}</h4></button>
                        <br /><br />
                        <br /><br />
                    </center>

                </form>
            </div>
        );
    }
}
export default Signup;