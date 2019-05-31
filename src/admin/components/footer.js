import React, {Component} from 'react';
import {connect} from 'react-redux';

class Footer extends Component {
    render = () => {
        return <div className="footer">
            <p className="footer_text">Music by <a href="http://www.generalfuzz.net">general fuzz</a> | Created by <a href="http://headphone-james.s3-website-us-east-1.amazonaws.com">Headphone James</a></p>
        </div>
    }
}

const mapStateToProps = (store) => {
    return store;
};

export default connect(mapStateToProps)(Footer)
