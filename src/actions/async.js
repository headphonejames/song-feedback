import * as database from "../database";
import * as actions from "./actions";
import * as util from "../util";
import * as config from "../config";
import * as aws from "../aws-obj";

import {v4} from "public-ip";
import * as constants from "../constants";

// private functions
const internal_set_user = async (userId, userData, dispatch) => {
    let updatedUserData = await update_user_urls(userId, userData, dispatch);
    let currentTrack = util.currentTrackData(updatedUserData);
    dispatch(actions.setTrack(currentTrack));
};

const update_user_urls = async (userId, userData, dispatch) => {
    let updatedUserData = await aws.generateUrls(userData);
    dispatch(actions.updateUser(userId, updatedUserData));
    return updatedUserData;
};

const internal_create_user = async (userId, dispatch) => {
    let ip = await v4();
    let userData = {
        currentTrackIndex: 0,
        timeStamp: Date.now(),
        ratings: {},
        filterTracks: [],
        address: "",
        email: "",
        notes: "",
        clickedWelcome: false,
        offerWalkthrough: config.showWalkthrough,
        finished: false,
        name: "",
        cityStateZip: "",
        ip: ip,
        pollData: {other: "", checked: []}
    };
    await update_user_playlist(userId, userData, dispatch);
    dispatch(actions.showSplashPage(config.showSplashPage));
};

export const update_user_playlist = async (userId, userData, dispatch) => {
    let updatedUserData = await generate_playlist(userData);
    //save user to DB
    await database.update_user(userId, updatedUserData);
    await internal_set_user(userId, updatedUserData, dispatch);
};

const updateListenTime = (userData, trackId, listenTime) => {
    const oldListenTime = userData.ratings[trackId].listenTime;
    if (oldListenTime !== undefined) {
        return oldListenTime + listenTime;
    }
    return listenTime;
};

// external functions
export const stopThenFetchTrack = (userId, userData, trackId, track, listenTime, newIndex) => {
    return async dispatch => {
        // dispatch stopped playing action
        dispatch(actions.setPlaying(false, track));
        // update total listen time
        userData.ratings[trackId].listenTime = updateListenTime(userData, trackId, listenTime);
        // update userdata track index
        userData.currentTrackIndex = newIndex;
        // get the new track
        let newTrack = userData.playlist[newIndex];
        // update note
        dispatch(actions.setNote(userData.ratings[newTrack.id].notes));
        // update database
        await database.update_user(userId, userData);
        // update components with new track
        dispatch(actions.setTrack(newTrack));
        // update user data
        dispatch(actions.updateUser(userId, userData));
        // tell player to play
        dispatch(actions.setPlaying(true, newTrack));
    }
};

const getCount = (counts, id) => {
    for (let countIndex in counts) {
        if (counts[countIndex].id === id) {
            return counts[countIndex].trackRating;
        }
    }
};

export const generate_playlist = async (userData) => {
    // first create playlist
    let tracks = await database.getTracks();
    let counts = await database.getCounts();

    // sort by most listened to
    tracks = tracks.sort((track1, track2) => {
        return getCount(counts, track2.id) - getCount(counts, track1.id);
    });

    // filter out the tracks already listened to
    let availableTracks = tracks.filter(value => {
        return !userData.filterTracks.includes(value.id);
    });

    let playlist = [];
    let tracksLeft = config.numTracks;

    // if there are not enough tracks, add whats left and then reset filter tracks
    if (availableTracks.length < config.numTracks) {
        for (let i = 0; i < availableTracks.length; i++) {
            let trackId = availableTracks[i].id;
            let playlistData = tracks[trackId];
            // used to demark repeating a track that has already been rated
            playlistData[constants.listenedTo] = false;
            playlist.push(playlistData);
        }
        tracksLeft -= availableTracks.length;

        // remove the added tracks from the available list
        availableTracks = tracks.filter(value => {
            return !availableTracks.includes(value);
        });

        // reset filters and track list
        userData.filterTracks = [];
    }

    // make a playlist from least listened to tracks
    for (let i = 0; i < tracksLeft; i++) {
        let playlistData = availableTracks.pop();
        playlistData[constants.listenedTo] = false;
        playlist.push(playlistData);
    }

    // add it to user data
    userData.playlist = playlist;

    // initialize ratings if needed
    if (!("ratings" in userData)) {
        userData.ratings = {};
    }

    for (let i = 0; i < playlist.length; i++) {
        let trackId = playlist[i].id;
        if (!(trackId in userData.ratings)) {
            userData.ratings[trackId] =
                {
                    timeStamp: 0,
                    listenTime: 0,
                    timeInSongWhenRated: 0,
                    rating: 0,
                    notes: ""
                }
        }
    }

    return userData;
};


