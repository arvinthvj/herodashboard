import { AuthActionTypes, ActionTypes } from '../../actions/usersActions/actionType';
import storage from '../../../utility/storage';

const token = storage.get("token", null);
const refresh_token = storage.get("refresh_token", null);
const user = storage.get("user", null);

export const initialState = {
    token: token,
    refresh_token: refresh_token,
    user: user,
    isloading: false,
    isAdmin: user && user.role === "admin" ? true : false,
    resetPasswordToken: null,
    isSigningupForBooking: false,
    isPhoneVerified: user ? user["is_phone_verified?"] : false,
    isReEditPhoneNumber: false,
    presigned_url: null,
    photo_path: null,
    dispatchUpdateAccessToken: false,
    heroProfileQuestions: null,
    assessment: null,
    faqs: null,
    emailPath: null
}

const updateObject = (oldState, updatedProps) => {
    return {
        ...oldState,
        ...updatedProps
    }
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {

        case AuthActionTypes.RE_EDIT_PHONE_NUMBER:
            return updateObject(state, {
                isReEditPhoneNumber: action.payload
            })

        case AuthActionTypes.LOGIN_PENDING:
            return updateObject(state, { isloading: true, disabled: true });
        case AuthActionTypes.LOGIN_FULFILLED:
            return updateObject(state, {
                isloading: action.payload && action.payload.stopLoader ? false : true,
                disabled: false,
                token: action.payload && action.payload.user ? action.payload.user.access_token : null,
                refresh_token: action.payload && action.payload.user ? action.payload.user.refresh_token : null,
                user: action.payload ? action.payload.user : null,
                isPhoneVerified: action.payload && action.payload.user ? action.payload.user["is_phone_verified?"] : false,
            });

        case AuthActionTypes.SIGNUP_PENDING:
            return updateObject(state, { isloading: true, disabled: true });
        case AuthActionTypes.SIGNUP_FULFILLED:
            return updateObject(state, {
                isloading: false,
                disabled: false,
                token: action.payload && action.payload.user ? action.payload.user.access_token : null,
                refresh_token: action.payload && action.payload.user ? action.payload.user.refresh_token : null,
                user: action.payload ? action.payload.user : null,
                isPhoneVerified: action.payload && action.payload.user ? action.payload.user["is_phone_verified?"] : false
            });

        case AuthActionTypes.UPDATE_ACCESS_TOKEN_PENDING:
            return updateObject(state);
        case AuthActionTypes.UPDATE_ACCESS_TOKEN_FULFILLED:
            if (action.payload && action.payload.error) {
                return updateObject(state, {
                    token: null,
                    refresh_token: null,
                    user: null,
                    isloading: false,
                    isAdmin: false,
                    impersonate: false,
                    dispatchUpdateAccessToken: false
                });
            }
            else {
                return updateObject(state, {
                    token: action.payload ? action.payload.access_token : null,
                    refresh_token: action.payload ? action.payload.refresh_token : null,
                    dispatchUpdateAccessToken: false
                });
            }

        case AuthActionTypes.DISPATCH_UPDATE_ACCESS_TOKEN:
            return updateObject(state, { dispatchUpdateAccessToken: action.payload });

        case AuthActionTypes.SEND_OTP_PENDING:
            return updateObject(state, { isloading: true, disabled: true });
        case AuthActionTypes.SEND_OTP_FULFILLED:
            return updateObject(state, { isloading: action.payload && action.payload.stopLoader ? false : true, disabled: false });

        case AuthActionTypes.SUBMIT_OTP_PENDING:
            return updateObject(state, { isloading: true, disabled: true });
        case AuthActionTypes.SUBMIT_OTP_FULFILLED:
            return updateObject(state, { isloading: action.payload && action.payload.stopLoader ? false : true, disabled: false });

        case AuthActionTypes.FORGOT_PASSWORD_PENDING:
            return updateObject(state, { isloading: true, disabled: true });
        case AuthActionTypes.FORGOT_PASSWORD_FULFILLED:
            return updateObject(state, { isloading: false, disabled: false });

        case AuthActionTypes.RESET_PASSWORD_PENDING:
            return updateObject(state, { isloading: true, disabled: true });
        case AuthActionTypes.RESET_PASSWORD_FULFILLED:
            return updateObject(state, { isloading: false, disabled: false });

        case AuthActionTypes.CHANGE_PASSWORD_PENDING:
            return updateObject(state, { isloading: true, disabled: true });
        case AuthActionTypes.CHANGE_PASSWORD_FULFILLED:
            return updateObject(state, { isloading: false, disabled: false });

        case AuthActionTypes.AUTHORIZE:
            const payload = action.payload;
            const isAdmin = payload.user_profile.role === "superadmin" ? true : false;
            return updateObject(state,
                {
                    token: payload.token,
                    user: payload.user_profile,
                    refresh_token: payload.refresh_token,
                    isAdmin: isAdmin
                });

        case AuthActionTypes.LOGOUT:
            return updateObject(state, {
                token: null,
                refresh_token: null,
                user: null,
                isloading: false,
                isAdmin: false,
                impersonate: false,
            });

        case AuthActionTypes.EDIT_PROFILE_PENDING:
            return updateObject(state, { isloading: true })
        case AuthActionTypes.EDIT_PROFILE_FULFILLED:
            if (action.payload && action.payload.error) {
                return updateObject(state, { isloading: action.payload.stopLoader ? false : true })
            }
            else {
                return updateObject(state, {
                    isloading: action.payload.stopLoader ? false : true,
                    user: action.payload.user,
                    isPhoneVerified: action.payload ? action.payload.user["is_phone_verified?"] : false
                })
            }
        case AuthActionTypes.EDIT_PROFILE_PENDING:
            return updateObject(state, { isloading: true })
        case AuthActionTypes.EDIT_PROFILE_FULFILLED:
            if (action.payload && action.payload.error) {
                return updateObject(state, { isloading: action.payload.stopLoader ? false : true })
            }
            else {
                return updateObject(state, {
                    isloading: action.payload.stopLoader ? false : true,
                    user: action.payload.user,
                    isPhoneVerified: action.payload ? action.payload.user["is_phone_verified?"] : false
                })
            }

        case AuthActionTypes.GET_FAQ_PENDING:
            return updateObject(state, { isloading: true })
        case AuthActionTypes.GET_FAQ_FULFILLED:
            if (action.payload && action.payload.error) {
                return updateObject(state, { isloading: false })
            }
            else {
                return updateObject(state, {
                    isloading: false,
                    faqs: action.payload ? action.payload.faqs : null
                })
            }

        case AuthActionTypes.GET_USER_PROFILE_PENDING:
            return updateObject(state, { isloading: true })
        case AuthActionTypes.GET_USER_PROFILE_FULFILLED:

            if (action.payload && action.payload.error) {
                return updateObject(state, { isloading: false })
            }
            else {
                return updateObject(state, {
                    isloading: false,
                    user: action.payload ? action.payload.user : null,
                    isPhoneVerified: action.payload ? action.payload.user["is_phone_verified?"] : false
                })
            }

        case AuthActionTypes.UPLOAD_PROFILE_PHOTO_PENDING:
            return updateObject(state, { isloading: true })
        case AuthActionTypes.UPLOAD_PROFILE_PHOTO_FULFILLED:
            return updateObject(state, {
                isloading: action.payload && action.payload.stopLoader ? false : true,
                presigned_url: action.payload && action.payload.presigned_url ? action.payload.presigned_url : null,
                photo_path: action.payload && action.payload.photo_path ? action.payload.photo_path : null,
            })

        case AuthActionTypes.UPLOAD_PROFILE_PHOTO_TO_S3BUCKET_PENDING:
            return updateObject(state, { isloading: true })
        case AuthActionTypes.UPLOAD_PROFILE_PHOTO_TO_S3BUCKET_FULFILLED:
            if (action.payload && !action.payload.error || !action.payload.code) {
                return updateObject(state, { isloading: false })
            }
            else {
                return updateObject(state, { isloading: false, photo_path: null })
            }

        case AuthActionTypes.HERO_CREATE_TEST_QUESTION_PENDING:
            return updateObject(state, { isloading: true })
        case AuthActionTypes.HERO_CREATE_TEST_QUESTION_FULFILLED:
            if (action.payload && !action.payload.error || !action.payload.code) {

                return updateObject(state, { isloading: false, heroProfileQuestions: action.payload.questions, assessment: action.payload.assessment })
            }
            else {
                return updateObject(state, { isloading: false })
            }

        case AuthActionTypes.HERO_SUBMIT_TEST_QUESTION_PENDING:
            return updateObject(state, { isloading: true })
        case AuthActionTypes.HERO_SUBMIT_TEST_QUESTION_FULFILLED:
            if (action.payload && !action.payload.error || !action.payload.code) {
                return updateObject(state, { isloading: false })
            }
            else {
                return updateObject(state, { isloading: false })
            }

        case AuthActionTypes.HERO_GET_TEST_RESULTS_PENDING:
            return updateObject(state, { isloading: true })
        case AuthActionTypes.HERO_GET_TEST_RESULTS_FULFILLED:
            if (action.payload && !action.payload.error || !action.payload.code) {
                return updateObject(state, { isloading: false })
            }
            else {
                return updateObject(state, { isloading: false })
            }

        case AuthActionTypes.UPDATE_USER:
            storage.set('user', action.payload);
            return updateObject(state, {
                user: action.payload
            })

        case AuthActionTypes.UPDATE_IS_SIGNINGUP_FROM_BOOKING:
            return updateObject(state, {
                isSigningupForBooking: action.payload
            })

        case AuthActionTypes.SET_EMAIL_PATH:
             
            return updateObject(state, {
                emailPath: action.payload
            })
        default: return state;
    }
}