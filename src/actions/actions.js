import * as constants from "../constants";

// pure json for actions

export const updateUser = (userId, userData) => {
    return {
        type: constants.UPDATE_USER,
        userId: userId,
        userData: userData
    }
};

export const setTrack = (track) => {
    return {
        type: constants.SET_TRACK,
        track: track
    }
};

export const setPlayer = (player) => {
    return {
        type: constants.SET_PLAYER,
        player: player
    }
};

export const setPlaying = (playing, track) => {
    return {
        playing: playing,
        type: constants.SET_TRACK_PLAYING,
        track: track
    }
};

export const setRatingWarning = (isEnabled) => {
    return {
        type: constants.SET_RATING_WARNING,
        isEnabled: isEnabled,
        ratingTimestamp: Date.now()
    }
};

export const setSavedPrompt = (isEnabled) => {
    return {
        type: constants.SET_SAVED_PROMPT,
        isEnabled: isEnabled,
        timestamp: Date.now()
    }
};

// session actions
export const showSplashPage = (showSpash) => {
    return {
        type: constants.SPLASH_PAGE,
        showSplash: showSpash
    }
};

export const runWalkthrough = (runWalkthroughVal) => {
    return {
        type: constants.RUN_WALKTHROUGH,
        runWalkthrough: runWalkthroughVal
    }
};

export const unratedTrackModal = (unratedTrackModal) => {
    return {
        type: constants.UNRATED_TRACKS_MODAL,
        unratedTrackModal: unratedTrackModal
    }
};

export const autoPlayTimer = (autoPlayTimer) => {
    return {
        type: constants.AUTO_PLAY_TIMER,
        autoPlayTimer: autoPlayTimer
    }
};

export const autoPlay = (autoPlay) => {
    return {
        type: constants.AUTO_PLAY,
        autoPlay: autoPlay
    }
};

// UI actions
export const setEmailText = (text) => {
    return {
        type: constants.SET_EMAIL_TEXT,
        text: text
    }
};

export const setFinishedText = (text) => {
    return {
        type: constants.SET_FINISHED_TEXT,
        text: text
    }
};


export const setNote = (note) => {
    return {
        type: constants.SET_NOTE,
        note: note
    }
};

export const setRewardCount = (rewardCount) => {
    return {
        type: constants.UPDATE_REWARD_COUNT,
        rewardCount: rewardCount
    }
};

export const setLoading = (loading) => {
    return {
        type: constants.LOADING_DATA,
        loading: loading
    }
};
