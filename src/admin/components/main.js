import React, {Component} from 'react';
import { connect } from 'react-redux';

import * as async from "../actions/async";
import '../css/Admin.css';

import Header from './header';
import Tracks from "./tracks";
import SingleTrack from "./single-track";
import Notes from './notes';
import Poll from './poll';
import Users from "./users";
import Admin from "./admin";
import Footer from "./footer";
import {Switch, Route, Redirect} from 'react-router-dom';
import * as config from "../../config";
import Walkthrough from './walkthrough';
import * as util from "../../util";
import { defaults } from 'react-chartjs-2'
import * as database from "../database";


class Main extends Component {

    componentWillMount = () => {
        database.init();
        this.props.fetchData();
        defaults.global.defaultFontColor = "white";
    };

    render = () => {
        let {tracks} = this.props.databaseAdminReducer;
        // passing property to header to force render every click
        return  <div>
            {config.showAdminWalkthrough && <Walkthrough/>}
            <Header  pathname={this.props.history.location.pathname}/>
            <Switch>
                <Route path='/admin/admin' component={Admin}/>
                <Route path='/admin/users' component={Users}/>
                <Route path='/admin/tracks/:id' component={SingleTrack}/>
                <Route path='/admin/tracks' component={Tracks}/>
                <Route path='/admin/notes' component={Notes}/>
                <Route path='/admin/poll' component={Poll}/>
                {  util.verifyObjectPopulated(tracks) ? (<Redirect from='/admin' to='/admin/tracks'/>) : (<Redirect from='/admin' to='/admin/admin'/>) }
            </Switch>
            <Footer/>
        </div>

    }
}

const mapStateToProps = (store) => {
    return store;
};

const mapDispatcherToProps = (dispatch) => {
    return {
        fetchData: () => {
            dispatch(async.loginAndFetchData());
        }
    }
};

export default connect(mapStateToProps, mapDispatcherToProps)(Main)
