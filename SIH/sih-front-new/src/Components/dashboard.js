import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class DashBoard extends Component {
    render() {
        return (
            <div className="content-wrapper dashboard">
                <div className="container-fluid box">
                    <div className="row">
                        <div className="col-md-4">
                            <Link to="/generate/report" className="tool report">
                                <i className="fas fa-file-signature fa-3x"></i>
                                <hr />
                                <span>Generate New Reports</span>
                            </Link>
                        </div>
                        <div className="col-md-4">
                            <Link to="/dashboard" className="tool view">
                                <i className="fas fa-eye fa-3x"></i>
                                <hr />
                                <span>View Reports History</span>
                            </Link>
                        </div>
                        <div className="col-md-4">
                            <Link to="/search" className="tool pass">
                                <i className="fas fa-search fa-3x"></i>
                                <hr />
                                <span>Search</span>
                            </Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <Link to="/dashboard" className="tool ausers">
                                <i className="fas fa-user-plus fa-3x"></i>
                                <hr />
                                <span>Approve New Users</span>
                            </Link>
                        </div>
                        <div className="col-md-4">
                            <Link to="/dashboard" className="tool vusers">
                                <i className="fas fa-users fa-3x"></i>
                                <hr />
                                <span>View/Remove Users</span>
                            </Link>
                        </div>
                        <div className="col-md-4">
                            <Link to="/manage/urls" className="tool urls">
                                <i className="fas fa-tools fa-3x"></i>
                                <hr />
                                <span>Add/Edit Scrapping URLS</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DashBoard;