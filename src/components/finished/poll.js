import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../../css/App.css';
import {Link} from "react-router-dom";

import {FormGroup, Checkbox} from 'react-bootstrap';

import Header from '../header';
import Footer from '../footer';

import * as config from "../../config";
import * as async from "../../actions/async";

class Poll extends Component {
    otherInput = "other-input";

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        let {userData} = this.props.databaseReducer;
        const pollData = userData.pollData;
        this.setState({otherChecked: (pollData.other !== ""), other: pollData.other, checked: pollData.checked});
    }

    handleChange = (e) => {
        switch (e.target.id) {
            case config.poll_other:
                this.setState({otherChecked: e.target.checked});
                break;
            case this.otherInput:
                this.setState({
                    other: e.target.value
                });
                break;
            default:
                if (e.target.checked) {
                    this.setState({checked: [e.target.id, ...this.state.checked]});
                } else {
                    this.setState({checked: this.state.checked.filter(value => value !== e.target.id)});
                }
        }
    };


    savePoll = () => {
        let {userData} = this.props.databaseReducer;
        const newPollData = {other: this.state.other, checked: this.state.checked};
        this.props.savePollData(userData, newPollData);
    };

    render = () => {
        let {rewardCount} = this.props.databaseReducer;

        let nextLink = "finished-reward";
        if (rewardCount > config.maxRewards) {
            return nextLink = "finished-email";
        }

        return <div className="main">
            <Header/>
            <div className="finished_wrapper">

                <p className="fin_text">
                    <span className="thanks">Thank you for rating my tracks!</span>
                    <br/>
                    <br/>
                    {config.poll_question}
                </p>
                <div className="poll">
                    <div className="poll_div">
                        <FormGroup>
                            {config.poll_options.map((value) => {
                                let checked = this.state.checked.includes(value);
                                if (value === config.poll_other) {
                                    checked = this.state.otherChecked;
                                }
                                return <Checkbox className="poll_checkbox" key={value} id={value} checked={checked} onChange={this.handleChange}>{value}</Checkbox>
                            })}
                        </FormGroup>
                    </div>
                </div>
                {this.state.otherChecked &&
                <div><input className="capture_info" id={this.otherInput} onChange={this.handleChange}
                            placeholder={config.poll_other_placeholder} value={this.state.other}/></div>}
                <br/>
                <Link to={nextLink}>
                    <button className="front fin" onClick={this.savePoll}>Submit</button>
                </Link>
            </div>
            <Footer/>
        </div>
    }
}

const mapStateToProps = (store) => {
    return store;
};

const mapDispatcherToProps = (dispatch) => {
    return {
        fetchRewardCounts: () => {
            dispatch(async.fetchRewardCounts());
        },
        savePollData: (userData, pollData) => {
            dispatch(async.savePollData(userData, pollData));
        }
    }
};

export default connect(mapStateToProps, mapDispatcherToProps)(Poll)