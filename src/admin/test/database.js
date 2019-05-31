import * as actions from "../actions/actions";
import * as constants from "../../constants";
import * as config from "../../config";
import * as db from "../../test/local-db";
import * as mainDatabaseHelper from "../../test/database";

export const init = () => {
    db.init();
};

export const createTables = async () => {
    db.init();
};

// admin methods
export const fetch_db_data = async (dispatch) => {
    await fetch_tracks_data(dispatch);
    await fetch_ratings_data(dispatch);
    await fetch_users_data(dispatch);
    await fetch_poll_data(dispatch);
};

export const fetch_tracks_data = async (dispatch) => {
    let tracks = await db.getItems(constants.tracks_path);
    dispatch(actions.updateTracks(tracks));
};

export const fetch_ratings_data = async (dispatch) => {
    let ratings = await db.getItems(constants.ratings_path);
    dispatch(actions.updateRatings(ratings));
};

export const fetch_poll_data = async (dispatch) => {
    let poll = await db.getItems(constants.poll_path);
    let pollOther = await db.getItems(constants.poll_other_path);
    dispatch(actions.updatePoll(poll, pollOther));
};

export const fetch_users_data = async (dispatch) => {
    let users = await db.getItems(constants.users_path);
    dispatch(actions.updateUsers(users));
};

export const createTrack = (song, img, filename) => {
    let track = {
        id: song,
        duration: 0,
        filename: filename,
        timestamp: Date.now().toString(),
        image: img,
        title: song
    };
    return db.setItem(track, song, constants.tracks_path);
};

export const getTracks = () => {
    return db.getItems(constants.tracks_path);
};


export const deleteTrack = (track) => {
    return db.deleteItem(track.id, constants.tracks_path);
};

export const deleteCount = (track) => {
    return db.deleteItem(track.id, constants.counts_path);
};

export const initCounts = async (trackId) => {
    let counts = {id: trackId};
    counts[constants.tracks_rating_count] = 0;
    counts[constants.tracks_stop_count] = 0;
    await db.setItem(constants.counts_path, trackId, counts);
};

export const initGlobalCounts = async () => {
    let data = {
        id: constants.reward_count,
        count: 0
    };
    await db.setItem(constants.counts_path, constants.reward_count, data);
};

export const initPollData = async () => {
    // add in each answer
    await config.poll_options.forEach(async (answer, i) => {
        if (answer !== config.poll_other) {
            let data = {
                id: answer,
                count: 0,
            };
            await db.setItem(constants.poll_path, answer, data);
        }
    });
    // add "other" table for poll answers
    let other_data = {
        id: config.poll_other,
        answers: []
    };
    await db.setItem(constants.poll_other_path, config.poll_other, other_data);
};

export const deleteUser = async  (userId) => {
    let user = await mainDatabaseHelper.fetch_user(userId);
    let userRatings = user[constants.ratings_path];
    // delete any rating data for the user
    Object.keys(userRatings).forEach(async (trackId) => {
        let trackRating = await db.getItem(constants.ratings_path, trackId);
        db.deleteItem(userId, constants.ratings_path)
    });

    await db.deleteItem(userId, constants.users_path);
};

export const deleteNote = async (userId, trackId) => {
    let userData = await db.getItem(constants.users_path, userId);
    userData[constants.ratings_path][trackId]["notes"] = "";
    await db.setItem(constants.users_path, userId, userData);

    let ratingData = await db.getItem(constants.ratings_path, trackId);
    ratingData[userId]["notes"] = "";
    await db.setItem(constants.ratings_path, trackId, ratingData);

    // await db.updateItem(constants.users_path, userId, )
    // // delete in two places
    // let expr = "SET ratings.#trackId.notes = :val";
    // let exprNames = {"#trackId": trackId};
    // let exprValues = {":val" : mainDb.EMPTY_STR};
    //
    // await db.updateItem(constants.users_path, userId, expr, exprNames, exprValues, null);
    //
    // expr = "SET #userId.notes = :val";
    // exprNames = {"#userId": userId};
    // await db.updateItem(constants.ratings_path, trackId, expr, exprNames, exprValues, null);
};