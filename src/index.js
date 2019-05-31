import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {HashRouter, Switch, Route} from 'react-router-dom';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import Loadable from 'react-loadable';

import 'bootstrap/dist/css/bootstrap.css';

import Main from './components/main';
import FinishedPoll from './components/finished/poll';
import FinishedAddress from './components/finished/address';
import FinishedEmail from './components/finished/email';
import FinishedReward from './components/finished/reward';
import Finished from './components/finished/finished';
import UserWrapper from "./components/user-wrapper";
import Loading from "./components/loading";


import reducer from './reducers/index';

const store = createStore(
    reducer,
    applyMiddleware(thunk)
);

// Code splitting with dynamic import
// https://reactjs.org/docs/code-splitting.html
const Admin = Loadable({
    loader: () => import('./admin/components/main'),
    loading: () => <Loading/>
});

render(
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path='/admin' component={Admin}/>
                <Route exact path='/' component={Main}/>
                <UserWrapper>
                    <Route path='/finished-poll' component={FinishedPoll}/>
                    <Route path='/finished-reward' component={FinishedReward}/>
                    <Route path='/finished-address' component={FinishedAddress}/>
                    <Route path='/finished-email' component={FinishedEmail}/>
                    <Route path='/finished' component={Finished}/>
                </UserWrapper>
            </Switch>
        </HashRouter>
    </Provider>,
    document.getElementById('root')
);