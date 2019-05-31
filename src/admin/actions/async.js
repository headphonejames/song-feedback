import * as database from "../database";
import * as config from "../../config";
import * as actions from "./actions";
import * as aws from "../../aws-obj";
import * as util from "../../util";
import * as constants from "../../constants";

export const loginAndFetchData = () => {
    return async dispatch => {
        await database.fetch_db_data(dispatch);
    }
};

const getImageName = (song, allImages) => {
    for (const ext of constants.image_extensions) {
        let fileName = song + ext;
        if (allImages.includes(fileName)) {
            return fileName
        }
    }
    return constants.defaultImgName;
};


export const updateTracksInDB = () => {
    return async dispatch => {
        try {
            dispatch(sendActionFinished("Beginning DB setup"));

            // first create tables if missing
            await database.createTables();
            // todo check for errors?
            let params = {
                Bucket: config.awsS3Bucket
            };
            let data = await aws.s3.listObjectsV2(params).promise();

            let contents = data.Contents;

            // create file names map
            let fileNames = contents.filter(
                value => {
                    return util.endsWithAny(value.Key.toLowerCase(), constants.song_extensions);
                }).map(value => {
                return value.Key
            });

            let songsFromBucket = fileNames.map(value => {
                return util.removeExt(value)
            });

            let allImages = contents.filter(
                value => {
                    return util.endsWithAny(value.Key.toLowerCase(), constants.image_extensions);
                }).map(value => {
                return value.Key
            });

            // clear out any stale data
            let tracks = await database.getTracks();
            let songsFromDb = {};
            if (tracks) {
                songsFromDb = tracks.Items;

                let promises = songsFromDb.map(async songFromDb => {
                    if (!songsFromBucket.includes(songFromDb.id)) {
                        // remove this track from db
                        await database.deleteTrack((songFromDb));
                        await database.deleteCount(songFromDb)
                    }
                });
                // create the db entries
                await Promise.all(promises);
            }

            let promises = songsFromBucket.map(async (song, index) => {
                if (!util.findtrack(songsFromDb, song)) {
                    let img = getImageName(song, allImages);
                    await database.createTrack(song, img, fileNames[index]);
                    await database.initCounts(song);
                }
            });
            await Promise.all(promises);
            await database.initGlobalCounts();
            await database.initPollData();
            dispatch(sendActionFinished("Updated tracks in DB"));
        } catch (err) {
            console.log(err, err.stack); // an error occurred
            dispatch(sendActionFinished("Error occured in DB setup: " + err));
        }
    }
};

export const sendActionFinished = (action) => {
    return dispatch => {
        dispatch(actions.actionFinished(true, action));
        setTimeout(() => {
            dispatch(actions.actionFinished(false, action));
        }, config.actionFinishedDisplayTime);
    }

};

export const deleteUser = (id) => {
    return async dispatch => {
        await database.deleteUser(id);
        dispatch(sendActionFinished("deleted user " + id));
    }
};

export const deleteNote = (userId, trackId, trackName, text) => {
    return async dispatch => {
        await database.deleteNote(userId, trackId);
        await database.fetch_db_data(dispatch);
        dispatch(sendActionFinished("deleted note for '" + trackName + "': '" + text + "'"));
    }
};

export const refreshData = () => {
    return async dispatch => {
        await database.fetch_db_data(dispatch);
    }
};