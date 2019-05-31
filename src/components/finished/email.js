import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Link } from "react-router-dom";

import * as actions from "../../actions/actions";
import * as async from "../../actions/async";

import Header from '../header';
import Footer from '../footer';

class Email extends Component {
    componentWillMount() {
        let { userData } = this.props.databaseReducer;
        this.setState({email: userData.email});
        // store user input data in db if window closed / changed
        window.onbeforeunload = this.handleAppClose;

    }

    handleAppClose = (ev) => {
        let {userId, userData} = this.props.databaseReducer;
        this.props.updateUser(userId, this.updatedUserData(userData));
    };


    updatedUserData = (userData) => {
        userData.email= this.state.email;
        return userData;
    };


    submitData = () => {
        let {userId, userData} = this.props.databaseReducer;
        this.props.updateUser(userId, this.updatedUserData(userData));
        this.props.setFinishedText("Groovy! I've added you to my email list. Thanks again for your feedback!");
    };

    // update db before close
    componentWillUnmount = () => {
        // cleanup listener
        window.removeEventListener('onbeforeunload', this.handleAppClose);
    };

    handleInput = (e) => {
        switch(e.target.id) {
            case "email":
                this.setState({
                    email: e.target.value
                });
                break;
            default:
        }
    };


    isEmail = (email) => {
        // eslint-disable-next-line
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    render = () => {
        let {emailText} = this.props.sessionReducer;
        let submitEnabled = this.isEmail(this.state.email);

        return <div className="main">
            <Header/>
            <div className="finished_wrapper">
                <p className="fin_text">
                    {emailText}
                    <br/><br/>
                    Would you like to know when my next album is out? Just enter an email address below.
                </p>
                <div className="input-group final">
                    <input className="capture_info" type="email" id="email" placeholder="Email Address" onChange={this.handleInput} value={this.state.email}/>
                </div>
                <div className="final spacer">
                <Link to="/finished">
                    <button className="front fin" disabled={!submitEnabled} onClick={this.submitData}>Yes please!</button>
                </Link>
                <Link to="/finished">
                    <button className="front fin">No thanks.</button>
                </Link>
                </div>
            </div>
            <Footer/>
        </div>
    }
}

const mapStateToProps = (store) => {
    return store;
};

const mapDispatcherToProps = (dispatch) => {
    return {
        updateUser: (userId, userData) => {
            dispatch(async.updateUser(userId, userData))
        },
        setFinishedText: (text) => {
            dispatch(actions.setFinishedText(text))
        }
    }
};

export default connect(mapStateToProps, mapDispatcherToProps)(Email)
