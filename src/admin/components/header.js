import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Navbar, Nav, NavItem} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap';
import * as async from "../actions/async";


class Header extends Component {

    refreshData = () => {
        this.props.refreshData();
    };

    render = () => {

        return <Navbar>
            <Navbar.Header>
                <Navbar.Brand>
                    <div className="joyride-welcome">
                        SongFeedback
                    </div>
                </Navbar.Brand>
            </Navbar.Header>
            <Nav>
                <LinkContainer to="/admin/tracks">
                    <NavItem eventKey={1} className="tracks-admin" onClick={ this.refreshData }>
                        <div className="joyride-tracks">Tracks</div>
                    </NavItem>
                </LinkContainer>
                <LinkContainer to="/admin/users">
                    <NavItem eventKey={2}  onClick={ this.refreshData }>
                        <div className="joyride-users">Users</div>
                    </NavItem>
                </LinkContainer>
                <LinkContainer to="/admin/notes">
                    <NavItem eventKey={3}  onClick={ this.refreshData }>
                        <div className="joyride-notes">Notes</div>
                    </NavItem>
                </LinkContainer>
                <LinkContainer to="/admin/poll">
                    <NavItem eventKey={4}  onClick={ this.refreshData }>
                        <div className="joyride-poll">Poll</div>
                    </NavItem>
                </LinkContainer>
                <LinkContainer to="/admin/admin">
                    <NavItem eventKey={5}  onClick={ this.refreshData }>
                        <div className="joyride-util">Options</div>
                    </NavItem>
                </LinkContainer>
            </Nav>
        </Navbar>

    }
}

const mapStateToProps = (store) => {
    return store;
};

const mapDispatcherToProps = (dispatch) => {
    return {
        refreshData: () => {
            dispatch(async.refreshData())
        }
    }
};


export default connect(mapStateToProps, mapDispatcherToProps)(Header)

