import React, {Component} from 'react';
import { connect } from 'react-redux';


class Loading extends Component {

    render = () => {
        return <div className="loading">
            Loading....
        </div>
    }
}

const mapStateToProps = (store) => {
    return store;
};

export default connect(mapStateToProps)(Loading)
