import * as constants from "../constants";

const initialState = {
    playing: false,
    track: null,
    ratingEnabled: true,
    startTime: -1,
    url: "",
    player: null
};

export default function trackReducer(state = initialState, action = {type: "None"}) {
    switch (action.type) {
        case constants.SET_TRACK_PLAYING:
            // default to reset start time
            let startTime = -1;
            if (action.playing) {
                startTime = Date.now();
            }
            return Object.assign({}, state,
                {
                    playing: action.playing,
                    startTime: startTime
                }
            );
        case constants.SET_TRACK:
            return Object.assign({}, state,
                {
                    url: action.track.url,
                    track: action.track,
                    startTime: -1
                }
            );
        case constants.SET_PLAYER:
            return Object.assign({}, state,
                {
                    player: action.player
                }
            );
        default:
            return state;
    }
};

