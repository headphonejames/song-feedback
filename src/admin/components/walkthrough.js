import React, {Component} from 'react';
import {connect} from 'react-redux';

import Joyride from 'react-joyride';
import * as web from "../joyride/web";

class Walkthrough extends Component {

    componentWillMount = () => {
        this.setState({run: true});
    };

    walkthroughCallback = (e) => {
        if (e.action === "close") {
            this.setState({run: false});
        }
    };

    render = () => {
        const defaultOptions = {
            zIndex: 100,
            backgroundColor: '#15216B',
            arrowColor: '#15216B',
            primaryColor: "#9013FE",
            textAlign: 'center',
            textColor: '#fff',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            arrow: {
                display: 'block'
            },
            skip: {
                color: '#fff'
            },
            button: {
                backgroundColor: '#9013FE',
                color: '#fff',
            },
        };

        return <div key="walkthrough-key">
                <Joyride
                    ref="joyride_web"
                    steps={[web.welcome, web.tracks, web.users, web.util]}
                    showSkipButton
                    showProgress
                    run={this.state.run}
                    callback={this.walkthroughCallback}
                    // scrollToFirstStep
                    locale={{skip: 'Skip Tutorial'}}
                    styles={{options: defaultOptions}}
                    continuous
                    disableOverlayClose
                />
                </div>
    }
}

const mapStateToProps = (store) => {
    return store;
};

export default connect(mapStateToProps)(Walkthrough)
