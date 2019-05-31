import * as constants from "../constants";
import * as config from "../config";

// initial state - default values
const initialState = {
    showSplash: config.showSplashPage,
    emailText: "Thank you for rating my tracks!",
    finishedText: "Thank you for you feedback!",
    note: "",
    runWalkthrough: false,
    isRatingWarningEnabled: false,
    ratingTimestamp: 0,
    isSavedPromptEnabled: false,
    savedPromptTimestamp: 0,
    createdTimestamp: Date.now(),
    unratedTrackModal: false,
    autoPlayTimer: false,
    autoPlay: config.autoPlay,
    loading: false
};

export default function sessionReducer(state = initialState, action = {type: "None"}) {
    switch (action.type) {
        case constants.SPLASH_PAGE:
            return Object.assign({}, state,
                {
                    showSplash: action.showSplash,
                }
            );
        case constants.RUN_WALKTHROUGH:
            return Object.assign({}, state,
                {
                    runWalkthrough: action.runWalkthrough,
                }
            );
        case constants.SET_EMAIL_TEXT:
            return Object.assign({}, state,
                {
                    emailText: action.text
                }
            );
        case constants.SET_FINISHED_TEXT:
            return Object.assign({}, state,
                {
                    finishedText: action.text
                }
            );
        case constants.SET_NOTE:
            return Object.assign({}, state,
                {
                    note: action.note
                }
            );
        case constants.LOADING_DATA:
            return Object.assign({}, state,
                {
                    loading: action.loading
                }
            );
        case constants.SET_RATING_WARNING:
            return Object.assign({}, state,
                {
                    isRatingWarningEnabled: action.isEnabled,
                    ratingTimestamp: action.ratingTimestamp
                }
            );
        case constants.SET_SAVED_PROMPT:
            return Object.assign({}, state,
                {
                    isSavedPromptEnabled: action.isEnabled,
                    savedPromptTimestamp: action.timestamp
                }
            );
        case constants.UNRATED_TRACKS_MODAL:
            return Object.assign({}, state,
                {
                    unratedTrackModal: action.unratedTrackModal
                }
            );
        case constants.AUTO_PLAY_TIMER:
            return Object.assign({}, state,
                {
                    autoPlayTimer: action.autoPlayTimer
                }
            );
         case constants.AUTO_PLAY:
            return Object.assign({}, state,
                {
                    autoPlay: action.autoPlay
                }
            );
        default:
            return state;
    }
};

