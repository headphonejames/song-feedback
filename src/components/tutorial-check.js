import React, {Component} from 'react';
import {connect} from 'react-redux';

import Modal from 'react-modal';


import * as actions from "../actions/actions";

import '../css/App.css';

Modal.setAppElement('#root');

class TutorialCheck extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: true
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    customStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },

        content: {
            top: '0%',
            left: '0%',
            right: 'auto',
            bottom: 'auto',
            // marginRight           : '-50%',
            // transform             : 'translate(-50%, -50%)',
            background: "#A682FF",
            opacity: '0.9',
            minHeight: '100%',
            minWidth: '100%',
            textAlign: 'center'
        }
    };

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal(runWalktrough) {
        this.setState({modalIsOpen: false});
        this.props.setRunWalkthrough(runWalktrough);
    }

    render() {
        let {userData} = this.props.databaseReducer;
        if (userData.offerWalkthrough) {
            return (
                <div>
                    {this.props.children}
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this.closeModal}
                        style={this.customStyles}
                        contentLabel="Tutorial Modal"
                        closeTimeoutMS={250}
                    >
                        <div className="modalSpacer"/>
                        <h2>Would you like a tutorial?</h2>
                        <div className="final spacer">

                            <button className="front" onClick={() => {
                                this.closeModal(true)
                            }}>Yes
                            </button>
                            <span className="buttonSpacer"/>
                            <button className="front" onClick={() => {
                                this.closeModal(false)
                            }}>No
                            </button>
                        </div>
                    </Modal>
                </div>
            );
        } else {
            return <div>{this.props.children}</div>
        }
    }


}

const mapStateToProps = (store) => {
    return store;
};

const mapDispatcherToProps = (dispatch) => {
    return {
        setRunWalkthrough: (runWalkthrough) => {
            dispatch(actions.runWalkthrough(runWalkthrough))
        }
    }
};

export default connect(mapStateToProps, mapDispatcherToProps)(TutorialCheck)
