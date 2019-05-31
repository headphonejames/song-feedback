import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as common_util from "../../util";
import * as admin_util from "../util";

import Loading from "./loading";

import {Bar, Doughnut} from 'react-chartjs-2';

class Users extends Component {

    render = () => {
        let {users} = this.props.databaseAdminReducer;

        if (!(common_util.verifyObjectPopulated(users))) {
            return <Loading/>;
        }


        // let data = [];
        let userCount = Object.keys(users).length;
        // let totalTime = 0;

        // # ignored tutorial?


        // -- restrict charts to time periods
        // number of users per date
        // number that returned
        // # listening now, what they are listening to


        let total_listen_time = 0;
        let total_number_of_rated_tracks = 0;

        let mins_listened = {};
        let listen_time_bar_state = {
            labels: [], datasets: [
                {
                    label: 'number of users',
                    data: [], backgroundColor: []
                }
            ]
        };

        let listen_time_bar_options = {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                    }
                }],
                xAxes: [{
                    ticks: {
                        min: 0,
                        callback: function(value, index, values) {
                            let date = new Date(null);
                            date.setSeconds(value * 60); // specify value for SECONDS here
                            return date.toISOString().substr(11, 5);
                        }
                    }
                }],
            }
        };


        let num_tracks_rated = {};
        let num_tracks_rated_state = {
            labels: [], datasets: [
                {
                    label: 'Number of users',
                    data: [], backgroundColor: []
                }
            ]
        };

        let num_tracks_rated_options = {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                    }
                }],
            }
        };


        const emailAndAddress = "email and address";
        const email = "email";
        const address = "address";
        const noneGiven = "none";

        let user_info = {};
        user_info[emailAndAddress] = 0;
        user_info[email] = 0;
        user_info[address] = 0;
        user_info[noneGiven] = 0;

        let user_info_donut_state = {
            labels: [], datasets: [{
                data: [], backgroundColor: []
            }]
        };


        let bounced_donut_state = {
            labels: [], datasets: [{
                data: [], backgroundColor: []
            }]
        };

        let left_notes_donut_state = {
            labels: [], datasets: [{
                data: [], backgroundColor: []
            }]
        };

        // for (let user in users) {
        //     if (user.hasOwnProperty(user)) {
        //
        //
        //     }
        // }
        let total_user_count = 0;
        let passed_welcome_count = 0;
        let left_notes = 0 ;

        Object.keys(users).forEach((userIndex) => {
            total_user_count++;
            let user = users[userIndex];
            let user_listen_time = 0;
            let user_num_tracks_rated = 0;

            if (user.clickedWelcome) {
                passed_welcome_count++;
            }

            let user_left_note = false;

            Object.keys(user.ratings).forEach(trackId => {
                let current_rating = user.ratings[trackId];
                if (current_rating.listenTime !== undefined) {
                    user_listen_time += current_rating.listenTime;
                }
                if (current_rating.rating > 0) {
                    user_num_tracks_rated++;
                }
                if (common_util.leftNote(current_rating)) {
                    user_left_note = true;
                }
            });


            if (user_left_note) {
                left_notes++;
            }

            total_number_of_rated_tracks += user_num_tracks_rated;
            total_listen_time += user_listen_time;

            // total user listen time for chart
            let user_listen_time_mins = Math.round(user_listen_time / (1000 * 60));
            let key = user_listen_time_mins.toString();
            if (key in mins_listened) {
                mins_listened[key]++;
            } else {
                mins_listened[key] = 1
            }

            // # of tracks rated for chart
            key = user_num_tracks_rated.toString();
            if (key in num_tracks_rated) {
                num_tracks_rated[key]++;
            } else {
                num_tracks_rated[key] = 1;
            }

            if (user.email !== "" && user.cityStateZip !== "") {
                user_info[emailAndAddress]++
            } else if (user.email !== "") {
                user_info[email]++
            } else if (user.address !== "") {
                user_info[address]++
            } else {
                user_info[noneGiven]++
            }
        });


        let avg_listen_time_secs = Math.round((total_listen_time / userCount) / 1000);
        let avg_rated_tracks = Math.round(total_number_of_rated_tracks / userCount);

        Object.keys(mins_listened).map((minCategory) => {
            listen_time_bar_state.labels.push(minCategory);
            listen_time_bar_state.datasets[0].data.push(mins_listened[minCategory]);
            return minCategory;
        });

        admin_util.addColor(listen_time_bar_state.datasets[0]);


        Object.keys(num_tracks_rated).map((ratedCategory) => {
            num_tracks_rated_state.labels.push(ratedCategory);
            num_tracks_rated_state.datasets[0].data.push(num_tracks_rated[ratedCategory]);
            return ratedCategory;
        });

        admin_util.addColor(num_tracks_rated_state.datasets[0]);


        bounced_donut_state.labels.push("bounced");
        bounced_donut_state.datasets[0].data.push(total_user_count - passed_welcome_count);
        bounced_donut_state.labels.push("clicked welcome button");
        bounced_donut_state.datasets[0].data.push(passed_welcome_count);
        admin_util.addColor(bounced_donut_state.datasets[0]);

        left_notes_donut_state.labels.push("left note");
        left_notes_donut_state.datasets[0].data.push(left_notes);
        left_notes_donut_state.labels.push("did not leave note");
        left_notes_donut_state.datasets[0].data.push(total_user_count - left_notes);

        admin_util.addColor(left_notes_donut_state.datasets[0]);

        user_info_donut_state.labels.push(emailAndAddress);
        user_info_donut_state.datasets[0].data.push(user_info[emailAndAddress]);
        user_info_donut_state.labels.push(email);
        user_info_donut_state.datasets[0].data.push(user_info[email]);
        user_info_donut_state.labels.push(address);
        user_info_donut_state.datasets[0].data.push(user_info[address]);
        user_info_donut_state.labels.push(noneGiven);
        user_info_donut_state.datasets[0].data.push(user_info[noneGiven]);
        admin_util.addColor(user_info_donut_state.datasets[0]);

        let date = new Date(null);
        date.setSeconds(avg_listen_time_secs); // specify value for SECONDS here
        const listen_time = date.toISOString().substr(11, 8);

        return <div>
            <div className="tracks_container">

                <h2 className="admin_title">User Data</h2>
                <div><h4>Number of users: {userCount}</h4></div>

                <div className="row">

                        <div className="half-container-left">
                            <div>
                                <h4>Average listen time: {listen_time}</h4>
                                <h4>User listen distribution time (per minute)</h4>
                            </div>
                            <Bar data={listen_time_bar_state} options={listen_time_bar_options}/>
                        </div>

                        <div className="half-container-right">
                        <div><h4>Average number of tracks rated: {avg_rated_tracks}</h4>
                            <h4>Number of tracks rated per User</h4>
                        </div>
                            <Bar data={num_tracks_rated_state} options={num_tracks_rated_options}/>
                        </div>

                </div>

                <div className="row">

                    <div className="half-container-left">
                            <Doughnut data={user_info_donut_state}/>
                    </div>

                    <div className="half-container-right">
                            <Doughnut data={bounced_donut_state}/>
                    </div>

                </div>

                <div className="row">

                    <div className="center_container">
                            <Doughnut data={left_notes_donut_state}/>
                    </div>

                </div>


            </div>
            {/* End tracks container */}
        </div>;


    }
}

const mapStateToProps = (store) => {
    return store;
};




export default connect(mapStateToProps)(Users)
