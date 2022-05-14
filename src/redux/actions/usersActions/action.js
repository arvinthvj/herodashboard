import { ActionTypes } from './actionType';
import * as API from '../../../api/bookingAPI';
import storage from '../../../utility/storage';
import { toastMsg, closeModel, clientFilterFromAPIFilterKey, heroFilterFromAPIFilterKey, heroFilterKey, clientFilterKey } from '../../../utility/utility';
import { routes, roles, ClientFilterSections, next_route_filter, hero_next_route_filter, ClientJobStatus, HeroJobStatus } from '../../../utility/constants/constants';
import { sweetSuccessAlert } from '../../../utility/sweetAlerts/sweetAlerts';
import store from '../../store/store';
const cloneDeep = require('clone-deep');
const queryString = require('query-string');

function getHistory() {
    const storeState = store.getState();
    const history = storeState.historyReducer.history;
    return history;
}


export const openPopUp = (bookingObject) => {
    return {
        type: ActionTypes.OPEN_CANCEL_POPUP,
        payload: bookingObject
    }
}
export const openTbdPopup = (bookingObject) => {
    return {
        type: ActionTypes.OPEN_TBD_POPUP,
        payload: bookingObject
    }
}
export const openCompletedPopUp = (bookingObject) => {
    return {
        type: ActionTypes.OPEN_COMPLETE_POPUP,
        payload: bookingObject
    }
}

export const rescheduleJobClicked = (bookingObject) => {
    return {
        type: ActionTypes.RESCHEDULE_JOB_CLICKED,
        payload: bookingObject
    }
}

export const miscellaneousCostClicked = (bookingObject) => {
    return {
        type: ActionTypes.MISCELLANEOUS_COST_CLICKED,
        payload: bookingObject
    }
}

export const viewMiscellaneousCostClicked = (bookingObject) => {
    return {
        type: ActionTypes.VIEW_MISCELLANEOUS_COST_CLICKED,
        payload: bookingObject
    }
}

export const openContestPopup = (bookingObject) => {
    return {
        type: ActionTypes.OPEN_CONTEST_JOB,
        payload: bookingObject
    }
}


export const rateAndReviewClicked = (bookingObject) => {
    return {
        type: ActionTypes.RATE_AND_REVIEW_CLCIKED,
        payload: bookingObject
    }
}

export const closePopUp = () => {
    return {
        type: ActionTypes.CLOSE_POPUP,
    }
}

export const resetObjects = () => {
    storage.remove('bookingData');
    return {
        type: ActionTypes.RESET_OBJECTS,
    }
}

export const updateBookingState = (updateBookingState) => {
    storage.set('bookingData', updateBookingState)
    return {
        type: ActionTypes.UPDATE_BOOKING_STATE,
        payload: updateBookingState
    }
}


export const addCard = (token, bookingData) => {
    return (dispatch, getState) => {
        // let bookingData = getState().clientOrHeroReducer.bookingData;
        dispatch({
            type: ActionTypes.ADD_CARD,
            payload: API.addCard(token)
                .then(response => {
                    const history = getHistory();
                    if (!response.data.error) {
                        if (history.location.pathname !== routes.LOCATION_AND_PAYMENT_DETAIL) {
                            sweetSuccessAlert("Card Added", "Your Card is Succesfully added", "Okay");
                        }
                        // setCard("card", response.data.card);
                        bookingData['card'] = [response.data.card];
                        ;
                        dispatch(updateBookingState(bookingData));
                        if (history.location.pathname === routes.LOCATION_AND_PAYMENT_DETAIL) {
                            history.push(routes.REVIEW_AND_CONFIRM);
                        }
                    }
                    return bookingData;
                })
                .catch(error => {
                    console.log(error);
                })
        })
    }
}

export const getCardDetails = (id) => {
    return (dispatch, getState) => {
        let bookingData = cloneDeep(getState().clientOrHeroReducer.bookingData ? getState().clientOrHeroReducer.bookingData : {});
        dispatch({
            type: ActionTypes.GET_CARD_DETAILS,
            payload: API.getCardDetails(id)
                .then(response => {
                    if (!response.data.error) {
                        // if (bookingData) {
                        //     bookingData['card'] = response.data.cards;
                        // } else {

                        //     bookingData = {};
                        bookingData['card'] = response.data.cards;
                        ;
                        // }
                        return bookingData;
                    } else {

                        bookingData['card'] = [];
                        return bookingData;
                    }

                })
                .catch(error => {
                    console.log(error);
                })
        })
    }
}

