import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../css/App.css';

import Playlist from "./playlist";
import Notes from "./notes";
import MediaQuery from 'react-responsive';
import Welcome from './welcome';
import Walkthrough from './walkthrough';
import UserWrapper from "./user-wrapper";
import TutorialCheck from "./tutorial-check";
import FinishedPlaylist from './finished/playlist';
import Loading from "./loading";

import * as util from "../util";
import * as config from "../config";
import Player from "./player";

import Header from './header';
import Footer from './footer';
import * as actions from "../actions/actions";

import * as database from "../database";

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showAddNotes: false
        }
    }

    componentWillMount = () => {
        database.init();
    };

    showAddNotes = () => {
        this.setState({showAddNotes: true});
    };

    closeAddNotes = () => {
        this.props.resetAutoplay();
        this.setState({showAddNotes: false});
    };

    render = () => {
        let {showSplash, runWalkthrough, loading} = this.props.sessionReducer;
        let {userData} = this.props.databaseReducer;
        let allTrackRated = util.isAllTracksRated(userData);
        let {showAddNotes} = this.state;

        if (loading) {
            return <Loading/>
        }

        if (showSplash) {
            return <Welcome/>
        } else {
            return (
                <UserWrapper>
                    {userData.offerWalkthrough && <TutorialCheck/>}
                    {runWalkthrough && <Walkthrough/>}
                    <div className="main">
                        <MediaQuery minWidth={config.mobileWidth}>
                            {(matches) => {
                                if (matches) {
                                    // desktop web version
                                    return (
                                        <div>
                                            <Header/>
                                            <div className="playlist_wrapper">

                                                <Player {...this.props}/>

                                                <div className="notes_wrapper">
                                                    {config.numTracks > 1 && <Playlist {...this.props}/>}
                                                    <Notes {...this.props}/>
                                                    <br/>
                                                    {allTrackRated && <FinishedPlaylist {...this.props}/>}
                                                </div>
                                            </div>
                                            <Footer/>
                                        </div>
                                    )
                                } else {
                                    return (<div>
                                        {showAddNotes && <div className="overlay showAddNotes">
                                            <Notes {...this.props}/>
                                            <button type="button" className="front fin mobile_button"
                                                    onClick={this.closeAddNotes}>
                                                Add and Close
                                            </button>
                                        </div>
                                        }
                                        <Header/>
                                        <Player {...this.props}/>
                                        <br/>
                                        <button type="button" id="special_button"
                                                className="front mobile_button note-button-step"
                                                onClick={this.showAddNotes}>
                                            Add Notes
                                        </button>
                                        {allTrackRated && <FinishedPlaylist {...this.props}/>}
                                        <Footer/>
                                    </div>)
                                }
                            }
                            }
                        </MediaQuery>
                    </div>
                </UserWrapper>
            )
        }
    }
}

const mapDispatcherToProps = (dispatch) => {
    return {
        resetAutoplay: () => {
            dispatch(actions.autoPlay(config.autoPlay));
        }
    }
};

const mapStateToProps = (store) => {
    return store
};

export default connect(mapStateToProps, mapDispatcherToProps)(Main)

