import { AuthActionTypes, ActionTypes } from './actionType';
import * as API from '../../../api/authAPI';
import storage from '../../../utility/storage';
import { toastMsg } from '../../../utility/utility';
import { routes, roles } from '../../../utility/constants/constants';
import store from '../../store/store';
import { gaSetUserDetails } from '../../../analytics/Analytics';
import { WP_URL } from '../../../config';
const queryString = require('query-string');

function getHistory() {
    const storeState = store.getState();
    const history = storeState.historyReducer.history;
    return history;
}

export const updateAccessToken = (refresh_token) => dispatch => dispatch({
    type: AuthActionTypes.UPDATE_ACCESS_TOKEN,
    payload: API.updateAccessToken(refresh_token)
        .then(response => {
            if (response.data.error || response.data.code) {
                dispatch(logout())
            }
            else {
                storage.set('token', response.data.access_token)
                storage.set('refresh_token', response.data.refresh_token)
            }
            return response.data
        }).catch(error => {

            return error;
        })
})

export const login = (credentials) => dispatch => dispatch({
    type: AuthActionTypes.LOGIN,
    payload: API.login(credentials)
        .then(response => {
            let history = getHistory()
            if (response.data.error || response.data.code) {
                // errorHandler(response.data);
                return { ...response.data, stopLoader: true }
            } else {
                gaSetUserDetails(response.data.user)
                storage.set('token', response.data.user.access_token)
                storage.set('refresh_token', response.data.user.refresh_token)
                storage.set('user', response.data.user)
                let color = '#' + Math.floor(Math.random() * 16777215).toString(16)
                storage.set('profilePicBgColor', color)
                let profileNumber = Math.floor(Math.random() * 2) + 1
                storage.set('heroProfileNumber', profileNumber)
                let isPhoneVerified = storage.get("isPhoneVerified", null)
                if (response.data.user.phone && (!response.data.user["is_phone_verified?"] && !isPhoneVerified)) {
                    console.log(response.data.user.phone)
                    dispatch(send_otp({ phone: response.data.user.phone, country_code: credentials.country_code }))
                    return { ...response.data, stopLoader: false }
                }
                else {
                    return { ...response.data, stopLoader: true }
                }

            }
        })
        .catch(error => {
            console.log(error);
            // errorHandler(error);
            return { ...error, stopLoader: true };
        })
});

export const signup = (credentials) => dispatch => dispatch({
    type: AuthActionTypes.SIGNUP,
    payload: API.signup(credentials)
        .then(response => {

            if (response.data.error || !response.data.success) {
                return { ...response.data, stopLoader: true }
            }
            else {
                dispatch(send_otp({ phone: response.data.user.phone, country_code: credentials.country_code }))
                storage.set('token', response.data.user.access_token)
                storage.set('refresh_token', response.data.user.refresh_token)
                storage.set('user', response.data.user)
                let color = '#' + Math.floor(Math.random() * 16777215).toString(16)
                storage.set('profilePicBgColor', color)
                let profileNumber = Math.floor(Math.random() * 2) + 1
                storage.set('heroProfileNumber', profileNumber)
                gaSetUserDetails(response.data.user)
                return { ...response.data, stopLoader: false }
            }
        }).catch(error => {
            console.log(error);
            // errorHandler(error);
            return { ...error, stopLoader: true }
        })
});

export const send_otp = (credentials, values) => dispatch => dispatch({
    type: AuthActionTypes.SEND_OTP,
    payload: API.send_otp({ phone: credentials.phone, country_code: credentials.country_code })
        .then(response => {

            let history = getHistory()
            let user = storage.get('user', null)
            if (process.env.REACT_APP_ENV === 'staging') {
                storage.set('isPhoneVerified', false)
            }
            else if (process.env.REACT_APP_ENV === 'development') {
                storage.set('isPhoneVerified', false)
            }
            if (response.data.success === "true") {
                dispatch(getUserProfile())
                    .then(res => {
                        if (res.value.success === "true") {
                            dispatch(reEditPhoneNumberClicked(false))
                            history.push(routes.VERIFY_OTP, { userDetails: { ...credentials } })
                        }
                        else {
                            dispatch(reEditPhoneNumberClicked(false))
                            history.push(routes.VERIFY_OTP, { userDetails: { ...credentials } })
                        }
                    }).catch(error => {
                        console.log(error)
                    })
                return { ...response.data, stopLoader: true };
            }
            else {
                dispatch(reEditPhoneNumberClicked(true))
                return { ...response.data, stopLoader: true };
            }
        }).catch(error => {
            console.log(error);
            // errorHandler(error);
            return { ...error, stopLoader: true };
        })
});

