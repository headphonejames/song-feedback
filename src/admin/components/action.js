import React, {Component} from 'react';
import {connect} from 'react-redux';

import {CSSTransitionGroup} from 'react-transition-group'

class Action extends Component {
    render = () => {
        let {action, display} = this.props.databaseAdminReducer;

        return <CSSTransitionGroup
            transitionName="action"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
            transitionAppearTimeout={500}
            transitionAppear={true}
            transitionLeave={true}>
            {display && (
                <div className="action-msg" key="action">
                    {action}
                </div>)}
        </CSSTransitionGroup>
    }

}

const mapStateToProps = (store) => {
    return store;
};

export default connect(mapStateToProps)(Action)





