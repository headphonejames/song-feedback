import React, {Component} from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';

import RatingComponent from "./rating";
import Notes from "./notes";
import FinishedPlaylist from './finished/playlist';

import * as actions from "../actions/actions";

import '../css/App.css';
import * as config from "../config";
import * as async from "../actions/async";
import * as util from "../util";

Modal.setAppElement('#root');

class RatingModal extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.state = {};
    }


    componentDidMount = () => {
        this.props.resetTimers();
        // initialize all state
        this.setState({
                timerStarted: Date.now(),
                interval: setInterval(() => {
                    // force refresh with set state
                    this.setState({currentTime: Date.now()});
                    if (this.calculateTimeleft() < 1) {
                        this.nextTrack();
                    }
                }, 500),
                timer: true,
                modalIsOpen: true
            }
        );
    };

    customStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },

        content: {
            top: '0%',
            left: '0%',
            right: 'auto',
            bottom: 'auto',
            // marginRight           : '-50%',
            // transform             : 'translate(-50%, -50%)',
            background: "#A682FF",
            opacity: '0.9',
            minHeight: '100%',
            minWidth: '100%',
            textAlign: 'center'
        }
    };

    closeModal() {
        this.stopInterval();
        this.props.removeModal();
        this.setState({modalIsOpen: false});
    }

    replayTrack = () => {
        let {userId, userData} = this.props.databaseReducer;
        this.closeModal();
        this.props.playTrack(userId, userData, userData.currentTrackIndex);
    };

    nextTrack = () => {
        let {userId, userData} = this.props.databaseReducer;
        this.closeModal();
        this.props.playTrack(userId, userData, this.props.nextTrackIndex);
    };

    stopInterval = () => {
        if ("interval" in this.state && this.state.interval !== undefined) {
            clearInterval(this.state.interval);
        }
        this.setState({interval: undefined});
    };

    calculateTimeleft = () => {
        return Math.floor(config.unratedModalWaitTime / 1000) - Math.floor((Date.now() - this.state.timerStarted) / 1000);
    };

    render() {
        let {autoPlayTimer} = this.props.sessionReducer;
        let {userData} = this.props.databaseReducer;

        let allTrackRated = util.isAllTracksRated(userData);

        if (!autoPlayTimer) {
            this.stopInterval();
            this.setState({timer: false});
            this.props.resetTimers();
        }

        // next track to be played
        let nextTrack = userData.playlist[this.props.nextTrackIndex].id;
        // track that was just played
        let currentTrack = userData.playlist[userData.currentTrackIndex].id;
        // generate a list of unrated tracks from current playlist
        let unratedTracks = [];
        for (let i in userData.playlist) {
            if (userData.playlist.hasOwnProperty(i)) {
                let trackId = userData.playlist[i].id;
                if (util.isUnrated(userData.ratings[trackId])) {
                    unratedTracks.push(trackId);
                }
            }
        }
        // check if next unrated track is actually same track
        if (!unratedTracks.includes(nextTrack)) {
            nextTrack = currentTrack;
        }

        return (
            <div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={this.customStyles}
                    contentLabel="RatingModal"
                    closeTimeoutMS={250}
                >
                    <div className="modalSpacer"/>
                    <Notes {...this.props}/>
                    <RatingComponent {...this.props} />
                    <br/>
                    {this.state.timer &&
                    <div className="modalTimerText"> {(currentTrack === nextTrack) ? (<span>same</span>) : (<span>next</span>)} track will auto
                        play in {this.calculateTimeleft()} seconds</div>
                    }
                    <div>
                        <br/>
                        <br/>
                        {(nextTrack === currentTrack) &&
                        <button className="front" onClick={() => {
                            this.replayTrack()
                        }}>Replay Track
                        </button>
                        }
                        {(unratedTracks.length > 1) && <span className="buttonSpacer"/>}
                        {(nextTrack !== currentTrack && unratedTracks.includes(nextTrack)) &&
                        (
                            <button className="front" onClick={() => {
                                this.nextTrack()
                            }}>Next track</button>
                        )}
                    </div>
                    {allTrackRated && <FinishedPlaylist {...this.props}/>}
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    return store;
};

const mapDispatcherToProps = (dispatch) => {
    return {
        removeModal: () => {
            // remove modal
            dispatch(actions.unratedTrackModal(false));
        },
        playTrack: (userId, userData, playlistIndex) => {
            dispatch(async.getTrackFromPlaylist(userId, userData, playlistIndex));
            dispatch(actions.setPlaying(true, util.currentTrackData(userData)));
        },
        resetTimers: () => {
            dispatch(actions.autoPlayTimer(true));
        }
    }
};

export default connect(mapStateToProps, mapDispatcherToProps)(RatingModal)