export const submit_otp = (credentials) => dispatch => dispatch({
    type: AuthActionTypes.SUBMIT_OTP,
    payload: API.submit_otp(credentials)
        .then(response => {
            let history = getHistory()
            let user = storage.get('user', null)
            if (response.data.success === "true") {
                 
                if (history.location.state && history.location.state.userDetails) {
                    dispatch(editProfile(user.id, { user: { ...history.location.state.userDetails, isUserEditingProfile: undefined } }))
                    if (history.location.state.userDetails.isUserEditingProfile) {
                        history.push(routes.EDIT_PROFILE)
                    }
                }
                return { ...response.data, stopLoader: false };
            }
            else {
                return { ...response.data, stopLoader: true };
            }
        }).catch(error => {
            console.log(error);
            // errorHandler(error);
            return { ...error, stopLoader: true };
        })
});

export const changePassword = (credentials) => dispatch => dispatch({
    type: AuthActionTypes.CHANGE_PASSWORD,
    payload: API.changePassword(credentials)
        .then(response => {

            if (response.data.error) {
                // toastMsg(response.data);
            } else {
                toastMsg("Password updated successfully!")
            }

            return response.data;
        })
        .catch(error => {
            console.log(error);
            // errorHandler(error);
            return error;
        })
});

export const forgotPassword = (credentials) => dispatch => dispatch({
    type: AuthActionTypes.FORGOT_PASSWORD,
    payload: API.forgotPassword(credentials)
        .then(response => {
            if (response.data.error) {
                // toastMsg(response.data);
            } else {
                toastMsg("Please check your email to reset your password!")
                const history = getHistory();
                history.push(routes.LOGIN);
            }

            return response.data;
        })
        .catch(error => {

            console.log(error);
            // errorHandler(error);
            return error;
        })
});

export const resetPassword = (credentials) => dispatch => dispatch({
    type: AuthActionTypes.RESET_PASSWORD,
    payload: API.resetPassword(credentials)
        .then(response => {

            if (response.data.error) {
                toastMsg(response.data);
            } else {
                if (response.data.success) {
                    storage.remove('reset_password_token');
                    toastMsg("Your Password has been reset sucuessfully. Please login to continue");
                    const history = getHistory();
                    history.push(routes.LOGIN);
                }
            }

            return response.data;
        })
        .catch(error => {
            console.log(error);
            // errorHandler(error);
            return error;
        })
});

export const authorizeUser = (user_profile) => {
    console.log("authorize:" + user_profile.access_token);
    console.log("user:" + user_profile);

    storage.set('token', user_profile.access_token);
    storage.set('refresh_token', user_profile.refresh_token);
    storage.set('user', user_profile);


    const token = user_profile.access_token;
    const refresh_token = user_profile.refresh_token;

    return {
        type: AuthActionTypes.AUTHORIZE,
        payload: {
            token,
            user_profile,
            refresh_token
        }
    }
};

export const logout = () => {

    storage.remove('token');
    storage.remove('user');
    storage.remove('refresh_token');
    storage.remove('step');
    storage.remove('bookingData');
    storage.remove('isPhoneVerified');
    storage.remove('savedAddresses');
    window.location.replace(WP_URL());
    return {
        type: AuthActionTypes.LOGOUT,
    }
};

export const getUserProfile = () => dispatch => dispatch({
    type: AuthActionTypes.GET_USER_PROFILE,
    payload: API.getUserProfile()
        .then(response => {
            console.log(response)
            if (response.data.error || response.data.code) {
                //error from api
                return response.data
            }
            else {
                storage.set('user', response.data.user)
                return response.data
            }
        }).catch(error => {
            console.log(error)
        })
})

export const reEditPhoneNumberClicked = (value) => dispatch => dispatch({
    type: AuthActionTypes.RE_EDIT_PHONE_NUMBER,
    payload: value
})

export const dispatchUpdateAccessToken = (value) => dispatch => dispatch({
    type: AuthActionTypes.DISPATCH_UPDATE_ACCESS_TOKEN,
    payload: value
})

