// track constnats
export const UPDATE_USER = 'UPDATE_USER';
export const SET_TRACK = 'SET_TRACK';
export const SET_PLAYER = 'SET_PLAYER';
export const SET_TRACK_PLAYING = 'SET_TRACK_PLAYING';

// session constants
export const SPLASH_PAGE = 'SPLASH_PAGE';
export const LOADING_DATA = 'LOADING';
export const RUN_WALKTHROUGH = 'RUN_WALKTHROUGH';
export const SET_RATING_WARNING = 'SET_RATING_WARNING';
export const SET_SAVED_PROMPT = 'SET_SAVED_PROMPT';
export const UNRATED_TRACKS_MODAL = 'UNRATED_TRACKS_MODAL';
export const AUTO_PLAY_TIMER = 'AUTO_PLAY_TIMER';
export const AUTO_PLAY = 'AUTO_PLAY';

// global data constants
export const UPDATE_REWARD_COUNT = 'UPDATE_REWARD_COUNT';

// dynamic UI constants
export const SET_EMAIL_TEXT = 'SET_EMAIL_TEXT';
export const SET_FINISHED_TEXT = 'SET_FINISHED_TEXT';
// notes
export const SET_NOTE = 'SET_NOTE';


// play button states
export const PLAY = "play";
export const LOADING = "loading";
export const PAUSE = "pause";

// db path constants
export const users_path =  "users";
export const tracks_path =  "tracks";
export const ratings_path =  "ratings";
export const counts_path =  "counts";
export const poll_path =  "poll";
export const poll_other_path =  "poll-other";

export const reward_count = "reward";
export const tracks_rating_count = "trackRating";
export const tracks_stop_count = "trackStop";
export const notes = "notes";

// user field used to track which songs have to listened to - useful if all songs have been rated already, and now the users playlist needs to repeat tracks
export const listenedTo = "listenedTo";

//admin constants
export const UPDATE_TRACKS = 'UPDATE_TRACKS';
export const UPDATE_USERS = 'UPDATE_USERS';
export const UPDATE_POLL = 'UPDATE_POLL';
export const UPDATE_RATINGS = 'UPDATE_RATINGS';
export const ACTION_FINISHED = 'ACTION_FINISHED';

// invalid rating keys in database
export const invalidKeys = ["avgRating","totalListenTime", "avgListenTime", "avgTimeInSongWhenRated", "id"];

export const song_extensions = [".wav", ".mp3"];
export const image_extensions = [".jpg", ".gif", ".tif"];

export const defaultImgName = "default.jpg";
