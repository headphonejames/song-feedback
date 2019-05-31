import React, {Component} from 'react';
import { connect } from 'react-redux';
import '../css/App.css';
import { debounce } from "throttle-debounce";

import {CSSTransitionGroup} from 'react-transition-group'

import * as util from "../util";
import * as actions from "../actions/actions";
import * as config from "../config";
import * as async from "../actions/async";

class Notes extends Component {
    componentWillMount = () => {
        let {userData} = this.props.databaseReducer;
        this.props.getNote(userData);
        this.triggerSavedPromptDebounced = debounce(700, this.triggerSavedPrompt);
    };

    triggerSavedPrompt = () => {
        let {userData, userId } = this.props.databaseReducer;
        let {isSavedPromptEnabled, savedPromptTimestamp} = this.props.sessionReducer;
        let elapsedSinceLastPrompt = Date.now() - savedPromptTimestamp;
        if (!isSavedPromptEnabled && elapsedSinceLastPrompt > config.savedPromptDisplayTime) {
            this.props.setSavedPrompt(true);
            this.props.updateUser(userId, userData);
            setTimeout(() => {
                this.props.setSavedPrompt(false);
            }, config.savedPromptDisplayTime);
        }

    };

    handleInput = (e) => {
        let {userData, userId } = this.props.databaseReducer;
        let {autoPlay } = this.props.sessionReducer;
        switch(e.target.id) {
            case "note":
                if (autoPlay) {
                    this.props.cancelAutoplay();
                }
                this.props.setNote(userData, userId, e.target.value);
                this.triggerSavedPromptDebounced();
                break;
            default:
        }
    };

    render = () => {
        let {userData} = this.props.databaseReducer;
        let {note, isSavedPromptEnabled} = this.props.sessionReducer;

        let track = util.currentTrackData(userData);

        return (
            <div className="input-group fourth-step">
                <h3 className="notes_title">Additional feedback for: <br/><i>"{track.title}"</i></h3>
                <br/>
                <textarea type="text" className="input-lg" id="note" onChange={this.handleInput} value={note}/>
                <div className="saved-area">
                <CSSTransitionGroup
                    transitionName="saved"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                    transitionAppearTimeout={500}
                    transitionAppear={true}
                    transitionLeave={true}>
                    {isSavedPromptEnabled && (
                        <div key="saved-div">
                            <div className="saved">Saved</div>
                        </div>)}
                </CSSTransitionGroup>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    return store
};

const mapDispatcherToProps = (dispatch) => {
    return {
        setNote: (userData, userId, note) => {
            // get the current track
            let track = userData.playlist[userData.currentTrackIndex ];
            // update the user object notes for this track
            userData.ratings[track.id].notes = note;
            dispatch(actions.updateUser(userId, userData));
            dispatch(actions.setNote(note))
        },
        getNote: (userData) => {
            dispatch(actions.setNote(util.getCurrentNote(userData)))
        },
        cancelAutoplay: () => {
            dispatch(actions.autoPlay(false));
            dispatch(actions.autoPlayTimer(false));
        },
        updateUser: (userId, userData) => {
            dispatch(async.updateUser(userId, userData))
        },
        setSavedPrompt: (isEnabled) => {
            dispatch(actions.setSavedPrompt(isEnabled));
        }
    }
};

export default connect(mapStateToProps, mapDispatcherToProps)(Notes)

