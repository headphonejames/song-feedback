import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as config from "../config"

import MediaQuery from 'react-responsive';
import {CSSTransitionGroup} from 'react-transition-group'

import Joyride from 'react-joyride';
import * as web from "../joyride/web";
import * as mobile from "../joyride/mobile";
import * as actions from "../actions/actions";

class Walkthrough extends Component {

    componentWillMount = () => {
        this.setState({run: true});
    };

    walkthroughCallback = (e) => {
        if (e.lifecycle === "complete" && (e.action === "close" || e.action === "stop" || e.status === "finished")) {
            this.setState({run: false});
            this.props.setRunWalkthrough(false);
        }
    };


    render = () => {
        const defaultOptions = {
            options: {
                zIndex: 100,
                backgroundColor: '#15216B',
                arrowColor: "#9013FE",
                primaryColor: "#9013FE",
                textAlign: 'center',
                textColor: '#fff',
                overlayColor: 'rgba(0, 0, 0, 0.5)',
            },
            arrow: {
                display: 'block',
                color: '#15216B',

            },
            skip: {
                color: '#fff'
            },
            button: {
                backgroundColor: '#9013FE',
                color: '#fff',
            },
            tooltip: {
                borderRadius: 5,
                border: '2px solid',
                backgroundColor: '#15216B',
                borderColor: "#9013FE"
            }
        };

        let webWalkthrough = [web.trackTitle, web.rateTracks, web.trackListing, web.addNotes];
        let mobileWalkthrough = [web.trackTitle, web.rateTracks, mobile.trackNav, mobile.addNotes];
        if (config.numTracks === 1) {
            webWalkthrough = [web.trackTitle, web.rateTracks, web.addNotes];
            mobileWalkthrough = [web.trackTitle, web.rateTracks, mobile.addNotes];
        }
        return (<CSSTransitionGroup
            transitionName="error"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
            transitionAppearTimeout={500}
            transitionAppear={true}
            transitionLeave={true}>
            {config.showWalkthrough && <div key="walkthrough-key"><MediaQuery minWidth={config.mobileWidth}>
                {(matches) => {
                    if (matches) {
                        return (<Joyride
                            ref="joyride_web"
                            steps={webWalkthrough}
                            // run={true} // or some other boolean for when you want to start it
                            showSkipButton
                            showProgress
                            run={this.state.run}
                            callback={this.walkthroughCallback}
                            // scrollToFirstStep
                            locale={{skip: 'Skip Tutorial'}}
                            styles={defaultOptions}
                            continuous
                            disableOverlayClose
                        />)
                    } else {
                        return (<Joyride
                            ref="joyride_mobile"
                            steps={mobileWalkthrough}
                            run={this.state.run}
                            callback={this.walkthroughCallback}
                            showSkipButton
                            styles={defaultOptions}
                            locale={{skip: 'Skip Tutorial'}}
                            showProgress
                            continuous
                        />)
                    }
                }}
            </MediaQuery></div>}
        </CSSTransitionGroup>);
    }
}

const mapDispatcherToProps = (dispatch) => {
    return {
        setRunWalkthrough: (runWalkthrough) => {
            dispatch(actions.runWalkthrough(runWalkthrough))
        }
    }
};


const mapStateToProps = (store) => {
    return store;
};

export default connect(mapStateToProps, mapDispatcherToProps)(Walkthrough)

