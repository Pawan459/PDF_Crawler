import React, { Component } from 'react';
import axios from 'axios';

import config from '../config.json';

class ManageURL extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nUrl: '',
            nName: '',
            adding: false,
            del: -1
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.fetchUrls = this.fetchUrls.bind(this);
        this.deleteUrl = this.deleteUrl.bind(this);
    }
    deleteUrl(id) {
        this.setState({del:id});
        axios.post(`${config.api}/api/delete/url`, {id: id}, { withCredentials: true }).then(res => {
            this.setState({
                del: -1
            });
            this.fetchUrls();
        }).catch(err => {
            this.setState({
                del: -1
            });
            window.showError("Some error occured, check console for details");
            console.log(err);
        });
    }
    fetchUrls() {
        this.setState({urls:null});
        axios.get(`${config.api}/api/get/urls`, { withCredentials: true }).then(res => {
            this.setState({
                urls: res.data
            });
        }).catch(err => {
            window.showError("Failed to load URLs list, check console for details");
            console.log(err);
        });
    }

    componentDidMount() {
        this.fetchUrls();
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    onSubmit(e) {
        e.preventDefault();
        if (!this.state.nName || !this.state.nUrl) return window.showError("One of the field is empty");
        if (!/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi.test(this.state.nUrl)) return window.showError("Invalid URL");
        this.setState({ adding: true });
        axios.post(`${config.api}/api/add/url`, {
            name: this.state.nName,
            url: this.state.nUrl
        }, { withCredentials: true }).then((res) => {
            this.setState({ adding: false, nName:'', nUrl:''});
            this.fetchUrls();
        }).catch((err) => {
            console.log(err);
            window.showError("Some problem occured, check console for details");
            this.setState({
                adding: false
            });
        });
    }
    render() {
        return (
            <div className="content-wrapper urls">
                <div className="container-fluid box">
                    <h4>Add URL to be scrapped</h4>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label htmlFor="urlNameInput">Ministry Name to be associated with this URL</label>
                            <input disabled={this.state.adding} type="text" name="nName" value={this.state.nName} onChange={this.onChange} className="form-control" id="urlNameInput" aria-describedby="urlName" placeholder="Enter ministry name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="urllink">URL</label>
                            <input disabled={this.state.adding} type="text" name="nUrl" value={this.state.nUrl} onChange={this.onChange} className="form-control" id="urllink" placeholder="http://example.com/path/to/url" />
                            <small className="form-text text-muted">Make sure the URL is accessible publicly.</small>
                        </div>
                        <hr />
                        <button disabled={this.state.adding} type="submit" className="btn btn-success float-right">{this.state.adding ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-calendar-plus"></i>}&nbsp;&nbsp;Add</button>
                        <br /><br />
                    </form>
                </div>

                <div className="container-fluid box">
                    Currently in database:
                    <br /> <br />
                    <table className="table table-striped table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">URL</th>
                                <th scope="col">Created At</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.urls ? this.state.urls.length == 0 ? (
                                <tr>
                                    <th scope="row">-</th>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
                            ) : this.state.urls.map((r, i) => {
                                const dbTime = new Date(r.createdAt),
                                    uTime = (new Date(dbTime.getTime() + (dbTime.getTimezoneOffset() - (new Date()).getTimezoneOffset()) * 60 * 1000)).toString().split(" ");
                                return <tr key={i}>
                                    <th scope="row">{r.id}</th>
                                    <td>{r.ministryName}</td>
                                    <td><a href={`${r.url}`} target="_blank">{r.url}&nbsp;&nbsp;&nbsp;<i className="fas fa-external-link-alt"></i></a></td>
                                    <td>{`${uTime[2]}/${uTime[1]}/${uTime[3]}   ${uTime[4]}`}</td>
                                    <td>{r.id == this.state.del ? <i className="fas fa-spinner fa-spin"></i> : this.state.del != -1 ? <a><i className="fas fa-trash-alt"></i></a> : <a href="#" onClick={(e) => { e.preventDefault(); this.deleteUrl(r.id); }}><i className="fas fa-trash-alt"></i></a>}</td>
                                </tr>;
                            }) : <tr>
                                    <th scope="row"><i className="fas fa-spinner fa-spin"></i></th>
                                    <td><i className="fas fa-spinner fa-spin"></i></td>
                                    <td><i className="fas fa-spinner fa-spin"></i></td>
                                    <td><i className="fas fa-spinner fa-spin"></i></td>
                                    <td><i className="fas fa-spinner fa-spin"></i></td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default ManageURL;