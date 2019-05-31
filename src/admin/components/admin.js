import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as async from "../actions/async";
import '../css/Admin.css';
import Action from "./action";
import XLSX from 'xlsx';

class Admin extends Component {

    updateTracks = () => {
        this.props.updateTracksList();
    };


    exportEmails = () => {
        let {users} = this.props.databaseAdminReducer;

        let aoo = [];
        for (let userId in users) {
            if (users.hasOwnProperty(userId)) {
                let user = users[userId];
                if (user.email !== "") {
                    aoo.push({email: user.email})
                }
            }
        }
        let ws = XLSX.utils.json_to_sheet(aoo);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "emails.csv", {bookType: "csv"});

    };

    exportAddresses = () => {
        let {users} = this.props.databaseAdminReducer;


        let aoo = [];
        for (let userId in users) {
            if (users.hasOwnProperty(userId)) {
                let user = users[userId];
                if (user.name !== "" && user.address !== "" && user.cityStateZip !== "") {
                    aoo.push({name: user.name, address: user.address, cityStateZip: user.cityStateZip})
                }
            }
        }
        let ws = XLSX.utils.json_to_sheet(aoo);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "addresses.csv", {bookType: "csv"});

    };

    cleanSessions = () => {
        let {users} = this.props.databaseAdminReducer;

        for (let userIndex in users) {
            if (users.hasOwnProperty(userIndex)) {
                const user = users[userIndex];
                let hasListened = false;
                let ratings = user.ratings;
                // check if tracks are unlistened to
                Object.keys(ratings).forEach(trackId => {
                    let trackRating = ratings[trackId];
                    if (trackRating.listenTime > 0) {
                        hasListened = true;
                    }
                });
                // if so, delete it!
                if (!hasListened) {
                    console.log("deleting session: " + user.id);
                    this.props.deleteUser(user.id);
                }
            }
        }
    };

    render = () => {
        return <div>
            <Action/>
            <div className="control_panel">
                <h2 className="admin_title">Administrative Options</h2>
                <div className="admin-button">
                    <button className="front" onClick={this.updateTracks}>
                        Update tracks in db from AWS S3
                    </button>
                </div>
                <div className="admin-button">
                    <button className="front" onClick={this.exportEmails}>
                        Export email addresses
                    </button>
                </div>
                <div className="admin-button">
                    <button className="front" onClick={this.exportAddresses}>
                        Export addresses
                    </button>
                </div>

                <div className="admin-button">
                    <button className="front" onClick={this.cleanSessions}>
                        Clean unused sessions
                    </button>
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = (store) => {
    return store;
};

const mapDispatcherToProps = (dispatch) => {
    return {
        updateTracksList: () => {
            dispatch(async.updateTracksInDB())
        },
        deleteUser: (id) => {
            dispatch(async.deleteUser(id))
        }
    }
};


export default connect(mapStateToProps, mapDispatcherToProps)(Admin)
