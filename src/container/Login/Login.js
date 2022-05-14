import React, { Component } from 'react'
import LoginForm from '../../components/LoginForm/LoginForm'
import { routes, roles, socialMediaSignInTypes } from '../../utility/constants/constants'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import * as actions from '../../redux/actions/index'

class Login extends Component {
    state = {
        isGoogleLogin: false,
        isFBLogin: false,
        showPassword: false
    }

    moveToSignUp = () => {
        this.props.history.push(routes.REGISTER, { signUpAsHero: false, signUpAsUser: true })
    }

    onToggleShowHidePassword = () => {
        this.setState({ showPassword: !this.state.showPassword })
    }

    moveToSignIn = () => {
        this.props.history.push(routes.LOGIN)
    }

    moveToForgotPassword = () => {
        this.props.history.push(routes.FORGOT_PASSWORD, { isResetPasswordClicked: true })
    }

    toggleSocialMediaButtons = (values) => {
        if (values.google) {
            this.setState({ isGoogleLogin: true, isFBLogin: false })
        }
        else {
            this.setState({ isFBLogin: true, isGoogleLogin: false })
        }
    }

    socialMediaResponse = (response) => {
        console.log(response, "socialmediares")
        if (response && response.accessToken) {
            const user = {
                provider: this.state.isGoogleLogin ? socialMediaSignInTypes.GOOGLE : socialMediaSignInTypes.FB,
                access_token: response.accessToken,
                email: response.profileObj ? response.profileObj.email : response.email
            }
            this.props.loginUser(user);
            console.log(user)
            console.log(response)
        }

    }

    render() {
        return (
            <LoginForm
                history={this.props.history}
                isLoading={this.props.isLoading}
                loginUser={this.props.loginUser}
                socialMediaResponse={this.socialMediaResponse}
                toggleSocialMediaButtons={this.toggleSocialMediaButtons}
                moveToForgotPassword={this.moveToForgotPassword}
                showPassword={this.state.showPassword}
                onToggleShowHidePassword={this.onToggleShowHidePassword}
                moveToSignUp={this.moveToSignUp} />
        )
    }
}

const mapStateToProps = (state) => ({
    isSigningupForBooking: state.authReducer.isSigningupForBooking,
    isLoading: state.authReducer.isloading
});

const mapStateToDispatch = (dispatch) => ({
    loginUser: (credentials) => dispatch(actions.login(credentials))
});

export default connect(mapStateToProps, mapStateToDispatch)(withRouter(Login));
