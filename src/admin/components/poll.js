import React, {Component} from 'react';
import {connect} from 'react-redux';
import Loading from "./loading";
import {Pie} from 'react-chartjs-2';

import * as common_util from "../../util";
import * as admin_util from "../util";
import * as config from "../../config";


class Poll extends Component {
    // list all notes for tracks:

    render = () => {
        let {poll, pollOther} = this.props.databaseAdminReducer;

        if (!(common_util.verifyObjectPopulated(poll) && common_util.verifyObjectPopulated(pollOther))) {
            return <Loading/>;
        }

        let poll_pie_state = {
            labels: [], datasets: [{
                label: 'Poll Results',
                data: [],
                backgroundColor: []
            }]
        };

        let poll_pie_options = {
        };


        poll.forEach(pollValue => {
            poll_pie_state.labels.push(pollValue.id);
            poll_pie_state.datasets[0].data.push(pollValue.count);
        });
        admin_util.addColor(poll_pie_state.datasets[0]);

        const answers = pollOther[0].answers;

        return <div>
            <h2 className="admin_title">Poll</h2>
            <h4>{config.poll_question}</h4>
            <div className="row">
                <div className="half-container">
            <Pie options={poll_pie_options} data={poll_pie_state}/>
                </div>
            </div>
            <h1>Other responses</h1>
            {answers.map((answer, index) => {return <li className="notes" key={index}>{answer}</li>})}
        </div>

    }
}

const mapStateToProps = (store) => {
    return store;
};



export default connect(mapStateToProps)(Poll)
