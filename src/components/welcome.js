import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as actions from "../actions/actions";
import * as config from "../config";

import '../css/App.css';
import Header from './header';
import Footer from './footer';
import UserWrapper from "./user-wrapper";
import YouTubePlayer from 'react-player/lib/players/YouTube'
import MediaQuery from 'react-responsive';
import Loading from "./loading";

class Welcome extends Component {

    state = {
        ready: false
    };


    handleClick = () => {
        this.props.setSplash(false);
    };

    onReady = () => {
        this.setState({
            ready: true
        })
    };

    renderVideo = (display) => {
        const youtube_config = { youtube: {
                playerVars:
                    {
                        showinfo: 0,
                        modestbranding: 1,
                        rel: 0,
                        autoplay: 0
                    }
            }};

        const welcome_video = "https://www.youtube.com/embed/" + config.welcome_video_id;

        const displayClass = display ? "display" : "nodisplay";

        return <div className={displayClass}>{config.welcome_video_id && (
                <MediaQuery minWidth={config.mobileWidth}>
                    {(matches) => {
                        if (matches) {
                            // desktop web version
                            return <YouTubePlayer
                                width={560}
                                height={315}
                                className='intro_video'
                                url={welcome_video}
                                config={youtube_config}
                                onReady={this.onReady}
                            />
                        } else {
                            // mobile version
                            return <div className="player-wrapper">
                                <YouTubePlayer
                                    className='intro_video'
                                    width='100%'
                                    height='100%'
                                    url={welcome_video}
                                    config={youtube_config}
                                    onReady={this.onReady}
                                />
                            </div>
                        }
                    }}
                </MediaQuery>)}</div>
    };

    render = () => {
        // render splash screen, do not wait for user data to load to display welcome screen
        return <UserWrapper waitForLoad={false}>
            <div className="main">
                {!this.state.ready ? (
                    <div>
                        <Loading/>{this.renderVideo(false)}
                        </div>)
                    :
                    (<div>
                        <Header showTitle={true}/>
                        <br/>
                        {this.renderVideo(true)}
                        <button className="front" onClick={this.handleClick}>
                            Begin
                        </button>
                        <Footer/>
                    </div>)}

            </div>
        </UserWrapper>

    }
}

const mapStateToProps = (store) => {
    return store;
};

const mapDispatcherToProps = (dispatch) => {
    return {
        setSplash: (showSplash) => {
            dispatch(actions.showSplashPage(showSplash))
        }
    }
};

export default connect(mapStateToProps, mapDispatcherToProps)(Welcome)
