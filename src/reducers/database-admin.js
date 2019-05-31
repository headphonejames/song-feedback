import * as constants from "../constants";

// initial state
const initialState = {tracks: {}, ratings: {}, action: "", display: false};

export default function databaseAdminReducer(state=initialState, action=null) {
    switch (action.type) {
        // admin action to create tracks
        case constants.UPDATE_TRACKS:
            return Object.assign({}, state,
                {
                    tracks: action.tracks
                }
            );
        case constants.UPDATE_RATINGS:
            return Object.assign({}, state,
                {
                    ratings: action.ratings
                }
            );
        case constants.UPDATE_POLL:
            return Object.assign({}, state,
                {
                    poll: action.poll,
                    pollOther: action.pollOther
                }
            );
        case constants.UPDATE_USERS:
            return Object.assign({}, state,
                {
                    users: action.users
                }
            );
        case constants.ACTION_FINISHED:
            return Object.assign({}, state,
                {
                    action: action.action,
                    display: action.display
                }
            );

        default:
            return state;
    }
};
