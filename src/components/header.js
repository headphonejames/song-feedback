import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as config from "../config";

import MediaQuery from 'react-responsive';

class Header extends Component {
    render = () => {
        return <div>
            <MediaQuery minWidth={config.mobileWidth}>
                {(matches) => {
                    if (matches || this.props.showTitle) {
                        // desktop web version
                        return (<div className="header">
                            <div className="line"/>
                            <h1 className="app_title">Song Feedback</h1>
                            <div className="line"/>
                        </div>)
                    } else {
                        return <br/>
                    }
                }}
            </MediaQuery>
        </div>
    }
}


const mapStateToProps = (store) => {
    return store;
};

export default connect(mapStateToProps)(Header)
