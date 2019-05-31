import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../css/App.css';
import * as async from "../actions/async";
import * as util from "../util";
import * as actions from "../actions/actions";

let Rating = require('react-rating');

class RatingComponent extends Component {

    render = () => {
        let {userData} = this.props.databaseReducer;
        let rateValue = 0;

        let currentTrack = util.currentTrackData(userData);
        if (currentTrack !== undefined && userData.ratings !== undefined) {
            let trackId = currentTrack.id;
            if (trackId in userData.ratings) {
                rateValue = userData.ratings[trackId].rating;
            }
        }
        // style definitions
        let emptystar = "glyphicon glyphicon-star-empty black";
        let star = "glyphicon glyphicon-star black";

        return <div className="rating-size second-step">
            <Rating id="song_rating" empty={emptystar} full={star} onChange={(value) => {util.setNewRating(value, this.props)}} readonly={false}
                    initialRate={rateValue}/>
        </div>
    }
}

const mapStateToProps = (store) => {
    return store;
};


// store history of ratings?
const mapDispatcherToProps = (dispatch) => {
    return {
        setRating: (userId, userData, trackId, rating, timeInSongWhenRated, listenTime) => {
            dispatch(async.pushRatingtoDB(userId, userData, trackId, rating, timeInSongWhenRated, listenTime))
        },
        setRatingWarning: (isEnabled) => {
            dispatch(actions.setRatingWarning(isEnabled));
        }
    }
};


export default connect(mapStateToProps, mapDispatcherToProps)(RatingComponent)