export const editProfile = (id, credentials) => dispatch => dispatch({
    type: AuthActionTypes.EDIT_PROFILE,
    payload: API.editProfile(id, credentials)
        .then(response => {
            let history = getHistory()
            let current_url = history.location.pathname
            let { filter } = queryString.parse(history.location.search);
            let user = storage.get('user', null)
            if (!response.data.error) {
                if (current_url === routes.EDIT_PROFILE) {
                    toastMsg("Data Updated Successfully")
                }
                dispatch(reEditPhoneNumberClicked(false))
                dispatch(getUserProfile())

                if (filter && filter !== '') {
                    history.push({
                        search: `?filter=${filter}`,
                        pathname: routes.DASHBOARD
                    });
                }
                return { ...response.data, stopLoader: false }
            }
            else {
                if (response.data.error.message === "Phone has already been taken") {
                    dispatch(reEditPhoneNumberClicked(true))
                    history.push(routes.VERIFY_OTP)
                }
                return { ...response.data, stopLoader: true }
            }

        }).catch(error => {
            console.log(error)
            return { ...error, stopLoader: true }
        })
})

export const profilePhotoUpload = (credentials, image) => dispatch => dispatch({
    type: AuthActionTypes.UPLOAD_PROFILE_PHOTO,
    payload: API.profilePhotoUpload(credentials)
        .then(response => {

            if (!response.data.error) {
                // toastMsg("Photo Added Successfully")
                dispatch(uploadProfilePhotoToS3(response.data.presigned_url, image))
                return { ...response.data, stopLoader: false }
            }
            else {
                return { ...response.data, stopLoader: true }
            }
        }).catch(error => {

            console.log(error)
            return { ...error, stopLoader: true }
        })
})

export const uploadProfilePhotoToS3 = (url, baseImage) => dispatch => dispatch({
    type: AuthActionTypes.UPLOAD_PROFILE_PHOTO_TO_S3BUCKET,
    payload: API.uploadImage(url, baseImage)
        .then(response => {
            return response.data
        }).catch(error => {

            return error
        })
})

export const getHeroTestProfileQuestions = (credentials) => dispatch => dispatch({
    type: AuthActionTypes.HERO_CREATE_TEST_QUESTION,
    payload: API.getHeroTestProfileQuestions(credentials)
        .then(response => {
            //  
            if (response.data.error || response.data.code) {
                //error
                console.log(response)
            }
            else {
                console.log(response)
            }
            return response.data
        }).catch(error => {
            return error
        })
})

export const submitHeroTestProfileQuestions = (questions) => dispatch => dispatch({
    type: AuthActionTypes.HERO_SUBMIT_TEST_QUESTION,
    payload: API.submitHeroTestProfileQuestions(questions)
        .then(response => {

            let history = getHistory()
            if (!response.data.error || response.data.success === "true") {
                //error
                history.push(routes.IN_Review)
                console.log(response)
            }
            else {
                console.log(response)
            }
            return response.data
        }).catch(error => {
            return error
        })
})

export const getHeroTestResults = () => dispatch => dispatch({
    type: AuthActionTypes.HERO_GET_TEST_RESULTS,
    payload: API.getHeroTestResults()
        .then(response => {

            if (response.data.error || response.data.code) {
                //error
                console.log(response)
            }
            else {
                console.log(response)
            }
            return response.data
        }).catch(error => {
            return error
        })
})

export const getFAQ = () => dispatch => dispatch({
    type: AuthActionTypes.GET_FAQ,
    payload: API.getFAQ()
        .then(response => {
            if (response.data.error || response.data.code) {
                //error
                console.log(response)
            }
            else {
                console.log(response)
            }
            return response.data
        }).catch(error => {
            return error
        })
})

export const isBlocking = (value) => {
    return {
        type: ActionTypes.BLOCK_ROUTE,
        payload: value
    }
}

export const updateUserProfile = (user) => dispatch => dispatch({
    type: AuthActionTypes.UPDATE_USER,
    payload: user
})

export const updateIsSigningFromBooking = (enable) => dispatch => dispatch({
    type: AuthActionTypes.UPDATE_IS_SIGNINGUP_FROM_BOOKING,
    payload: enable
})

export const setEmailPath = (path) => dispatch => dispatch({
    type: AuthActionTypes.SET_EMAIL_PATH,
    payload: path
})