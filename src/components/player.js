import React, {Component} from 'react';
import {connect} from 'react-redux';
import RatingComponent from "./rating";
import ErrorMsg from "./error-msg";
import Swipe from 'react-swipe-component';
import MediaQuery from 'react-responsive';
import Loading from "./loading";
import RatingModal from "./rating-modal";
import FilePlayer from 'react-player/lib/players/FilePlayer'
import { ProgressBar } from "./progress-bar";
import { Direction } from 'react-player-controls';
import * as config from "../config";
import * as util from "../util";
import * as constants from "../constants";

import * as actions from "../actions/actions";
import * as async from "../actions/async";

class Player extends Component {

    state = {
        volume: 0.8,
        muted: false,
        current: 0,
        duration: 0,
        playbackRate: 1.0,
        seeking: false,
        loop: false,
        play_button: constants.PLAY,
        trackDurationStr: "0:00",
        loaded: 0,
        played: 0,
        playedSeconds: 0
    };

    constructor(props) {
        super(props);

        // setup swipe
        this.onSwipeLeftListener = this._onSwipeLeftListener.bind(this);
        this.onSwipeRightListener = this._onSwipeRightListener.bind(this);
    }

    _onSwipeLeftListener() {
        this.nextTrack();
    }

    _onSwipeRightListener() {
        this.prevTrack();
    }

    resetPlayer = () => {
        this.setState({
            played: 0,
            loaded: 0,
            playedSeconds: 0
        })
    };

    componentWillMount = () => {
        let {userId, userData} = this.props.databaseReducer;

        if (!userData.clickedWelcome) {
            // track that user started using app
            userData.clickedWelcome = true;
            this.props.updateUser(userId, userData);
        }
    };

    componentWillReceiveProps = (nextProps) => {
        let {track, playing} = this.props.trackReducer;

        // if sound is not playing and local state is set to playing, start playing new track
        let newTrack = nextProps.trackReducer.track;
        if (track !== newTrack && !this.isPlaying() && playing === true) {
            this.play();
        }
    };

    // update db before close
    componentWillUnmount = () => {
        if (this.isPlaying()) {
            this.pause()
        }
    };

    clickedPlayButton = () => {
        let {playing} = this.props.trackReducer;

        if (!playing) {
            this.play();
        } else {
            this.pause();
        }
    };

    play = () => {
        let {track} = this.props.trackReducer;
        // play the track
        this.props.resetAutoplay();
        this.setState({play_button: constants.PAUSE});
        this.props.startPlaying(track);
    };

    // track has actually started streaming
    onPlay = () => {
        let {userId, userData} = this.props.databaseReducer;
        let currentTrack = util.currentTrackData(userData);
        if (!currentTrack[constants.listenedTo]) {
            // update listenedTo value
            currentTrack[constants.listenedTo] = true;
            userData.playlist[userData.currentTrackIndex] = currentTrack;
            this.props.updateUser(userId, userData);
        }
        this.setState({play_button: constants.PAUSE});
    };

    onStart = () => {
        // console.log("onStart")
    };


    onSeekMouseDown = value => {
        if (value != null) {
            this.setState({seeking: true});
        }
    };

    onSeekChange = value  => {
        if (value != null) {
            this.setState({played: parseFloat(value), loaded: 0});
        }
    };

    onSeekMouseUp = value => {
        if (value != null) {
            this.setState({seeking: false});
            this.player.seekTo(parseFloat(value));
            this.setState({play_button: constants.LOADING});
        }
    };

    onDuration = state => {
        let {userId, userData} = this.props.databaseReducer;
        let currentTrack = util.currentTrackData(userData);
        // update duration if not already set - maybe move to function later
        if (currentTrack.duration !== state) {
            currentTrack.duration = state;
            util.setCurrentTrackData(userData, currentTrack);
            this.props.updateUser(userId, userData);
            this.props.updateTrack(currentTrack)
        }
    };

    onEnded = () => {
        let {userId, userData} = this.props.databaseReducer;
        let {startTime} = this.props.trackReducer;
        let {autoPlay} = this.props.sessionReducer;

        const currentTrack = util.currentTrackData(userData);
        const listenTime = util.calculateListenTime(startTime);

        this.props.stoppedPlaying(userId, userData, currentTrack.id, currentTrack, listenTime);

        if (autoPlay) {
            this.prepareNextUnratedTrack();
        } else {
            this.setState({play_button: constants.PLAY});
        }
    };

    onBuffer = () => {
        this.setState({play_button: constants.LOADING});
    };

