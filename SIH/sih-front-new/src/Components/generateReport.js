import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

import config from '../config.json';

class GenerateReport extends Component {

    constructor(props) {
        super(props);

        this.state = {
            gen:false
        };
        this.fetchUrls= this.fetchUrls.bind(this);
        this.generate = this.generate.bind(this);
    }
   
    fetchUrls() {
        this.setState({ urls: null });
        axios.get(`${config.api}/api/get/urls`, { withCredentials: true }).then(res => {
            this.setState({
                urls: res.data,
                selected: (new Array(res.data.length)).fill(1)
            });
        }).catch(err => {
            window.showError("Failed to load URLs list, check console for details");
            console.log(err);
        });
    }
    componentDidMount() {
        this.fetchUrls();
    }    
    generate(e) {
        e.preventDefault();   
        let ar = [];
        for(let i = 0; i < this.state.selected.length; i++) {
            if(this.state.selected[i] == 1)ar.push(this.state.urls[i].id);
        }
        if(ar.length == 0)return window.showError("Select ateast one ministry/site");
        this.setState({gen: true});
        axios.post(`${config.api}/api/generate`, {
            ids: ar
        }, { withCredentials: true }).then((res) => {
            window.showSuccess("Scrapping operations done successfully, you may now search");
            this.setState({ gen: false});            
        }).catch((err) => {
            console.log(err);
            window.showError("Some problem occured, check console for details");
            this.setState({
                gen: false
            });
        });
    }
    render() {
        return (
            <div className="content-wrapper genReport">
                <div className="container-fluid box">
                    <div className="row">
                        <div className="col-6"><h4>New Report Generation</h4> </div>
                        <div className="col-6 text-right"><button disabled={this.state.gen}  className="but" onClick={this.generate}>Generate&nbsp;&nbsp;&nbsp;<i className="fas fa-file-import"></i></button></div>
                    </div>
                    {this.state.gen? <span><br /><i className="fas fa-spinner fa-spin"></i>&nbsp;&nbsp;Report is being generated, this will take few minutes.
                     When the report generation is done you will be alerted via email and SMS. Or you can view the generated report under  <Link to="/">View Reports section</Link></span> : ''}
                    <hr />
                    Select Ministries/Sites from which new reports are to be generated:<br /> <br />
                    <button disabled={this.state.gen} className="btn btn-primary" onClick={() => {
                        this.state.selected.fill(1);
                        this.setState({
                            selected: this.state.selected
                        });
                    }}>Select all</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <button disabled={this.state.gen} className="btn btn-primary" onClick={() => {
                        this.state.selected.fill(0);
                        this.setState({
                            selected: this.state.selected
                        });
                    }}>Select None</button>
                    <br />
                    <div className="row">
                        {
                            !this.state.urls ? <div className="col-12 text-center"><i className="fas fa-spinner fa-3x fa-spin"></i><br /><br /></div>:
                                this.state.urls.map((r, i)  =>  
                                <div className="col-3" key={i} onClick={(e) => {
                                    if(this.state.gen == true)return;
                                    this.state.selected[i] = !this.state.selected[i];
                                    this.setState({
                                        selected: this.state.selected
                                    });
                                }}>
                                    <div className={`iurl${this.state.selected[i]? ' active' : ''}`}>
                                    <i className="fas fa-link fa-3x"></i> <br /> <br />
                                    <h3>{r.ministryName}</h3>
                                    <hr />
                                    <a href={`"${r.url}"`} target="_blank">{r.url} &nbsp;<i className="fas fa-external-link-alt"></i></a>
                                    </div>
                                </div>)
                        }                       
                        
                    </div>
                </div>
            </div>
        );
    }
}

export default GenerateReport;