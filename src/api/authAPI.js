import axios, { API_VERSION } from '../config';
import { API_ADMIN as adminAxios } from '../config';
import storage from '../utility/storage';

const upload = require('axios');

const apiHeaders = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
}

export const updateAccessToken = (refresh_token) => {
    return axios.get(API_VERSION + '/tokens/refresh_token?refresh_token=' + refresh_token, apiHeaders)
}

export const login = (credentials) => {

    return axios.post('/users/sign_in', credentials, apiHeaders
        // defaultErrorHandler: false
    );
};

export const send_otp = (credentials) => {
    return axios.post(API_VERSION + '/users/phone_verification', credentials, apiHeaders,
        {
            defaultErrorHandler: true
        });
}

export const submit_otp = (credentials) => {
    return axios.put(API_VERSION + '/users/phone_verification', credentials, apiHeaders, {
        defaultErrorHandler: true
    });
}

export const signup = (credentials) => {

    return axios.post('/users', credentials, apiHeaders, {
        defaultErrorHandler: true
    });
};

export const forgotPassword = (credentials) => {

    return axios.post('/users/password', credentials, apiHeaders, {
        // defaultErrorHandler: false
    });
};

export const resetPassword = (user) => {
    return axios.put('/users/password', user, apiHeaders, {
        // defaultErrorHandler: false
    });
};

export const changePassword = (credentials) => {
    return axios.put(API_VERSION + '/users/update_password', credentials, apiHeaders, {
        // defaultErrorHandler: false
    });
}

export const getUserProfile = () => {
    return axios.get(API_VERSION + '/users/me', apiHeaders);
}

export const editProfile = (id, credentials) => {
    return axios.put(API_VERSION + '/users/' + id, credentials, apiHeaders);
}

export const profilePhotoUpload = (credentials) => {
    return axios.get(API_VERSION + '/users/presigned_photo_url?ext=.' + credentials, apiHeaders)
}

export const uploadImage = (url, baseImage) => {
    return upload.put(url, baseImage)
}

export const getHeroTestProfileQuestions = () => {
    return axios.get(API_VERSION + '/questions', apiHeaders)
}

export const submitHeroTestProfileQuestions = (questions) => {
    return axios.post(API_VERSION + '/evaluation_answers', questions, apiHeaders)
}

export const getHeroTestResults = () => {
    return axios.get(API_VERSION + '/assessments/latest_test', apiHeaders)
}

export const getFAQ = () => {
    return axios.get(API_VERSION + '/faq', apiHeaders)
}