    onSeek = () => {
        let {playing} = this.props.trackReducer;
        if (!playing) {
            this.setState({play_button: constants.PLAY});
        } else {
            this.setState({play_button: constants.PAUSE});
        }
    };

    ref = player => {
        this.player = player
    };

    onReady = () => {
        // put player in track reducer
        this.props.setPlayer(this.player);
    };

    // called while song is playing
    onProgress = playerState => {
        if (!this.state.seeking) {
            this.setState(playerState);
        }
    };

    pause = () => {
        let {userId, userData} = this.props.databaseReducer;
        let {startTime} = this.props.trackReducer;

        let currentTrack = util.currentTrackData(userData);
        this.setState({play_button: constants.PLAY});
        const listenTime = util.calculateListenTime(startTime);

        // this also updates user listen time
        this.props.stoppedPlaying(userId, userData, currentTrack.id, currentTrack, listenTime);
    };

    isPlaying = () => {
        let {playing} = this.props.trackReducer;
        return playing !== undefined && playing;
    };

    nextTrack = () => {
        let {userId, userData} = this.props.databaseReducer;
        let {startTime} = this.props.trackReducer;
        const listenTime = util.calculateListenTime(startTime);

        if (userData.currentTrackIndex < userData.playlist.length - 1) {
            let currentTrack = util.currentTrackData(userData);
            if (this.isPlaying()) {
                this.resetPlayer();
                // update state that current track is finished playing
                this.props.stopThenFetchTrack(userId, userData, currentTrack.id, currentTrack, listenTime, userData.currentTrackIndex + 1);
            } else {
                this.props.fetchTrack(userId, userData, userData.currentTrackIndex + 1);
            }
        }
    };


    addRatingModal = (currentTrackIndex, nextTrackIndex) => {
        this.setState({
            currentTrackIndex: currentTrackIndex,
            nextTrackIndex: nextTrackIndex
        });
        this.props.addUnratedModal();
    };

    prepareNextUnratedTrack = () => {
        let {userId, userData} = this.props.databaseReducer;
        let currentIndex = userData.currentTrackIndex;
        // check if not rated
        let trackId = userData.playlist[currentIndex].id;
        let currenTrackData = userData.ratings[trackId];

        let i = (currentIndex + 1) % userData.playlist.length;
        let count = 0;

        while (count < userData.playlist.length) {
            count++;
            trackId = userData.playlist[i].id;
            let trackData = userData.ratings[trackId];
            // if unrated track - or its re-added to playlist after all tracks in playlist have already been rated
            if (util.isUnrated(trackData) || !userData.playlist[i][constants.listenedTo]) {
                // if current track hasn't been rated, add modal
                if (util.isUnrated(currenTrackData)) {
                    this.addRatingModal(currentIndex, i);
                } else {
                    // advance to next track
                    this.props.fetchTrack(userId, userData, i);
                    this.play();
                }
                return;
            }
            i = (i + 1) % userData.playlist.length;
        }

        // everything has played
        userData.finished = true;
        this.setState({play_button: constants.PLAY});
        this.props.updateUser(userId, userData);
    };

    prevTrack = () => {
        let {userId, userData} = this.props.databaseReducer;
        let {startTime} = this.props.trackReducer;

        const listenTime = util.calculateListenTime(startTime);
        let currentTrack = util.currentTrackData(userData);

        if (userData.currentTrackIndex > 0) {
            if (this.isPlaying()) {
                this.resetPlayer();
                // update state that current track is finished playing
                this.props.stopThenFetchTrack(userId, userData, currentTrack.id, currentTrack, listenTime, userData.currentTrackIndex - 1);
            } else {
                this.props.fetchTrack(userId, userData, userData.currentTrackIndex - 1);
            }
        }
    };


