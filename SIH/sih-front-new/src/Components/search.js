import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import config from '../config.json';

class DashBoard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            searching: false,
            result: null,
            searchType: 1,
            days:''
        };

        this.onChange = this.onChange.bind(this);
        this.onDaysChange = this.onDaysChange.bind(this);
        this.keyPress = this.keyPress.bind(this);
        this.searchTypeChange = this.searchTypeChange.bind(this);
        this.search = this.search.bind(this);
    }

    search() {
        if (this.state.searchText.length < 3) {
            return window.showError("Enter atleast three characters to start searching");
        }
        this.setState({ searching: true });
        axios.post(`${config.api}/api/search`, {
            text: this.state.searchText,
            type: this.state.searchType,
            days: this.state.days &&  this.state.days > 0 ? this.state.days : -1
        }, { withCredentials: true }).then((res) => {
            this.setState({ searching: false, result: res.data });
        }).catch((err) => {
            console.log(err);
            window.showError("Some problem occured, check console for details");
            this.setState({
                searching: false
            });
        });
    }
    
    onDaysChange(e) {
        this.setState({ days: e.target.value });
    }
    onChange(e) {
        this.setState({ searchText: e.target.value });
    }
    searchTypeChange(e) {
        this.setState({ searchType: e.target.value })
    }
    keyPress(e) {
        if (e.keyCode == 13) {
            this.search();
        }
    }
    render() {
        return (
            <div className="content-wrapper searchPage">
                <div className="container-fluid box">
                    <header>
                        <h3>S E A R C H</h3>
                        <div className="input-group input-group-lg">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className={this.state.searching ? "fas fa-spinner fa-lg fa-spin" : "fas fa-search fa-lg"} aria-hidden="true"></i></span>
                            </div>
                            <input disabled={this.state.searching} onKeyDown={this.keyPress} onChange={this.onChange} value={this.state.searchText} type="text" className='form-control' placeholder="Search" aria-label="Search" />
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-md-4 text-left" onChange={this.searchTypeChange}>
                                <input type="radio" value="1" name="type" checked /> Match at least one word <br />
                                <input type="radio" value="2" name="type" /> Match all word(s)
                            </div>
                            <div className="col-md-4">  
                            <button className="but" onClick={this.search} disabled={this.state.searching}>Search</button>                            
                            </div>
                            <div className="col-md-4 text-right">
                                Scrapped within last x days:<br/>
                                <input type="number" value={this.state.days} onChange={this.onDaysChange} name="days" />                                
                            </div>
                        </div>
                    </header>
                    <div className="results d-flex align-items-center justify-content-center ">
                        {!this.state.result ? (<img src="/img/seo.png" />) : this.state.result.length == 0 ? <h3>No search results found</h3> :
                            (
                                <table className="align-self-start">
                                    <tr>
                                        <th>#</th>
                                        <th>Ministry</th>
                                        <th>Report Link</th>
                                        <th>Date Scrapped</th>
                                    </tr>
                                    {
                                        this.state.result.map((r, i) => {
                                            const dbTime = new Date(r.createdAt),
                                                uTime = (new Date(dbTime.getTime() + (dbTime.getTimezoneOffset() - (new Date()).getTimezoneOffset()) * 60 * 1000)).toString().split(" ");

                                            return <tr>
                                                <td>{i}</td>
                                                <td><a href={`${r.url}`} target="_blank">{r.ministryName}</a></td>
                                                <td><a href={`${r.rurl}`} target="_blank">{r.linktext}</a></td>
                                                <td>{`${uTime[2]}/${uTime[1]}/${uTime[3]} ${uTime[4]}`}</td>
                                            </tr>;
                                        })
                                    }
                                </table>
                            )
                        }

                    </div>
                </div>
            </div>
        );
    }
}

export default DashBoard;