export const bookingCreated = (value) => {
    return {
        type: ActionTypes.BOOKING_CREATED,
        payload: value
    }
}

export const createBooking = (booking) => {
    return (dispatch, getState) => {
        const SavedAddresses = cloneDeep(getState().clientOrHeroReducer.savedAddresses ? getState().clientOrHeroReducer.savedAddresses : []);
        dispatch({
            type: ActionTypes.CREATE_BOOKING,
            payload: API.createBooking(booking)
                .then(response => {

                    const history = getHistory();
                    if (!response.data.error) {
                        dispatch(bookingCreated(true))
                        let updateBookingState = {};
                        updateBookingState['card'] = booking.card;
                        SavedAddresses.push(booking.address_attributes)
                        storage.set('savedAddresses', SavedAddresses);
                        storage.remove('bookingData');
                        history.push({
                            search: `?filter=${ClientFilterSections.requested.key}`,
                            pathname: routes.DASHBOARD
                        });
                        return { updateBookingState, SavedAddresses };
                    } else {
                        history.push(routes.SELECT_ISSUES_AND_TIME);
                        const bookingData = cloneDeep(getState().clientOrHeroReducer.bookingData);
                        return { updateBookingState: bookingData, SavedAddresses }
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        })
    }
}

export const addRateAndReview = (id, values) => {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.ADD_RATE_AND_REVIEW,
            payload: API.addRateAndReview(id, values)
                .then(response => {
                    let bookingList = cloneDeep(getState().clientOrHeroReducer.bookingList);
                    const history = getHistory();
                    if (!response.data.error) {
                        closeModel();
                        toastMsg("Review added successfully.");
                        dispatch(fetchBookingMetrics())
                        const index = bookingList.findIndex(booking => booking.id === id);

                        bookingList[index]['review'] = response.data.review;

                        return { bookingList }
                    } else {
                        return { bookingList }
                    }

                })
                .catch(error => {
                    console.log(error);
                })
        })
    }
}

export const getUserFavoriteHerosList = (serviceIds, lat, lng) => dispatch => {
    (
        dispatch({
            type: ActionTypes.GET_USER_FAVORITE_HEROS_LIST,
            payload: API.getUserFavoriteHerosList(serviceIds, lat, lng)
                .then(response => {
                    return response.data.favorites
                })
                .catch(error => {
                    console.log(error);
                })
        })
    )
}

export const getPayouts = () => dispatch => {
    (
        dispatch({
            type: ActionTypes.GET_PAYOUTS,
            payload: API.getPayouts()
                .then(response => {
                    return response.data
                })
                .catch(error => {
                    console.log(error);
                    return error
                })
        })
    )
}

export const getClientOrders = () => dispatch => {
    (
        dispatch({
            type: ActionTypes.GET_CLIENT_ORDERS,
            payload: API.getClientOrders()
                .then(response => {
                    return response.data
                })
                .catch(error => {
                    console.log(error);
                    return error
                })
        })
    )
}

export const deleteUserFavoriteHero = (provider_id) => dispatch => {
    (
        dispatch({
            type: ActionTypes.DELETE_USER_FAVOURITE_HERO,
            payload: API.deleteUserFavoriteHero(provider_id)
                .then(response => {
                    if (response.data.success === "true") {
                        dispatch(getUserFavoriteHerosList())
                        return { ...response.data, stopLoader: false }
                    }
                    else {
                        return { ...response.data, stopLoader: true }
                    }
                })
                .catch(error => {
                    console.log(error);
                    return { ...error, stopLoader: true }
                })
        })
    )
}

export const getClientBookingList = (filter) => dispatch => {
    (
        dispatch({
            type: ActionTypes.GET_CLINET_BOOKING_LIST,
            payload: API.getClientBookingList(filter)
                .then(response => {
                    let filterObject = clientFilterFromAPIFilterKey(filter);
                    return { booking: response.data.bookings, filter: filterObject.key }
                }).catch(error => {
                    console.log(error)
                })
        })
    )
}

export const getHeroJobsList = (filter) => dispatch => {
    (
        dispatch({
            type: ActionTypes.GET_HERO_JOBS_LIST,
            payload: API.getHeroJobsList(filter)
                .then(response => {
                    let filterObject = heroFilterFromAPIFilterKey(filter);
                    return { booking: response.data.bookings, filter: filterObject.key }
                })
                .catch(error => {
                    console.log(error);
                })
        })
    )
}

