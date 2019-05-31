import * as actions from "./actions/actions";
import * as constants from "../constants";
import * as config from "../config";
import * as mainDb from "../aws-db";
import * as db from "./aws-db";
import * as mainDatabaseHelper from "../database";
import * as util from "../util";

export const init = () => {
    db.init();
};

export const createTables = async () => {
    let tables = [];
    tables.push(db.createTableIfNotExist(constants.tracks_path));
    tables.push(db.createTableIfNotExist(constants.users_path));
    tables.push(db.createTableIfNotExist(constants.counts_path));
    tables.push(db.createTableIfNotExist(constants.ratings_path));
    // for poll at end
    tables.push(db.createTableIfNotExist(constants.poll_path));
    tables.push(db.createTableIfNotExist(constants.poll_other_path));

    return await Promise.all(tables);
};

// admin methods
export const fetch_db_data = async (dispatch) => {
    await fetch_tracks_data(dispatch);
    await fetch_ratings_data(dispatch);
    await fetch_users_data(dispatch);
    await fetch_poll_data(dispatch);
};

export const fetch_tracks_data = async (dispatch) => {
    let tracks = await mainDb.getItems(constants.tracks_path);
    dispatch(actions.updateTracks(tracks));
};

export const fetch_ratings_data = async (dispatch) => {
    let ratings = await mainDb.getItems(constants.ratings_path);
    dispatch(actions.updateRatings(ratings));
};

export const fetch_poll_data = async (dispatch) => {
    let poll = await mainDb.getItems(constants.poll_path);
    let pollOther = await mainDb.getItems(constants.poll_other_path);
    dispatch(actions.updatePoll(poll, pollOther));
};

export const fetch_users_data = async (dispatch) => {
    let users = await mainDb.getItems(constants.users_path);
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
    return db.putItem(track, constants.tracks_path);
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
    await db.putItem(counts, constants.counts_path);
};

export const initGlobalCounts = async () => {
    await db.putItem(
        {
            id: constants.reward_count,
            count: 0
        }, constants.counts_path);
};

export const initPollData = async () => {
    // add in each answer
    await config.poll_options.forEach(async (answer, i) => {
        if (answer !== config.poll_other) {
            await db.putItem({
                id: answer,
                count: 0,
            }, constants.poll_path);
        }
    });
    // add "other" table for poll answers
    await db.putItem({
        id: config.poll_other,
        answers: []
    }, constants.poll_other_path);
};

export const deleteUser = async  (userId) => {
    let user = await mainDatabaseHelper.fetch_user(userId);
    let userRatings = user[constants.ratings_path];
    // delete any rating data for the user
    Object.keys(userRatings).forEach(async (trackId) => {
        let trackRating = await mainDb.getItem(constants.ratings_path, trackId);
        delete trackRating[userId];
        await mainDb.setItem(constants.ratings_path, trackId, trackRating)
    });

    await db.deleteItem(userId, constants.users_path);
};

export const deleteNote = async (userId, trackId) => {
    // delete in two places
    let expr = "SET ratings.#trackId.notes = :val";
    let exprNames = {"#trackId": trackId};
    let exprValues = {":val" : util.EMPTY_STR};
    await mainDb.updateItem(constants.users_path, userId, expr, exprNames, exprValues, null);

    expr = "SET #userId.notes = :val";
    exprNames = {"#userId": userId};
    await mainDb.updateItem(constants.ratings_path, trackId, expr, exprNames, exprValues, null);
};