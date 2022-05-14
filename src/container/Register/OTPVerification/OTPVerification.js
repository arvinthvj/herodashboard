import React, { Component } from 'react'
import OTPVerificationForm from '../../../components/RegisterForm/OTPVerificationForm/OTPVerificationForm'
import { routes, roles } from '../../../utility/constants/constants';
import * as actions from '../../../redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

class OTPVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: null
        }
    }

    componentDidMount() {

        if (this.props.user && this.props.isPhoneVerified) {
            this.props.history.push(routes.HOME)
        }
    }

    render() {
        return (
            <OTPVerificationForm
                onClickReEditPhoneNumber={this.props.onClickReEditPhoneNumber}
                isReEditPhoneNumber={this.props.isReEditPhoneNumber}
                history={this.props.history}
                isLoading={this.props.isLoading}
                submitOTP={this.props.submitOTP}
                user={this.props.user}
                editProfile={this.props.editProfile}
                phone={this.props.user.phone}
                getUserProfile={this.props.getUserProfile}
                country_code={this.props.user.country_code}
                sendOTP={this.props.sendOTP} />
        )
    }
}

const mapStateToProps = (state) => ({
    isSigningupForBooking: state.authReducer.isSigningupForBooking,
    user: state.authReducer.user,
    isLoading: state.authReducer.isloading,
    isReEditPhoneNumber: state.authReducer.isReEditPhoneNumber,
    isPhoneVerified: state.authReducer.isPhoneVerified
});

const mapStateToDispatch = (dispatch) => ({
    updateIsSigningFromBooking: (enable) => { dispatch(actions.updateIsSigningFromBooking(enable)) },
    sendOTP: (credentials) => dispatch(actions.send_otp(credentials)),
    submitOTP: (credentials) => dispatch(actions.submit_otp(credentials)),
    editProfile: (id, credentials) => dispatch(actions.editProfile(id, credentials)),
    getUserProfile: () => dispatch(actions.getUserProfile()),
    onClickReEditPhoneNumber: (credentials) => dispatch(actions.reEditPhoneNumberClicked(credentials))

});

export default connect(mapStateToProps, mapStateToDispatch)(withRouter(OTPVerification));
