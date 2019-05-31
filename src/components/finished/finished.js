import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";

import * as async from "../../actions/async";
import * as actions from "../../actions/actions";
import * as config from "../../config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faGithub, faInstagram, faSpotify, faSoundcloud } from '@fortawesome/free-brands-svg-icons'

import '../../css/App.css';

import Header from '../header';
import Footer from '../footer';

class Finished extends Component {

    fetchMoreTracks = () => {
        let {userId, userData} = this.props.databaseReducer;
        userData.finished = false;
        this.props.resetPlaylist(userId, userData)
    };

    render = () => {
        let {finishedText} = this.props.sessionReducer;

        return <div className="main">
            <Header/>
            <div className="finished_wrapper final">
                <p className="fin_text">
                    {finishedText}
                </p>
                <div className="final">
                    <Link to="/" onClick={this.fetchMoreTracks}>
                        <button className="front fin">More Tracks!</button>
                    </Link>
                    <a href="http://www.generalfuzz.net">
                        <button className="front fin">All Done</button>
                    </a>
                </div>
            </div>
            <div className="social_media_container">
                {config.social_media.spotify &&
                <a href={config.social_media.spotify}><FontAwesomeIcon icon={faSpotify} size="3x" className="social_media"/></a>}
                {config.social_media.facebook &&
                <a href={config.social_media.facebook}><FontAwesomeIcon icon={faFacebook} size="3x" className="social_media"/></a>}
                {config.social_media.insta &&
                <a href={config.social_media.insta}><FontAwesomeIcon icon={faInstagram} size="3x" className="social_media"/></a>}
                {config.social_media.github &&
                <a href={config.social_media.github}><FontAwesomeIcon icon={faGithub} size="3x" className="social_media"/></a>}
                {config.social_media.soundcloud &&
                <a href={config.social_media.soundcloud}><FontAwesomeIcon icon={faSoundcloud} size="3x" className="social_media"/></a>}
                {config.social_media.twitter &&
                <a href={config.social_media.twitter}><FontAwesomeIcon icon={faTwitter} size="3x" className="social_media"/></a>}
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
        resetPlaylist: (userId, userData) => {
            dispatch(actions.updateUser(userId, userData));
            dispatch(async.refreshPlaylist(userId, userData));
        }
    }
};

export default connect(mapStateToProps, mapDispatcherToProps)(Finished)
