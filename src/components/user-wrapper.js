import React, {Component} from 'react';
import {connect} from 'react-redux';
import cookie from 'react-cookie';
import uuid from 'uuid';
import * as async from "../actions/async";
import * as util from "../util";
import * as config from "../config";
import Loading from "./loading";
import PropTypes from 'prop-types';
import IdleTimer from 'react-idle-timer';

class UserWrapper extends Component {
    constructor(props) {
        super(props);
        this.idleTimer = null;
        this.onActive = this._onActive.bind(this);
    }

    componentWillMount() {
        let userId = cookie.load('userId');
        // userId = null;
        if (userId === undefined || userId === null) {
            // create a user
            userId = uuid.v4();
            cookie.save('userId', userId, {path: '/'});
            this.props.createUser(userId);
        } else {
            let {userData} = this.props.databaseReducer;
            if (!this.checkUserData(userData)) {
                // fetch user!
                this.props.fetchUser(userId);
            }
        }
        this.props.fetchGlobalData();
    }

    _onActive(e) {
        let {userData} = this.props.databaseReducer;
        // refresh urls if greater than timeout
        this.props.refreshSessionUrls(userData)
    }


    checkUserData = userData => {
        return util.verifyObjectPopulated(userData) && userData.hasOwnProperty('playlist');
    };

    render = () => {
            let {userData} = this.props.databaseReducer;
            if (this.props.waitForLoad && !this.checkUserData(userData)) {
                return <Loading/>;
            }
            if (this.props.waitForLoad) {
                return <div>
                    <IdleTimer
                        ref={ref => {
                            this.idleTimer = ref
                        }}
                        element={document}
                        onActive={this.onActive}
                        debounce={250}
                        timeout={config.signedUrlExpireSeconds * 1000}/>
                    {this.props.children}</div>
            } else {
                return <div>{this.props.children}</div>;
            }
    }
}

const mapStateToProps = (store) => {
    return store;
};

const mapDispatcherToProps = (dispatch) => {
    return {
        fetchUser: (userId) => {
            dispatch(async.fetchUser(userId))
        },
        fetchGlobalData: () => {
            // fetch global data (in this case the count of rewards already distributed)
            dispatch(async.fetchRewardCounts())
        },
        createUser: (userId) => {
            dispatch(async.createUser(userId))
        },
        refreshSessionUrls: (userData) => {
            dispatch(async.refreshUserUrls(userData.id, userData));
        }
    }
};

UserWrapper.propTypes = {
    waitForLoad: PropTypes.bool
};

UserWrapper.defaultProps = {
    waitForLoad: true
};

export default connect(mapStateToProps, mapDispatcherToProps)(UserWrapper)
