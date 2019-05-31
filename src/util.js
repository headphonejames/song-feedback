import * as config from "./config";

export const currentTrackData = (userData) => {
    return userData.playlist[userData.currentTrackIndex];
};

export const setCurrentTrackData = (userData, track) => {
    return userData.playlist[userData.currentTrackIndex] = track;
};

export const getTrackId = (userData) => {
    return currentTrackData(userData).id;
};

export const getUserTrackRatingData = (userData) => {
    let trackId = getTrackId(userData);
    return userData.ratings[trackId];
};

export const getCurrentNote = (userData) => {
    let track = userData.playlist[userData.currentTrackIndex];
    return userData.ratings[track.id].notes;
};

export const isAllTracksRated = (userData) => {
    for (let ratingIndex in userData.ratings) {
        if (userData.ratings.hasOwnProperty(ratingIndex)) {
            let trackData = userData.ratings[ratingIndex];
            if (isUnrated(trackData)) {
                return false;
            }
        }
    }
    return true;
};

export const getTimeStr = (millis) => {
    let millisDate = new Date(millis);
    let str = millisDate.getMinutes() + ":";
    if (millisDate.getSeconds() < 10) {
        str += "0"
    }
    str += millisDate.getSeconds();
    return str;
};

export const endsWithAny = (str, suffixes) => {
    for (let suffix of suffixes) {
        if(str.endsWith(suffix))
            return true;
    }
    return false;
};

export const removeExt = (filename) => {
    return filename.replace(/\.[^/.]+$/, "");
};

export const verifyObjectPopulated = (obj) => {
    return (obj !== undefined && obj !== {} && Object.keys(obj).length > 0)
};

export const setNewRating = (ratingValue, props) => {
    let {userId, userData} = props.databaseReducer;
    let {playing, startTime, player} = props.trackReducer;
    let {isRatingWarningEnabled} = props.sessionReducer;
    let trackId = getTrackId(userData);

    // if not playing, use track total listen time
    let listenTime = getUserTrackRatingData(userData).listenTime;
    // if playing, append to current time
    if (playing && listenTime !== undefined && startTime !== undefined && startTime > 0) {
        listenTime += Date.now() - startTime;
    }

    let timeInSongWhenRated = 0;
    if (player !== null) {
        timeInSongWhenRated = Math.round(player.getCurrentTime() * 1000);
    }

    if (listenTime > config.millisToWaitBeforeRatingEnabled) {
        props.setRating(userId, userData, trackId, ratingValue, timeInSongWhenRated, listenTime);
    } else {
        props.setRatingWarning(true);
        if (!isRatingWarningEnabled) {
            setTimeout(() => {
                props.setRatingWarning(false);
            }, config.ratingWarningDisplayTime);
        }
    }
};

export const findtrack = (trackDB, id) => {
    for (let trackIndex in trackDB) {
        if (trackDB.hasOwnProperty(trackIndex)) {
            let track = trackDB[trackIndex];

            if (track.id === id) {
                return track
            }
        }
    }
    return null;
};

export const getTableName = name => {
    return config.db_root ? config.db_root + "-" + name : name;
};

export const getObjFromList = (arr, id) => {
    return arr.reduce((accumulator, obj) => {if (obj.id === id) { return obj } else {return accumulator}}, {});
};

export const isUnrated = (track) => {
    return (track.rating === undefined) || (track.rating === 0);
};

export const leftNote = (rating) => {
    return (rating.notes !== undefined) && (rating.notes !== "");
};

export const calculateListenTime = (startTime) => {
    if (startTime !== undefined && startTime > 0) {
        return Date.now() - startTime;
    }
    return 0;
};

export const EMPTY_STR = " ";

const replaceInObj = (obj, find_str, replace_str) => {
    if (obj instanceof Array) {
        return obj.map(value => {
            if (typeof value === 'object') {
                return replaceInObj(value, find_str, replace_str);
            } else if (value === find_str) {
                return replace_str
            } else {
                return value
            }
        })
    } else {
        let newObj = {};
        Object.keys(obj).forEach(key => {
            if (obj[key] && typeof obj[key] === 'object') {
                newObj[key] = replaceInObj(obj[key], find_str, replace_str);
            } else if (obj[key] === find_str) {
                newObj[key] = replace_str
            } else {
                newObj[key] = obj[key];
            }
        });
        return newObj;
    }
};

export const decodeEmptyStr = (obj) => {
    return replaceInObj(obj, EMPTY_STR, "");
};

export const encodeEmptyStr = (obj) => {
    return replaceInObj(obj, "", EMPTY_STR);
};
