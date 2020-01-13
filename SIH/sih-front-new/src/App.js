import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import PRoute from './Components/ProtectedRoute';

import Signup from './Components/Signup';
import Login from './Components/Login';
import Registered from './Components/registered';
import DashBoard from './Components/dashboard';
import Search from './Components/search';
import ManageURL from './Components/manageUrl';
import GenerateReport  from './Components/generateReport';

import event from './utils/event';


class App extends Component {

    constructor(props) {
        super(props);
        this.onLogin = this.onLogin.bind(this);
    }

    onLogin() {
        this.forceUpdate();
    }

    componentDidMount() {
        event.on('login', this.onLogin);
    }
    componentWillUnmount() {
        event.removeListener('login', this.onLogin);
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <div className="content">
                        <div className="container-fluid row">
                            <div className="col-md-2 sidebar">
                                <Link to="/"><center><img src="/img/eye.png" /><br /><br />H O M E</center></Link>

                                {!window.authenticated ? (
                                    <ul>
                                        <li><Link to="/signup"><span><i className="fa fa-user-plus fa-lg"></i></span>&nbsp;Sign up</Link></li>
                                        <li><Link className="active" to="/"><span><i className="fa fa-sign-in-alt fa-lg"></i></span>&nbsp;Login</Link></li>
                                    </ul>
                                ) : (
                                        <div>
                                            <div className="loggedIn">Logged in as {window.email}</div>
                                            <hr />
                                            <ul>
                                                <li><Link to="/"><span><i className="fa fa-file-signature fa-lg"></i></span>&nbsp;Generate New Reports</Link></li>
                                                <li><Link className="active" to="/"><span><i className="fa fa-eye fa-lg"></i></span>&nbsp;View Reports History</Link></li>
                                                <li><Link to="/"><span><i className="fa fa-unlock-alt fa-lg"></i></span>&nbsp;Change Password</Link></li>
                                                <li><Link to="/"><span><i className="fa fa-user-plus fa-lg"></i></span>&nbsp;Approve New Users</Link></li>
                                                <li><Link to="/"><span><i className="fa fa-users fa-lg"></i></span>&nbsp;View/Remove Users</Link></li>
                                                <li><Link to="/"><span><i className="fa fa-tools fa-lg"></i></span>&nbsp;Add/Edit Scrapping URLS</Link></li>
                                            </ul>

                                        </div>
                                    )
                                }
                            </div>
                            <div className="col-md-10" id="content-wrapper-main">
                                <Route path="/" exact={true} component={Login} />
                                <Route path="/signup" exact={true} component={Signup} />
                                <Route path="/registered" exact={true} component={Registered} />
                                <PRoute path="/dashboard" exact={true} component={DashBoard} />
                                <PRoute path="/search" exact={true} component={Search} />
                                <PRoute path="/manage/urls" exact={true} component={ManageURL} />
                                <PRoute path="/generate/report" exact={true} component={GenerateReport} />
                            </div>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