export const bookingCancelClicked = (id, booking) => {
    return (dispatch, getState) => {
        let bookingList = cloneDeep(getState().clientOrHeroReducer.bookingList);
        (
            dispatch({
                type: ActionTypes.CANCEL_BOOKING,
                payload: API.bookingCancelClicked(id, booking)
                    .then(response => {

                        if (!response.data.error) {
                            if (getState().authReducer.user.role === roles.client) {
                                dispatch(fetchBookingMetrics());
                            }
                            closeModel();
                            toastMsg("booking is successfully cancelled");
                            const index = bookingList.findIndex(booking => booking.id === id);
                            bookingList.splice(index, 1);

                            const history = getHistory();
                            let status = ClientJobStatus.cancelled.status;
                            let filter = next_route_filter(status)
                            history.push({
                                search: `?filter=${filter}`,
                                pathname: routes.DASHBOARD
                            });

                            return { bookingList, isCancelPopupTrue: false }
                        } else {
                            return { bookingList, isCancelPopupTrue: true }
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
        )
    }
}

export const acceptJob = (id) => {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.ACCEPT_JOB,
            payload: API.acceptJob(id)
                .then(response => {
                    let bookingList = cloneDeep(getState().clientOrHeroReducer.bookingList);
                    let user = cloneDeep(getState().authReducer.user);
                    const history = getHistory();
                    if (!response.data.error) {
                        dispatch(fetchBookingMetrics());
                        toastMsg("You have successfully accepted this job.");
                        const index = bookingList.findIndex(booking => booking.id === id);
                        bookingList.splice(index, 1);
                        let status = HeroJobStatus.assigned.status;
                        let filter = hero_next_route_filter(status)
                        history.push({
                            search: `?filter=${filter}`,
                            pathname: routes.DASHBOARD
                        });

                        return { bookingList }
                    } else {
                        let { filter } = queryString.parse(history.location.search);

                        if (!user.account && (user.role === roles.service_provider)) {
                            history.push({
                                search: `?filter=${filter}`,
                                pathname: routes.BANK_DETAILS
                            });
                        }
                        return { bookingList }
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        })
    }
}

export const acceptRescheduleJob = (id) => {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.ACCEPT_RESCHEDULED_JOB,
            payload: API.acceptRescheduleJob(id)
                .then(response => {
                    const history = getHistory();
                    let bookingList = cloneDeep(getState().clientOrHeroReducer.bookingList);
                    let user = cloneDeep(getState().authReducer.user);
                    if (!response.data.error) {
                        if (getState().authReducer.user.role === roles.client) {
                            dispatch(fetchBookingMetrics());
                        }
                        toastMsg("You have successfully accepted this job.");
                        const index = bookingList.findIndex(booking => booking.id === id);
                        bookingList.splice(index, 1);

                        let status = ClientJobStatus.assigned.status;
                        let filter = next_route_filter(status);
                        if (getState().authReducer.user.role === roles.service_provider) {
                            filter = hero_next_route_filter(status)
                        }
                        if (getState().clientOrHeroReducer.bookingFilter === filter) {
                            //if filter is same then pushing to same filter doesn't affect anything
                            if (getState().authReducer.user.role === roles.client) {
                                let apiFilter = clientFilterKey(filter)
                                dispatch(getClientBookingList(apiFilter));
                            } else {
                                let apiFilter = heroFilterKey(filter)
                                dispatch(getHeroJobsList(apiFilter));
                            }
                        } else {
                            history.push({
                                search: `?filter=${filter}`,
                                pathname: routes.DASHBOARD
                            });
                        }
                        return { bookingList }
                    } else {
                        if (!user.account) {
                            let { filter } = queryString.parse(history.location.search);
                            if (!user.account && (user.role === roles.service_provider)) {
                                history.push({
                                    search: `?filter=${filter}`,
                                    pathname: routes.BANK_DETAILS
                                });
                            }
                        }
                        return { bookingList }
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        })
    }
}

export const rescheduleJob = (id, booking, selectedFilter) => {

    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.RESCHEDULE_JOB,
            payload: API.rescheduleJob(id, booking)
                .then(response => {
                    let bookingList = cloneDeep(getState().clientOrHeroReducer.bookingList);
                    let history = getHistory();
                    let user = cloneDeep(getState().authReducer.user);
                    if (!response.data.error) {
                        closeModel();
                        dispatch(fetchBookingMetrics());
                        if (user.role === roles.service_provider) {
                            toastMsg("Reschedule request is sent to client.");
                        } else if (user.role === roles.client) {
                            toastMsg("Reschedule request is sent to hero.");
                        }

                        let status = ClientJobStatus.rescheduling.status;
                        let filter = next_route_filter(status)
                        if (getState().authReducer.user.role === roles.service_provider) {
                            filter = hero_next_route_filter(status)
                        }
                        if (getState().clientOrHeroReducer.bookingFilter === filter) {
                            //if filter is same then pushing to same filter doesn't affect anything
                            if (getState().authReducer.user.role === roles.client) {
                                let apiFilter = clientFilterKey(filter)
                                dispatch(getClientBookingList(apiFilter));
                            } else {
                                let apiFilter = heroFilterKey(filter)
                                dispatch(getHeroJobsList(apiFilter));
                            }
                        } else {
                            history.push({
                                search: `?filter=${filter}`,
                                pathname: routes.DASHBOARD
                            });
                        }



                        return { bookingList, isReschedulePopupTrue: false }
                    } else {
                        if (!user.account) {
                            let { filter } = queryString.parse(history.location.search);
                            if (!user.account && (user.role === roles.service_provider)) {
                                history.push({
                                    search: `?filter=${filter}`,
                                    pathname: routes.BANK_DETAILS
                                });
                            }
                        }
                        return { bookingList, isReschedulePopupTrue: true }
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        })
    }
}

export const updateMiscellaneousCost = (bookingId, orderItem, id) => {
    return (dispatch, getState) => {
        let bookingList = cloneDeep(getState().clientOrHeroReducer.bookingList);
        dispatch({
            type: ActionTypes.ADD_MISCELLANEOUS_COST,
            payload: API.updateMiscellaneousCost(bookingId, orderItem, id)
                .then(response => {
                    if (!response.data.error) {
                        closeModel();
                        toastMsg("Convenience Fee is updated.");
                        const index = bookingList.findIndex(booking => booking.id === bookingId);
                        const orderItemIndex = bookingList[index].order.order_items.findIndex(item => item.id === id);
                        bookingList[index].order.order_items[orderItemIndex] = response.data.order_item;
                        // bookingList[index].order.order_items.push(response.data.order_item);
                        return { bookingList, isMiscellaneousPopupTrue: false }
                    } else {
                        return { bookingList, isMiscellaneousPopupTrue: true }
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        })
    }
}

export const addMiscellaneousCost = (id, orderItem) => {
    return (dispatch, getState) => {
        let bookingList = cloneDeep(getState().clientOrHeroReducer.bookingList);
        dispatch({
            type: ActionTypes.ADD_MISCELLANEOUS_COST,
            payload: API.addMiscellaneousCost(id, orderItem)
                .then(response => {
                    if (!response.data.error) {
                        closeModel();
                        toastMsg("Convenience Fee is added.");
                        const index = bookingList.findIndex(booking => booking.id === id);
                        bookingList[index].order.order_items.push(response.data.order_item);
                        return { bookingList, isMiscellaneousPopupTrue: false }
                    } else {
                        return { bookingList, isMiscellaneousPopupTrue: true }
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        })
    }
}

export const addMiscellaneousCostWithImage = (id, orderItem, arrayBuffer, extension, orderItemId) => {
    return (dispatch, getState) => {
        if (orderItemId) {
            dispatch({
                type: ActionTypes.GET_MISCELLANEOUS_PRESIGNED_URL,
                payload: API.addMiscellaneousCostWithImage(id, extension)
                    .then(response => {
                        orderItem.order_item['photo_path'] = response.data.photo_path;
                        dispatch({
                            type: ActionTypes.UPLOAD_IMAGE_TO_S3,
                            payload: API.uploadImageToS3(response.data.presigned_url, arrayBuffer)
                                .then(response => {
                                    dispatch(updateMiscellaneousCost(id, orderItem, orderItemId));
                                })
                                .catch(error => {
                                    console.log(error);
                                })
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
        } else {
            dispatch({
                type: ActionTypes.GET_MISCELLANEOUS_PRESIGNED_URL,
                payload: API.addMiscellaneousCostWithImage(id, extension)
                    .then(response => {
                        orderItem.order_item['photo_path'] = response.data.photo_path;
                        dispatch({
                            type: ActionTypes.UPLOAD_IMAGE_TO_S3,
                            payload: API.uploadImageToS3(response.data.presigned_url, arrayBuffer)
                                .then(response => {
                                    dispatch(addMiscellaneousCost(id, orderItem));
                                })
                                .catch(error => {
                                    console.log(error);
                                })
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
        }
    }
}

export const repostJob = (id) => {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.REPOST_JOB,
            payload: API.repostJob(id)
                .then(response => {
                    let bookingList = cloneDeep(getState().clientOrHeroReducer.bookingList);

                    if (!response.data.error) {
                        dispatch(fetchBookingMetrics());
                        toastMsg("You have successfully reposted this job.");

                        const history = getHistory();
                        let status = ClientJobStatus.created.status;
                        let filter = next_route_filter(status)
                        history.push({
                            search: `?filter=${filter}`,
                            pathname: routes.DASHBOARD
                        });

                        return { bookingList }
                    } else {
                        return { bookingList }
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        })
    }
}

export const updateBooking = (id, booking) => {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.UPDATE_BOOKING,
            payload: API.updateBooking(id, booking)
                .then(response => {

                    let bookingList = cloneDeep(getState().clientOrHeroReducer.bookingList);
                    const history = getHistory();
                    if (!response.data.error) {
                        if (getState().authReducer.user.role === roles.client) {
                            dispatch(fetchBookingMetrics());
                        }
                        closeModel();
                        toastMsg("Booking is Updated.");
                        let status = booking.status;
                        let filter = next_route_filter(status)
                        if (getState().clientOrHeroReducer.bookingFilter === filter) {
                            //if filter is same then pushing to same filter doesn't affect anything
                            if (getState().authReducer.user.role === roles.client) {
                                let apiFilter = clientFilterKey(filter)
                                dispatch(getClientBookingList(apiFilter));
                            } else {
                                let apiFilter = heroFilterKey(filter)
                                dispatch(getHeroJobsList(apiFilter));
                            }
                        } else {
                            history.push({
                                search: `?filter=${filter}`,
                                pathname: routes.DASHBOARD
                            });
                        }
                        return { bookingList }
                    } else {
                        return { bookingList }
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        })
    }
}

export const contestBooking = (id, data) => {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.CONTEST_JOB,
            payload: API.contestBooking(id, data)
                .then(response => {

                    let bookingList = cloneDeep(getState().clientOrHeroReducer.bookingList);
                    console.log(data, "contest data")
                    console.log(response, "contest response")
                    if (!response.data.error) {
                        closeModel();
                        toastMsg("Booking is Updated.");
                        const history = getHistory();
                        const index = bookingList.findIndex(booking => booking.id === id);
                        bookingList.splice(index, 1);
                        let status = ClientJobStatus.contested.status;
                        let filter = next_route_filter(status)
                        if (getState().clientOrHeroReducer.bookingFilter === filter) {
                            //if filter is same then pushing to same filter doesn't affect anything
                            if (getState().authReducer.user.role === roles.client) {
                                let apiFilter = clientFilterKey(filter)
                                dispatch(getClientBookingList(apiFilter));
                            }
                        } else {
                            history.push({
                                search: `?filter=${filter}`,
                                pathname: routes.DASHBOARD
                            });
                        }
                        dispatch(fetchBookingMetrics());
                        return { bookingList, isContestPopupTrue: false }
                    } else {

                        return { bookingList, isContestPopupTrue: true }
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        })
    }
}

export const fetchBookingMetrics = () => {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.BOOKING_METRICS,
            payload: API.fetchBookingMetrics()
                .then(response => {
                    if (!response.data.error) {
                        let newCount = 0;
                        let completedCount = 0;
                        if (response.data.counts.new) {
                            newCount = response.data.counts.new;
                        }
                        if (response.data.counts.completed) {
                            completedCount = response.data.counts.completed;
                        }
                        return { count: newCount + completedCount, new: newCount, completed: completedCount, ongoing: response.data.counts.ongoing, open: response.data.counts.open, closed: response.data.counts.not_rated_closed_jobs }
                    } else {
                        return { count: 0, new: 0, completed: 0, ongoing: 0, open: 0, closed: 0 }
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        })
    }
}

export const fetchStripeConnectURL = () => {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.FETCH_STRIPE_CONNECT_URL,
            payload: API.fetchStripeConnectURL()
                .then(response => {
                    if (!response.data.error) {
                        //success
                    } else {
                        //error
                    }
                    return response.data
                })
                .catch(error => {
                    console.log(error);
                    return error;
                })
        })
    }
}