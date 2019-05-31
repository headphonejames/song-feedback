import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Link } from "react-router-dom";

import * as async from "../../actions/async";
import * as actions from "../../actions/actions";

import Header from '../header';
import Footer from '../footer';

class Address extends Component {

    componentWillMount() {
        let { userData } = this.props.databaseReducer;
        this.setState({address: userData.address, name: userData.name, cityStateZip: userData.cityStateZip});
        // store user input data in db if window closed / changed
        window.onbeforeunload = this.handleAppClose;
    }


    handleAppClose = (ev) => {
        let {userId, userData} = this.props.databaseReducer;
        this.props.updateUser(userId, this.updatedUserData(userData));
    };

    // update db before close
    componentWillUnmount = () => {
        // cleanup listener
        window.removeEventListener('onbeforeunload', this.handleAppClose);
    };

    handleInput = (e) => {
        switch(e.target.id) {
            case "address":
                this.setState({
                    address: e.target.value
                });
                break;
            case "name":
                this.setState({
                    name: e.target.value
                });
                break;
            case "cityStateZip":
                this.setState({
                    cityStateZip: e.target.value
                });
                break;
            default:
        }
    };

    updatedUserData = (userData) => {
        userData.cityStateZip = this.state.cityStateZip;
        userData.address = this.state.address;
        userData.name = this.state.name;
        return userData;
    };

    submitData = () => {
        let {userId, userData} = this.props.databaseReducer;
        this.props.updateUser(userId, this.updatedUserData(userData));
        this.props.setEmailText("Great! Your magnet will be on the way soon.")
    };

    setNoThanksEmailText = () => {
        this.props.setEmailText("No worries!");
    };


    render = () => {
        // validate all the fields
        let submitEnabled = this.state.name.length > 1 && this.state.address.length > 1&& this.state.cityStateZip.length > 1;

        return <div className="main">
            <Header/>

            <div className="finished_wrapper final">
                <p className="fin_text">Great! I just need your name and a mailing address.</p>
            <div className="input-group final">
                <input className="capture_info" id="name" placeholder="Name" onChange={this.handleInput} value={this.state.name}/>
            </div>
            <div className="input-group final">
                <input className="capture_info" id="address" placeholder="Address" onChange={this.handleInput} value={this.state.address}/>
            </div>
            <div className="input-group final">
                <input className="capture_info" id="cityStateZip" placeholder="City, State, Zip" onChange={this.handleInput} value={this.state.cityStateZip}/>
            </div>
                <div className="spacer">
                <Link to="/finished-email">
                    <button className="front fin" disabled={!submitEnabled} onClick={this.submitData}>Submit</button>
                </Link>
                <Link to="/finished-email">
                    <button className="front fin" onClick={this.setNoThanksEmailText}>Nevermind</button>
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
            // count as a reward / magnet given out
            dispatch(async.trackRewardGiven());
            dispatch(async.updateUser(userId, userData))
        },
        setEmailText: (text) => {
            dispatch(actions.setEmailText(text))
        }
    }
};

export default connect(mapStateToProps, mapDispatcherToProps)(Address)
