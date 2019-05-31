import React, {Component} from 'react';
import { connect } from 'react-redux';
import '../css/App.css';
import PlaylistItem from "./playlist-item";

class Playlist extends Component {

    render = () => {
        let { userData} = this.props.databaseReducer;

        return <div className="playlist list-group third-step">
            {userData.playlist.map((trackMetadata, index) => {
                return <PlaylistItem track={trackMetadata} pl_index={index} key={trackMetadata.id} {...this.props} />
            })}
        </div>
    }

}
const mapStateToProps = (store) => {
    return store;
};


export default connect(mapStateToProps)(Playlist)

