import * as constants from "../../constants";

// pure json for actions

// admin actions
export const updateTracks = (tracks) => {
    return {
        type: constants.UPDATE_TRACKS,
        tracks: tracks
    }
};

export const updateRatings = (ratings) => {
    return {
        type: constants.UPDATE_RATINGS,
        ratings: ratings
    }
};

export const updatePoll = (poll, pollOther) => {
    return {
        type: constants.UPDATE_POLL,
        poll: poll,
        pollOther: pollOther
    }
};

export const updateUsers = (users) => {
    return {
        type: constants.UPDATE_USERS,
        users: users
    }
};

export const actionFinished = (display, action) => {
    return {
        type: constants.ACTION_FINISHED,
        display: display,
        action: action
    }
};
