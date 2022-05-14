import axios, { API_VERSION } from '../config';
import { API_ADMIN as adminAxios } from '../config';
import storage from '../utility/storage';
const timeZone = require('axios');
const pureAxios = require('axios');

const headers = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
}

export const uploadImageToS3 = (url, arrayBuffer) => {
    return pureAxios.put(url, arrayBuffer);
}

export const addCard = (token) => {
    return axios.post(API_VERSION + '/creditcards', { stripe_token: token }, headers);
}

export const getCardDetails = (id) => {
    return axios.get(API_VERSION + `/creditcards`, headers);
}

export const createBooking = (booking) => {
    return axios.post(API_VERSION + '/bookings', { booking }, headers);
}

export const addRateAndReview = (id, review) => {
    return axios.post(API_VERSION + `/bookings/${id}/review`, review, headers);
}

export const getUserFavoriteHerosList = (serviceIds, lat, lng) => {

    return axios.get(API_VERSION + `/users/favorites?${serviceIds ? serviceIds : []}lat=${lat ? lat : ''}&lon=${lng ? lng : ''}`, headers);
}

export const deleteUserFavoriteHero = (provider_id) => {
    return axios.delete(API_VERSION + `/users/favorites/${provider_id}`, headers);
}

export const getPayouts = () => {
    return axios.get(API_VERSION + `/payouts?page_param=1&items=150`, headers);
}

export const getClientOrders = () => {
    return axios.get(API_VERSION + `/orders?page_param=1&items=150`, headers);
}

export const getClientBookingList = (filter) => {
    return axios.get(API_VERSION + `/bookings?filter=${filter}&page_param=1&items=150`, headers);
}

export const getHeroJobsList = (filter) => {
    return axios.get(API_VERSION + `/bookings?filter=${filter}&page_param=1&items=150`, headers);
}

export const bookingCancelClicked = (id, booking) => {
    return axios.put(API_VERSION + `/bookings/${id}/cancel`, booking, headers);
}

export const acceptJob = (id) => {
    return axios.put(API_VERSION + `/bookings/${id}/accept`, headers);
}

export const acceptRescheduleJob = (id) => {
    return axios.put(API_VERSION + `/bookings/${id}/reschedule/accept`, headers)
}

export const rescheduleJob = (id, booking) => {
    return axios.post(API_VERSION + `/bookings/${id}/reschedule`, { booking }, headers);
}

export const updateMiscellaneousCost = (bookingId, orderItem, id) => {
    return axios.put(API_VERSION + `/bookings/${bookingId}/miscellaneous_items/${id}`, orderItem, headers);
}

export const addMiscellaneousCost = (id, order_item) => {
    return axios.post(API_VERSION + `/bookings/${id}/miscellaneous_items`, order_item, headers);
}

export const addMiscellaneousCostWithImage = (id, extension) => {
    return axios.get(API_VERSION + `/bookings/${id}/miscellaneous_items/presigned_photo_url?ext=.${extension}`)
}

export const repostJob = (id) => {
    return axios.put(API_VERSION + `/bookings/${id}/reschedule/repost`, headers);
}

export const updateBooking = (id, booking) => {
    return axios.put(API_VERSION + `/bookings/${id}`, { booking }, headers);
}

export const fetchBookingMetrics = () => {
    return axios.get(API_VERSION + `/users/bookings_metrics`, headers);
}

export const contestBooking = (id, data) => {
    return axios.put(API_VERSION + `/bookings/${id}/contest`, data, headers);
}

export const linkBankAccount = (params) => {
    return axios.put(API_VERSION + '/bank_accounts?tos_accepted=' + params.tos_accepted + '&account_id=' + params.account_id + '&token=' + params.token, headers)
}

export const validateAVHeroCode = (code) => {
    return axios.get(API_VERSION + '/users/provider?code=' + code);
}

export const fetchStripeConnectURL = () => {
    return axios.get(API_VERSION + '/bank_accounts/account_link');
}