import React, { Component } from 'react'
import RegisterForm from '../../components/RegisterForm/RegisterForm'
import { routes, roles, socialMediaSignInTypes } from '../../utility/constants/constants'
import * as actions from '../../redux/actions/index'
import { connect } from 'react-redux'
import { setTestUserRole } from '../../config';

class Register extends Component {

    state = {
        signUpAsUser: true,
        signUpAsHero: false,
        showPassword: false
    }

    moveToSignIn = () => {
        this.props.history.push(routes.LOGIN)
    }

    onToggleShowHidePassword = () => {
        this.setState({ showPassword: !this.state.showPassword })
    }

    toggleSocialMediaButtons = (values) => {
        if (values.google) {
            this.setState({ isGoogleLogin: true, isFBLogin: false })
        }
        else {
            this.setState({ isFBLogin: true, isGoogleLogin: false })
        }
    }

    toggleSignUpAsUser = (resetForm) => {
        resetForm()
        this.setState({ signUpAsUser: true, signUpAsHero: false });
        this.props.history.push(routes.REGISTER, { signUpAsHero: false, signUpAsUser: true })
    }

    toggleSignUpAsHero = (resetForm) => {
        resetForm()
        this.setState({ signUpAsUser: false, signUpAsHero: true })
        this.props.history.push(routes.REGISTER, { signUpAsHero: true, signUpAsUser: false })
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

        if (response && response.accessToken) {
            const user = {
                provider: this.state.isGoogleLogin ? socialMediaSignInTypes.GOOGLE : socialMediaSignInTypes.FB,
                access_token: response.accessToken,
                email: response.profileObj ? response.profileObj.email : response.email,
                role: this.state.signUpAsHero || this.props.history.location.state.signUpAsHero ? roles.service_provider : roles.client
            }
            this.props.loginUser(user);
            console.log(user)
            console.log(response)
        }
    }

    registerUser = (values) => {

        this.props.history.push(routes.VERIFY_OTP, {
            registerFormData: values,
            role: this.state.signUpAsUser ? roles.client : roles.service_provider
        });
    }

    render() {
        return (
            <RegisterForm
                registerUser={this.props.signUpUser}
                moveToSignIn={this.moveToSignIn}
                toggleSignUpAsHero={this.toggleSignUpAsHero}
                toggleSignUpAsUser={this.toggleSignUpAsUser}
                signUpAsHero={this.state.signUpAsHero}
                toggleSocialMediaButtons={this.toggleSocialMediaButtons}
                socialMediaResponse={this.socialMediaResponse}
                signUpAsUser={this.state.signUpAsUser}
                isLoading={this.props.isLoading}
                showPassword={this.state.showPassword}
                onToggleShowHidePassword={this.onToggleShowHidePassword}
                history={this.props.history} />
        )
    }
}

const mapStateToProps = (state) => ({
    isLoading: state.authReducer.isloading
});

const mapStateToDispatch = (dispatch) => ({
    loginUser: (credentials) => dispatch(actions.login(credentials)),
    signUpUser: (credentials) => dispatch(actions.signup(credentials))
});

export default connect(mapStateToProps, mapStateToDispatch)(Register)