    render = () => {
        let {playing, track} = this.props.trackReducer;

        let {userData} = this.props.databaseReducer;
        let {unratedTrackModal} = this.props.sessionReducer;

        let {play_button} = this.state;

        if (!util.verifyObjectPopulated(userData) || !userData.hasOwnProperty('playlist') || track === null) {
            return <Loading/>;
        }

        let imgUrl = track.artwork_url;

        let playPause = "glyphicon glyphicon-play";
        if (play_button === constants.LOADING) {
            playPause = "glyphicon glyphicon-refresh spinning";
        } else if (play_button === constants.PAUSE) {
            playPause = "glyphicon glyphicon-pause";
        }

        let trackDurationStr = "0:00";
        if (track.duration > 0) {
            trackDurationStr = util.getTimeStr(track.duration * 1000);
        }

        let timeInTrackStr = util.getTimeStr(this.state.playedSeconds * 1000);

        let backButtonClass = "transport_button";
        let prevAvail = userData.currentTrackIndex > 0;
        if (!prevAvail) {
            backButtonClass += " disabled";
        }

        let fwdButtonClass = "transport_button";
        let nextAvail = userData.currentTrackIndex < userData.playlist.length - 1;
        if (!nextAvail) {
            fwdButtonClass += " disabled";
        }

        return <Swipe
            nodeName="swipe-div"
            mouseSwipe={true}
            onSwipedLeft={this.onSwipeLeftListener}
            onSwipedRight={this.onSwipeRightListener}
            onSwipe={this.onSwipeListener}>
            <div className="player_wrapper">
                {unratedTrackModal && <RatingModal currentTrackIndex={this.state.currentTrackIndex} nextTrackIndex={this.state.nextTrackIndex} {...this.props}/>}
                <h2 className="track_title first-step">
                    {track.title}
                    {config.numTracks > 1 &&
                    <MediaQuery maxWidth={config.mobileWidth}>
                        <span className='song-count'>{"Track " + (userData.currentTrackIndex + 1) + " of " + userData.playlist.length} </span>
                    </MediaQuery>}
                </h2>
                <img className="imgSize" src={imgUrl} alt=""/>
                <br/><br/>
                <div className="time_wrapper">
                    <div className="time">
                        <div className="time_left">{timeInTrackStr}</div>
                        <div className="time_right">{trackDurationStr}</div>
                    </div>
                    <ProgressBar
                        direction = {Direction.HORIZONTAL}
                        onChangeStart = {this.onSeekMouseDown}
                        onChangeEnd = {this.onSeekMouseUp}
                        onChange = {this.onSeekChange}
                        value = {this.state.played}
                        amountBuffered={this.state.loaded} {...this.state}
                        className="progress-container"
                    />

                </div>
                <div className="transport swipe-step">
                    {config.numTracks > 1 &&
                    <button type="button" id="prev" className={backButtonClass} onClick={this.prevTrack} disabled={!prevAvail}>
                        <span className="glyphicon glyphicon-step-backward" aria-hidden="true"/>
                    </button>}
                    <button type="button" className="center_button" onClick={this.clickedPlayButton} id="play_pause">
                        <span className={playPause} aria-hidden="true"/>
                    </button>
                    {config.numTracks > 1 &&
                    <button type="button" id="next" className={fwdButtonClass} onClick={this.nextTrack} disabled={!nextAvail}>
                        <span className="glyphicon glyphicon-step-forward" aria-hidden="true"/>
                    </button>}
                </div>
                <RatingComponent {...this.props} />
                <ErrorMsg/>
                <br/>
                <FilePlayer
                    width={0}
                    height={0}
                    ref={this.ref}
                    className='react-player'
                    url={track.song_url}
                    playing={playing}
                    onReady={this.onReady}
                    onStart={this.onStart}
                    onPlay={this.onPlay}
                    onBuffer={this.onBuffer}
                    onSeek={this.onSeek}
                    onEnded={this.onEnded}
                    onError={e => console.log('onError', e)}
                    onProgress={this.onProgress}
                    onDuration={this.onDuration}
                />
            </div>
        </Swipe>
    }

}

const mapStateToProps = (store) => {
    return store;
};

const mapDispatcherToProps = (dispatch) => {
    return {
        setPlayer: (player) => {
            dispatch(actions.setPlayer(player));
        },
        startPlaying: (track) => {
            dispatch(actions.setPlaying(true, track));
        },
        stoppedPlaying: (userId, userData, trackId, track, listenTime) => {
            dispatch(async.stoppedPlaying(userId, userData, trackId, track, listenTime));
        },
        fetchTrack: (userId, userData, newIndex) => {
            dispatch(async.getTrackFromPlaylist(userId, userData, newIndex));
        },
        stopThenFetchTrack: (userId, userData, trackId, track, listenTime, newIndex) => {
            dispatch(async.stopThenFetchTrack(userId, userData, trackId, track, listenTime, newIndex));
        },
        updateUser: (userId, userData) => {
            dispatch(async.updateUser(userId, userData))
        },
        addUnratedModal: () => {
            // add modal
            dispatch(actions.unratedTrackModal(true));
        },
        resetAutoplay: () => {
            dispatch(actions.autoPlay(config.autoPlay));
        },
        // used to update duration of track
        updateTrack: (track) => {
            dispatch(async.updateTrack(track))
        }
    }
};

export default connect(mapStateToProps, mapDispatcherToProps)(Player)