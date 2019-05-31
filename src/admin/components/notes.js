import React, {Component} from 'react';
import {connect} from 'react-redux';
import Loading from "./loading";
import ClickNHold from 'react-click-n-hold';
import Action from "./action";

import * as common_util from "../../util";
import * as async from "../actions/async";


class Notes extends Component {
    deleteNote = (userId, trackId, trackName, text) => {
        this.props.deleteNote(userId, trackId, trackName, text);
    };

    render = () => {
        let {tracks, ratings, users} = this.props.databaseAdminReducer;

        if (!(common_util.verifyObjectPopulated(tracks) && common_util.verifyObjectPopulated(ratings) && common_util.verifyObjectPopulated(users))) {
            return <Loading/>;
        }

        let notesByTrack = {};

        for (let userIndex in users) {
            if (users.hasOwnProperty(userIndex)) {
                let userData = users[userIndex];
                for (let trackId in userData.ratings) {
                    if (userData.ratings.hasOwnProperty(trackId)) {
                        let userTrackData = userData.ratings[trackId];
                        if (common_util.leftNote(userTrackData)) {
                            let notesForTrack = [];
                            if (common_util.verifyObjectPopulated(notesByTrack[trackId])) {
                                notesForTrack = notesByTrack[trackId];
                            }
                            notesForTrack.push({notes: userTrackData.notes, userId: userData.id, trackId: trackId});
                            notesByTrack[trackId] = notesForTrack;
                        }
                    }
                }
            }
        }
        return <div>
            <Action/>
            <h2 className="admin_title">All Notes</h2>
            <h4><i>Click and hold delete button for 2 seconds to delete note from database</i></h4>
            {Object.keys(notesByTrack).map((trackId, index) => {
                const track = common_util.getObjFromList(tracks, trackId);
                let trackName = track.title;
                let trackNotes = notesByTrack[trackId];
                return <div className={"notes"} key={index}><h3>{trackName}</h3>{trackNotes.map((noteData, index) => <li
                    key={index} className={"notes"}>"{noteData.notes}"<div className="floater"> <ClickNHold
                    time={1.5}
                    onClickNHold={() => {this.deleteNote(noteData.userId, noteData.trackId, trackName, noteData.notes)}} style={{"display": "inline"}}>
                    <button id={"button-" + index} className="glyphicon glyphicon-remove delete_button"/>
                </ClickNHold></div></li>)}<br/></div>
            })}
        </div>

    }
}

const mapStateToProps = (store) => {
    return store;
};

const mapDispatcherToProps = (dispatch) => {
    return {
        deleteNote: (userId, trackId, trackName, text) => {
            dispatch(async.deleteNote(userId, trackId, trackName, text));
        }
    }
};


export default connect(mapStateToProps, mapDispatcherToProps)(Notes)
