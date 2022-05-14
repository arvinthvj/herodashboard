import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import { routes } from '../../utility/constants/constants';
import { GOOGLE_LOGIN_CLIENT_ID, FB_LOGIN_APP_ID } from '../../config';

export const FaceBook = (props) => {

    return (
        <FacebookLogin
            appId={FB_LOGIN_APP_ID()}
            autoLoad={false}
            callback={props.socialMediaResponse}
            fields="name,email,picture"
            render={renderProps => {
                const currentPath = props.history.location.pathname
                const onClickFBLogin = () => {
                    if (props.values.register_checkbox || currentPath === routes.LOGIN) {
                        props.toggleSocialMediaButtons({ google: false, fb: true })
                        return renderProps.onClick()
                    }
                    else {
                        props.setFieldError('register_checkbox', 'You must agree to our Terms & Conditions!')
                        props.setFieldTouched('register_checkbox', true)
                    }
                }
                return (
                    <a href="javascript:void(0)" onClick={onClickFBLogin} className="icn_fa icn_facebook"><img src="images/icons/icn_fb.png" alt="FACEBOOK" />{currentPath === routes.LOGIN ? "Sign In with Facebook" : "Sign Up with Facebook"}</a>
                )
            }}
        />
    )
}

export const Google = (props) => {
    return (
        <GoogleLogin
            clientId={GOOGLE_LOGIN_CLIENT_ID()}
            render={(renderProps) => {
                const currentPath = props.history.location.pathname
                const onClickGoogleLogin = () => {
                    if (props.values.register_checkbox || currentPath === routes.LOGIN) {
                        props.toggleSocialMediaButtons({ google: true, fb: false })
                        return renderProps.onClick()
                    }
                    else {
                        props.setFieldError('register_checkbox', 'You must agree to our Terms & Conditions!')
                        props.setFieldTouched('register_checkbox', true)
                    }
                }
                return (
                    <a href="javascript:void(0)" onClick={onClickGoogleLogin} className="icn_fa icn_google"><img src="images/icons/icn_google.png" alt="GOOGLE" />{currentPath === routes.LOGIN ? "Sign In with Google" : "Sign Up with Google"}</a>
                )
            }}
            // buttonText="Login"
            onSuccess={props.socialMediaResponse}
            onFailure={props.socialMediaResponse}
            cookiePolicy={'single_host_origin'}
        />
    )
}