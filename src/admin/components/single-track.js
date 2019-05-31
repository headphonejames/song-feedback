import Loading from "./loading";
import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as common_util from "../../util";
import * as admin_util from "../util";


import {Bar} from 'react-chartjs-2';

class SingleTrack extends Component {
    render = () => {
        let {tracks, ratings, users} = this.props.databaseAdminReducer;

        let trackId = this.props.match.params.id;

        if (!(common_util.verifyObjectPopulated(tracks) && common_util.verifyObjectPopulated(ratings) && common_util.verifyObjectPopulated(users))) {
            return <Loading/>;
        }


        const track = common_util.getObjFromList(tracks, trackId);
        const trackName = track.title;

        let comments = [];

        let usersRatedList = users.filter(user => {
            if (trackId in user.ratings) {
                const rating = user.ratings[trackId];
                return rating.listenTime > 0;
            } else {
                return false;
            }
        });

        let trackRatingList = usersRatedList.map(user => {
            return user.ratings[trackId]
        });

        let ratings_bar_state = {
            labels: [], datasets: [{
                label: 'Number of users',
                data: [],
                backgroundColor: []
            }]
        };

        let ratings_options = {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0
                    },
                }] ,
                xAxes: [{
                    ticks: {
                        min: 1,
                        max: 5,
                    }
                }],
            }
        };

        let star_rating_count = {};
        for (let i = 0; i < 5; i++) {
            star_rating_count[i] = 0;
        }

        let avgListenTime = 0;
        let numRatings = 0;
        let listenTimes = [];

        Object.keys(trackRatingList).forEach(index => {
            let ratingData = trackRatingList[index];
            if (ratingData.rating !== undefined) {
                if (ratingData.rating !== 0) {
                    star_rating_count[ratingData.rating - 1] = star_rating_count[ratingData.rating - 1] + 1;
                }
                avgListenTime += ratingData.listenTime;
                numRatings++;
                if (common_util.leftNote(ratingData)) {
                    comments.push(ratingData.notes);
                }
                let listenTimeSecs = Math.floor(ratingData.listenTime / 1000);
                listenTimes.push(listenTimeSecs);
            }

        });


        avgListenTime = Math.round(Math.round(avgListenTime / numRatings) / 1000);



        // iterate through all listen times and categorize for chart
        let maxListenTime = Math.max.apply(null, listenTimes);


        let listenTimeScaleSecs = 1;

        // set appropriate listen time scales
        if (maxListenTime > 200) {
            listenTimeScaleSecs = 40;
        } else if (maxListenTime > 100) {
            listenTimeScaleSecs = 20;
        } else if (maxListenTime > 50) {
            listenTimeScaleSecs = 10;
        } else if (maxListenTime > 25) {
            listenTimeScaleSecs = 5;
        }

        let maxTimeForChart = (maxListenTime > track.duration ? track.duration + listenTimeScaleSecs: maxListenTime);

        let listen_data_obj = {};

        // put listen time in order
        listenTimes = listenTimes.sort((a, b) => {
            return a - b
        });

        let index = 0;
        // initialize list
        for (let i = 0; i <= maxTimeForChart; i = i + listenTimeScaleSecs) {
            listen_data_obj[index] = 0;
            index++;
        }

        const numBuckets  = Object.keys(listen_data_obj).length;

        for (const listenTime of listenTimes) {
            let bucket = Math.floor(listenTime / listenTimeScaleSecs);
            if (bucket > numBuckets - 1) {
                bucket = numBuckets
            }
            listen_data_obj[bucket]++
        }

        let list_time_options = {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    ticks: {
                        min: 0,
                        max: listenTimeScaleSecs * numBuckets,
                        stepSize: listenTimeScaleSecs,
                        callback: (value, index, values) => {
                            let date = new Date(null);

                            date.setSeconds(value); // specify value for SECONDS here
                            return  date.toISOString().substr(14, 5);
                        }
                    }
                }]
            }
        };


        let listen_data = [];
        for (let listenCountId in listen_data_obj) {
            if (listen_data_obj.hasOwnProperty(listenCountId)) {
                let listenCount = listen_data_obj[listenCountId];
                listen_data.push(listenCount);
            }
        }

        let listen_time_state = {
            labels: [], datasets: [{
                label: 'Number of users',
                backgroundColor: [],
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: listen_data
            }]
        };

        for (let i = 0; i < maxListenTime + 1; i = i + listenTimeScaleSecs) {
            listen_time_state.labels.push(i);
        }
        admin_util.addColor(listen_time_state.datasets[0]);

        for (let starRating in star_rating_count) {
            if (star_rating_count.hasOwnProperty(starRating)) {
                ratings_bar_state.labels.push(parseInt(starRating) + 1);
                ratings_bar_state.datasets[0].data.push(star_rating_count[starRating]);
            }
        }
        admin_util.addColor(ratings_bar_state.datasets[0]);


        let date = new Date(null);
        date.setSeconds(avgListenTime); // specify value for SECONDS here
        // const avgListenTimeStr = date.toISOString().substr(11, 8);

        return <div>
            <div><h1>{trackName}</h1></div>
            <div className="half-container-left">
                <h4>Star rating distribution</h4>
                <Bar options={ratings_options} data={ratings_bar_state}/>
            </div>

            <div className="half-container-right">
                <h4>Time users listened to track</h4>
                <Bar options={list_time_options} data={listen_time_state}/>
            </div>

            {comments.length > 0 &&
            (<div className="admin-notes">
                <h3>Notes for {trackName}</h3>
                {comments.map((feedback, index) => {
                    return <li key={index} >
                        <div className="notes">
                            {feedback}
                        </div>
                    </li>
                })}
            </div>)
            }

            <br/>
        </div>;

    }
}

const mapStateToProps = (store) => {
    return store;
};

export default connect(mapStateToProps)(SingleTrack)
