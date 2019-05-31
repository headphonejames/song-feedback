import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../../css/App.css';
import {Link} from "react-router-dom";
import MediaQuery from 'react-responsive';

import * as async from "../../actions/async";
import * as config from "../../config";
import * as actions from "../../actions/actions";
import * as util from "../../util";

class FinishedPlaylist extends Component {
    finished = () => {
        let {userId, userData} = this.props.databaseReducer;
        userData.finished = true;
        this.props.updateUser(userId, userData);
    };

    moretracks = () => {
        let {userId, userData} = this.props.databaseReducer;
        let currentTrack = util.currentTrackData(userData);
        this.props.stopPlaying(currentTrack.id);
        this.props.resetPlaylist(userId, userData)
    };

    componentDidMount = () => {
        this.props.cancelAutoplayTimer();
    };


    render = () => {
        return <MediaQuery minWidth={config.mobileWidth}>
            {(matches) => {
                if (matches) {
                    // desktop web version
                    return (<div>
                            <button id="more_tracks" type="button"
                                    className="front fin sixth-step moretracks"
                                    onClick={this.moretracks}>
                                More Tracks
                            </button>
                            <Link to="/finished-poll">
                                <button id="all_done" type="button"
                                        className="front fin fifth-step alldone"
                                        onClick={this.finished}>
                                    All Done
                                </button>
                            </Link>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <button id="more_tracks" type="button"
                                    className="front mobile_button fin moretracks"
                                    onClick={this.moretracks}>
                                More Tracks
                            </button>
                            <Link to="/finished-poll">
                                <button id="all_done" type="button"
                                        className="front mobile_button fin alldone"
                                        onClick={this.finished}>
                                    All Done
                                </button>
                            </Link>
                        </div>
                    )
                }
            }
            }
        </MediaQuery>;
    }
}


const mapStateToProps = (store) => {
    return store
};

const mapDispatcherToProps = (dispatch) => {
    return {
        updateUser: (userId, userData) => {
            dispatch(async.updateUser(userId, userData));
            // close any modals that could be open
            dispatch(actions.unratedTrackModal(false));
        },
        resetPlaylist: (userId, userData) => {
            // close any modals that could be open
            dispatch(actions.unratedTrackModal(false));
            // refresh playlist
            dispatch(async.refreshPlaylist(userId, userData));

        },
        cancelAutoplayTimer: () => {
            dispatch(actions.autoPlayTimer(false));
        },
        stopPlaying: (track) => {
            dispatch(actions.setPlaying(false, track))
        },

    }
};

export default connect(mapStateToProps, mapDispatcherToProps)(FinishedPlaylist)

