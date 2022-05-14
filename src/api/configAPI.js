import axios, { API_VERSION } from '../config';

export const fetchConfig = () => {
    return axios.get(API_VERSION + '/configuration', {
        headers: {
            'Content-Type': 'application/json',
            // 'Accept': 'application/json'
        },
    });
};