import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import * as actions from "../../actions/actions";
import magnet from "../../images/magnet.jpg";
import '../../css/App.css';

import Header from '../header';
import Footer from '../footer';

class Reward extends Component {
    componentWillMount() {
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

    setEmailText = () => {
        this.props.setEmailText("No worries!")
    };


    render = () => {
        return <div className="main">
            <Header/>
            <div className="finished_wrapper final">
                <div className="magnet_left">
                    <img className="magnet" alt="MAGNET!" src={magnet}/>
                </div>
                <div className="magnet_right">
                    <p className="fin_text">
                        As a thank you, I would like to send you a General Fuzz magnet free of charge (if you live in USA)
                    </p>
                </div>
                <br /><br />
                <div className="final">
                    <Link to="/finished-address">
                        <button className="front fin">Yes please!</button>
                    </Link>
                    <Link to="/finished-email">
                        <button className="front fin" onClick={this.setEmailText}>No thanks.</button>
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
        setEmailText: (text) => {
            dispatch(actions.setEmailText(text))
        }
    }
};

export default connect(mapStateToProps, mapDispatcherToProps)(Reward)
