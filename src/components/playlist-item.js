import React, {Component} from 'react';
import { connect } from 'react-redux';
import '../css/App.css';
import * as async from "../actions/async";
import * as util from "../util";
import * as actions from "../actions/actions";

let Rating = require('react-rating');

class PlaylistItem extends Component {


    isPlaying = () => {
        let {playing} = this.props.trackReducer;
        return playing !== undefined && playing;
    };

    changeTrack = () => {
        let { userData, userId } = this.props.databaseReducer;
        let { startTime } = this.props.trackReducer;
        let currentTrack = util.currentTrackData(userData);

        // check if current track
        let {track} = this.props;
        if (currentTrack.id !== track.id) {
            // update state that current track is finished playing
            if (this.isPlaying()) {
                const listenTime = util.calculateListenTime(startTime);
                this.props.stopThenFetchTrack(userId, userData, currentTrack.id, currentTrack, listenTime, this.props.pl_index);
            } else {
                this.props.fetchTrack(userId, userData, this.props.pl_index);
            }
        }
    };

    render = () => {
        let { userData} = this.props.databaseReducer;
        let currentTrack = util.currentTrackData(userData);
        let {track} = this.props;

        let rateValue = 0;

        if (userData !== undefined && userData.ratings !== undefined) {
            let trackId = track.id;
            if (trackId in userData.ratings) {
                let ratingData = userData.ratings[trackId];
                rateValue = ratingData.rating;
            }
        }
        let itemClass = "list";
        if (currentTrack.id === track.id) {
            itemClass += " active";
        }

        return <a className={itemClass} onClick={this.changeTrack} href={"#"}>
            <div>
                <span className="playlist-title">{track.id}</span>
                <span className="playlist-rating pull-right">
                    {   <Rating empty="glyphicon glyphicon-star-empty inactive" full="glyphicon glyphicon-star inactive" readonly={false} initialRate={ rateValue } onChange={(value) => {util.setNewRating(value, this.props)}}/>
                    }
                </span>
            </div>
        </a>
    }
}

const mapStateToProps = (store) => {
    return store;
};

// store history of ratings?
const mapDispatcherToProps = (dispatch) => {
    return {
        stopThenFetchTrack: (userId, userData, trackId, track, listenTime, newIndex) => {
            dispatch(async.stopThenFetchTrack(userId, userData, trackId, track, listenTime, newIndex));
        },
        fetchTrack: (userId, userData, newIndex) => {
            dispatch(async.getTrackFromPlaylist(userId, userData, newIndex));
        },
        setRating: (userId, userData, trackId, rating, timeInSongWhenRated, listenTime) => {
            dispatch(async.pushRatingtoDB(userId, userData, trackId, rating, timeInSongWhenRated, listenTime))
        },
        setRatingWarning: (isEnabled) => {
            dispatch(actions.setRatingWarning(isEnabled));
        }
    }
};

export default connect(mapStateToProps, mapDispatcherToProps)(PlaylistItem)

