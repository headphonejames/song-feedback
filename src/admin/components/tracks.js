import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as constants from "../../constants";
import * as common_util from "../../util";
import * as admin_util from "../util";

import Loading from "./loading";
import {HorizontalBar} from 'react-chartjs-2';
import {withRouter} from "react-router-dom"

class Tracks extends Component {
    render = () => {
        let {tracks, ratings, users} = this.props.databaseAdminReducer;

        if (!(common_util.verifyObjectPopulated(tracks) && common_util.verifyObjectPopulated(ratings) && common_util.verifyObjectPopulated(users))) {
            return <Loading/>;
        }


        let data = [];
        let ratings_distribution_bar_state = {
            labels: [], datasets: [{
                data: [], backgroundColor: [],

            }]
        };

        let ratings_distribution_bar_options = {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    ticks: {
                        min: 0
                    }
                }],
            },
            options: {
                events: ['click']
            }
        };

        let ordered_ratings_distribution = [];


        let listen_time_bar_options = {
            legend: {
                display: false,
            }, options: {
                events: ['click']
            },
            scales: {
                xAxes: [{
                    ticks: {
                        min: 0,
                        callback: function(value, index, values) {
                            let date = new Date(null);
                            date.setSeconds(value); // specify value for SECONDS here
                            return date.toISOString().substr(11, 8);
                        }
                    }
                }],
            },
        };


        let listen_time_bar_state = {
            labels: [], datasets: [{
                data: [], backgroundColor: []
            }]
        };
        let ordered_listen_times = [];


        let rating_bar_options = {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    ticks: {
                        min: 1,
                        max: 5,
                        stepSize: 1
                    }
                }],
            },
            options: {
                events: ['click']
            }
        };


        let avg_rating_state = {
            labels: [], datasets: [
                {
                    data: [], backgroundColor: []
                }
            ]
        };

        let ordered_ratings = [];

        let ordered_notes_count = [];
        let notes_count_state = {
            labels: [], datasets: [
                {
                    data: [], backgroundColor: []
                }
            ]
        };

        let note_count_options = {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    ticks: {
                        min: 0
                    }
                }],
            },
            options: {
                // This chart will not respond to mousemove, etc
                events: ['click']
            }
        };

        let notes_count = {};
        // initialize notes count object
        Object.keys(tracks).forEach((trackIndex) => {
            const track = tracks[trackIndex];
            notes_count[track.id] = 0;
        });

        Object.keys(users).forEach((userId) => {
                const user = users[userId];
                Object.keys(user.ratings).forEach((trackId) => {
                    const rating = user.ratings[trackId];
                    if (common_util.leftNote(rating)) {
                        notes_count[trackId]++
                    }
                });
            });


        for (let trackIndex in tracks) {
            if (tracks.hasOwnProperty(trackIndex)) {
                const track = tracks[trackIndex];
                const title = track.title;

                ordered_notes_count.push({title: title, notesCount: notes_count[track.id]});

                let rating = common_util.getObjFromList(ratings, track.id);
                const ratingKeys = Object.keys(rating).filter(key => !constants.invalidKeys.includes(key));

                let trackRatingList = ratingKeys.reduce((obj, key) => {
                        obj[key] = rating[key];
                        return obj;
                    }, {});

                let ratingList =
                    Object.keys(trackRatingList).map(userId => {
                        const user = common_util.getObjFromList(users, userId);
                        return user[constants.ratings_path][track.id];
                    });


                const ratedTracksKeys = ratingList.filter(rateObj => (rateObj.rating !== undefined));
                let ratingCount = Object.keys(ratedTracksKeys).length;
                let total_listen_time = 0;
                Object.keys(trackRatingList).forEach(userId => {
                    total_listen_time += trackRatingList[userId].listenTime;
                });

                // simple avgRating calculation
                const sumRatings = ratedTracksKeys.reduce((acc, value) => {
                    return acc + value.rating
                }, 0);

                const avgRating = sumRatings / ratingCount;

                let trackData = {
                    "name": title,
                    "avgRating": avgRating,
                    "ratingCount": ratingCount
                };
                data.push(trackData);

                ordered_ratings_distribution.push({title: title, ratingCount: ratingCount});
                const avgListenTime = (total_listen_time / 1000 ) / Object.keys(trackRatingList).length;

                ordered_listen_times.push({title: title, listenTime: Math.round(avgListenTime)});
                ordered_ratings.push({title: title, rating: avgRating});
            }
        }
        admin_util.addColor(ratings_distribution_bar_state.datasets[0]);


        ordered_listen_times.sort((a,b) => b.listenTime - a.listenTime);
        for (let values of ordered_listen_times) {
            listen_time_bar_state.labels.push(values.title);
            listen_time_bar_state.datasets[0].data.push(values.listenTime)
        }
        admin_util.addColor(listen_time_bar_state.datasets[0]);

        ordered_ratings_distribution.sort((a,b) => b.ratingCount - a.ratingCount);
        for (let values of ordered_ratings_distribution) {
            ratings_distribution_bar_state.labels.push(values.title);
            ratings_distribution_bar_state.datasets[0].data.push(values.ratingCount);
        }
        admin_util.addColor(ratings_distribution_bar_state.datasets[0]);

        ordered_ratings.sort((a, b) => b.rating - a.rating);
        for (let values of ordered_ratings) {
            avg_rating_state.labels.push(values.title);
            avg_rating_state.datasets[0].data.push(values.rating);
        }
        admin_util.addColor(avg_rating_state.datasets[0]);

        ordered_notes_count.sort((a, b) => b.notesCount- a.notesCount);
        for (let values of ordered_notes_count) {
            notes_count_state.labels.push(values.title);
            notes_count_state.datasets[0].data.push(values.notesCount)
        }
        admin_util.addColor(notes_count_state.datasets[0]);


        let handleTrackClick = (e) => {
            if (e !== undefined && e.length > 0) {
                // this is a ChartElement
                let chartElement = e[0];
                let trackName = chartElement._model.label;
                // look up track id by name
                let foundTrackId = 0;
                for (let trackId in tracks) {
                    if (tracks.hasOwnProperty(trackId)) {
                        let track = tracks[trackId];
                        if (track.title === trackName) {
                            foundTrackId = track.id;
                        }
                    }
                }
                this.props.history.push("tracks/" + foundTrackId);
            }
        };


        return <div>
            <div className="tracks_container">

                <h2 className="admin_title">Tracks Data</h2>
                <h5> Click any track name to see individual track data</h5>
                <br/>

            <div className="row">

                 <div className="half-container-left">
                     <h4>Average track rating</h4>
                     <HorizontalBar data={avg_rating_state} options={rating_bar_options} getElementsAtEvent={handleTrackClick}/>
                 </div>

                 <div className="half-container-right">

                     <h4>Number of notes per track</h4>
                     <HorizontalBar data={notes_count_state} options={note_count_options} getElementsAtEvent={handleTrackClick}/>
                 </div>

            </div>

                 <div className="half-container-left">
                       <h4>Number of ratings per track</h4>
                            <HorizontalBar data={ratings_distribution_bar_state} options={ratings_distribution_bar_options} getElementsAtEvent={handleTrackClick}/>
                  </div>

                   <div className="half-container-right">
                       <h4>Average listen time per track</h4>
                       <HorizontalBar data={listen_time_bar_state} options={listen_time_bar_options} getElementsAtEvent={handleTrackClick}/>
                  </div>

            </div>

        </div>

    }
}

const mapStateToProps = (store) => {
    return store;
};


export default connect(mapStateToProps)(withRouter(Tracks))