export const getTrackFromPlaylist = (userId, userData, index) => {
    return async dispatch => {
        // get the new track
        let track = userData.playlist[index];
        // update userdata track index
        userData.currentTrackIndex = index;
        // update note
        dispatch(actions.setNote(userData.ratings[track.id].notes));
        // update database
        // update components with new track
        dispatch(actions.setTrack(track));
        await database.update_user(userId, userData);
    }
};

// async actions
export const createUser = (userId) => {
    return async dispatch => {
        await internal_create_user(userId, dispatch);
    }
};

const fetchUserAsync = async (userId, dispatch) => {
    let userData = await database.fetch_user(userId);
    if (userData) {
        await internal_set_user(userId, userData, dispatch)
    } else {
        await internal_create_user(userId, dispatch);
    }
};

export const savePollData = (userData, pollData) => {
    return async dispatch => {
        await database.save_poll_data(userData.pollData, pollData);
        const updatedUserData = Object.assign({}, userData, { pollData: pollData });
        await database.update_user(userData.id, updatedUserData);
        dispatch(actions.updateUser(userData.id, updatedUserData));
    }
};

export const fetchUser = (userId) => {
    return dispatch => {
        return fetchUserAsync(userId, dispatch);
    }
};

export const refreshUserUrls = (userId, userData) => {
    return dispatch => {
        return update_user_urls(userId, userData, dispatch);
    }
};

export const pushRatingtoDB = (userId, userData, trackId, rating, timeInSongWhenRated, listenTime) => {
    return async dispatch => {
        let timeStamp = Date.now();
        let ratingData = userData.ratings[trackId];
        ratingData.timeInSongWhenRated = timeInSongWhenRated;
        ratingData.timeStamp = timeStamp;
        ratingData.rating = rating;
        ratingData.listenTime = listenTime;
        dispatch(actions.updateUser(userId, userData));
        await database.set_rating(userId, trackId, ratingData);
        // disable offering walkthough on subsequent visits
        if (userData.offerWalkthrough) {
            userData.offerWalkthrough = false;
            // update database
            await database.update_user(userId, userData);
        }
    }
};

export const stoppedPlaying = (userId, userData, trackId, track, listenTime) => {
    return async dispatch => {
        // dispatch stopped playing action
        dispatch(actions.setPlaying(false, track));
        // update total listen time
        // update user data
        const newListenTime = updateListenTime(userData, trackId, listenTime);
        userData.ratings[trackId].listenTime = newListenTime;
        dispatch(actions.updateUser(userId, userData));
        // update database
        await database.update_track_listen_time(userId, trackId, newListenTime, userData.ratings[trackId]);

    }
};

export const refreshPlaylist = (userId, userData) => {
    return async dispatch => {
        dispatch(actions.setLoading(true));
        if (!('filterTracks' in userData)) {
            userData.filterTracks = [];
        }
        // first update filter track list
        Object.keys(userData.playlist).forEach((trackId) => {
            userData.filterTracks.push(userData.playlist[trackId].id);
        });
        // update userdata track index
        userData.currentTrackIndex = 0;

        await update_user_playlist(userId, userData, dispatch);
        dispatch(actions.setNote(util.getCurrentNote(userData)));
        dispatch(actions.setLoading(false));
        if (config.autoPlay) {
            dispatch(actions.autoPlayTimer(true));
            dispatch(actions.setPlaying(true, util.currentTrackData(userData)));
        }
    }
};

export const updateUser = (userId, userData) => {
    return async dispatch => {
        // update database
        await database.update_user(userId, userData);
        // update user data
        dispatch(actions.updateUser(userId, userData));
    }
};

// reward count code
export const fetchRewardCounts = () => {
    return async dispatch => {
        let counts = await database.fetch_reward_counts();
        if (counts) {
            dispatch(actions.setRewardCount(counts));
        }
    }
};

export const trackRewardGiven = () => {
    return async dispatch => {
        await database.increment_reward_count();
    }
};


// used to update duration of track
export const updateTrack = (track) => {
    return async dispatch => {
        await database.set_track(track);
    }
};