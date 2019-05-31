import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as config from "../config";

import {CSSTransitionGroup} from 'react-transition-group'

class ErrorMsg extends Component {
    render = () => {
        let {isRatingWarningEnabled} = this.props.sessionReducer;
        let minWaitTime = Math.floor(config.millisToWaitBeforeRatingEnabled / 1000);

        return <CSSTransitionGroup
            transitionName="error"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
            transitionAppearTimeout={500}
            transitionAppear={true}
            transitionLeave={true}>
            {isRatingWarningEnabled && (
                <div key="error-div">
                    <p className="error-msg" key="error-text">Please listen for at least {minWaitTime} seconds before rating</p>
                </div>)}
        </CSSTransitionGroup>
    }

}

const mapStateToProps = (store) => {
    return store;
};

export default connect(mapStateToProps)(ErrorMsg)





