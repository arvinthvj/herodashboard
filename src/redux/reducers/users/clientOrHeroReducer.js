import { ConfigActionTypes, ActionTypes } from '../../actions/usersActions/actionType';
import storage from '../../../utility/storage';
import actions from 'redux-form/lib/actions';

const bookingData = storage.get('bookingData', null);
const savedAddresses = storage.get('savedAddresses', null);

const initialState = {
    bookingCreated: false,

    savedAddresses: savedAddresses,
    createBookingLoading: false,
    bookingData: bookingData,
    userFavoriteHerosList: null,
    bookingList: null,
    // bookingList: null,
    isCancelPopupTrue: false,
    isReschedulePopupTrue: false,
    isMiscellaneousPopupTrue: false,
    isViewMiscellaneousPopupTrue: false,
    isRateAndReviewTrue: false,
    openCompletePopup: false,
    isTbdPopup : false,
    updateBookingObject: null,
    isLoading: false,
    isCardLoading: false,
    isContestPopupTrue: false,
    bookingFilter: null,
    payouts: null,
    clientOrders: null,
    fetchingBookings: false,

    isBlocking: true,
    clientOpenItemCount: 0,
    clientNewItemCount: 0,
    clientActiveItemCount: 0,
    heroOngoingCount: 0,
    heroAcceptedCount: 0,

    stripeConnectURL: null
}

const updateObject = (oldState, updatedProps) => {
    return {
        ...oldState,
        ...updatedProps
    }
}

export const clientOrHeroReducer = (state = initialState, action) => {
    switch (action.type) {

        case ActionTypes.OPEN_CANCEL_POPUP:
            return updateObject(state, { updateBookingObject: action.payload, isCancelPopupTrue: true })
        case ActionTypes.OPEN_TBD_POPUP:
            return updateObject(state, { updateBookingObject: action.payload, isTbdPopup: true })
        case ActionTypes.OPEN_COMPLETE_POPUP:
            return updateObject(state, { updateBookingObject: action.payload, openCompletePopup: true })
        case ActionTypes.RESCHEDULE_JOB_CLICKED:
            return updateObject(state, { updateBookingObject: action.payload, isReschedulePopupTrue: true })
        case ActionTypes.MISCELLANEOUS_COST_CLICKED:
            return updateObject(state, { updateBookingObject: action.payload, isMiscellaneousPopupTrue: true })
        case ActionTypes.VIEW_MISCELLANEOUS_COST_CLICKED:
            return updateObject(state, { updateBookingObject: action.payload, isViewMiscellaneousPopupTrue: true })
        case ActionTypes.OPEN_CONTEST_JOB:
            return updateObject(state, { updateBookingObject: action.payload, isContestPopupTrue: true })
        case ActionTypes.RATE_AND_REVIEW_CLCIKED:
            return updateObject(state, { updateBookingObject: action.payload, isRateAndReviewTrue: true })
        case ActionTypes.CLOSE_POPUP:
            return updateObject(state, { updateBookingObject: null, openCompletePopup: false, isCancelPopupTrue: false, isReschedulePopupTrue: false, isContestPopupTrue: false, isMiscellaneousPopupTrue: false, isViewMiscellaneousPopupTrue: false, isRateAndReviewTrue: false, })

        case ActionTypes.RESET_OBJECTS:
            return updateObject(state, { bookingData: null, bookingFilter: null })

        case ActionTypes.UPDATE_BOOKING_STATE:
            return updateObject(state, { bookingData: action.payload })

        case ActionTypes.BOOKING_CREATED:
            return updateObject(state, { bookingCreated: action.payload })

        case ActionTypes.BLOCK_ROUTE:
            return updateObject(state, { isBlocking: action.payload })

        case ActionTypes.CREATE_BOOKING_PENDING:
            return updateObject(state, { createBookingLoading: true, bookingFilter: null })
        case ActionTypes.CREATE_BOOKING_FULFILLED:
            return updateObject(state, {
                createBookingLoading: false,
                bookingData: action.payload.updateBookingState,
                bookingFilter: null,
                savedAddresses: action.payload.SavedAddresses
            })

        case ActionTypes.GET_PAYOUTS_PENDING:
            return updateObject(state, { isLoading: true })
        case ActionTypes.GET_PAYOUTS_FULFILLED:
            return updateObject(state, { payouts: action.payload ? action.payload.payouts : null, isLoading: false })

        case ActionTypes.GET_CLIENT_ORDERS_PENDING:
            return updateObject(state, { isLoading: true })
        case ActionTypes.GET_CLIENT_ORDERS_FULFILLED:
            return updateObject(state, { clientOrders: action.payload ? action.payload.orders : null, isLoading: false })

        case ActionTypes.GET_USER_FAVORITE_HEROS_LIST_PENDING:
            return updateObject(state, { isLoading: true })
        case ActionTypes.GET_USER_FAVORITE_HEROS_LIST_FULFILLED:
            return updateObject(state, { userFavoriteHerosList: action.payload, isLoading: false })

        case ActionTypes.DELETE_USER_FAVOURITE_HERO_PENDING:
            return updateObject(state, { isLoading: true })
        case ActionTypes.DELETE_USER_FAVOURITE_HERO_FULFILLED:
            return updateObject(state, { isLoading: action.payload && action.payload.stopLoader ? true : false })

        case ActionTypes.ADD_CARD_PENDING:
            return updateObject(state, { isCardLoading: true })
        case ActionTypes.ADD_CARD_FULFILLED:
            return updateObject(state, { bookingData: action.payload, isCardLoading: false })

        case ActionTypes.GET_CLINET_BOOKING_LIST_PENDING:
            return updateObject(state, { bookingList: null, fetchingBookings: true })
        case ActionTypes.GET_CLINET_BOOKING_LIST_FULFILLED:
            if (action.payload && action.payload.booking) {
                return updateObject(state, { bookingList: action.payload.booking, bookingFilter: action.payload.filter, fetchingBookings: false })
            } else {
                return updateObject(state, { bookingList: null, fetchingBookings: false })
            }
        case ActionTypes.GET_HERO_JOBS_LIST_PENDING:
            return updateObject(state, { bookingList: null })
        case ActionTypes.GET_HERO_JOBS_LIST_FULFILLED:

            if (action.payload && action.payload.booking) {
                return updateObject(state, { bookingList: action.payload.booking, bookingFilter: action.payload.filter })
            } else {
                return updateObject(state, { bookingList: null })
            }

        case ActionTypes.CANCEL_BOOKING_PENDING:
            return updateObject(state, {})
        case ActionTypes.CANCEL_BOOKING_FULFILLED:
            return updateObject(state, {
                bookingList: action.payload.bookingList,
                isCancelPopupTrue: action.payload.isCancelPopupTrue !== undefined ? action.payload.isCancelPopupTrue : true,
            })

        case ActionTypes.ACCEPT_JOB_PENDING:
            return updateObject(state, { isAcceptBookingLoading: true })
        case ActionTypes.ACCEPT_JOB_FULFILLED:
            return updateObject(state, { isAcceptBookingLoading: false, bookingList: action.payload.bookingList })

        case ActionTypes.ACCEPT_RESCHEDULED_JOB_PENDING:
            return updateObject(state, { isAcceptBookingLoading: true })
        case ActionTypes.ACCEPT_RESCHEDULED_JOB_FULFILLED:
            return updateObject(state, { isAcceptBookingLoading: false, bookingList: action.payload.bookingList })

        case ActionTypes.ADD_RATE_AND_REVIEW_PENDING:
            return updateObject(state, {})
        case ActionTypes.ADD_RATE_AND_REVIEW_FULFILLED:

            return updateObject(state, { bookingList: action.payload.bookingList })

        case ActionTypes.GET_CARD_DETAILS_PENDING:
            return updateObject(state, { isCardLoading: true })
        case ActionTypes.GET_CARD_DETAILS_FULFILLED:
            return updateObject(state, { bookingData: action.payload, isCardLoading: false })

        case ActionTypes.RESCHEDULE_JOB_PENDING:
            return updateObject(state, {})
        case ActionTypes.RESCHEDULE_JOB_FULFILLED:
            return updateObject(state, {
                bookingList: action.payload.bookingList,
                isReschedulePopupTrue: action.payload.isReschedulePopupTrue !== undefined ? action.payload.isReschedulePopupTrue : true
            })

        case ActionTypes.REPOST_JOB_PENDING:
            return updateObject(state, {})
        case ActionTypes.REPOST_JOB_FULFILLED:
            return updateObject(state, { bookingList: action.payload.bookingList })

        case ActionTypes.UPDATE_BOOKING_PENDING:
            return updateObject(state, {})
        case ActionTypes.UPDATE_BOOKING_FULFILLED:
            if (action.payload && action.payload.bookingList) {
                return updateObject(state, {
                    bookingList: action.payload.bookingList,
                    openCompletePopup: false
                })
            } else {
                return updateObject(state, { bookingList: [], openCompletePopup: false })
            }

        case ActionTypes.ADD_MISCELLANEOUS_COST_PENDING:
            return updateObject(state, {})
        case ActionTypes.ADD_MISCELLANEOUS_COST_FULFILLED:
            return updateObject(state, {
                bookingList: action.payload.bookingList,
                isMiscellaneousPopupTrue: action.payload.isMiscellaneousPopupTrue !== undefined ? action.payload.isMiscellaneousPopupTrue : true
            })

        case ActionTypes.CONTEST_JOB_PENDING:
            return updateObject(state, {})
        case ActionTypes.CONTEST_JOB_FULFILLED:
            if (action.payload && action.payload.bookingList) {
                return updateObject(state, {
                    bookingList: action.payload.bookingList,
                    isContestPopupTrue: action.payload.isContestPopupTrue !== undefined ? action.payload.isContestPopupTrue : true
                })
            } else {
                return updateObject(state, { bookingList: [] })
            }

        case ActionTypes.BOOKING_METRICS_FULLFILLED:
            return updateObject(state, {
                clientOpenItemCount: action.payload && action.payload.count,
                clientNewItemCount: action.payload && action.payload.new,
                clientActiveItemCount: action.payload && action.payload.completed,
                heroOngoingCount: action.payload && action.payload.ongoing,
                heroAcceptedCount: action.payload && action.payload.open,
                clientClosedCount: action.payload && action.payload.closed
            })

        case ActionTypes.FETCH_STRIPE_CONNECT_URL_PENDING:
            return updateObject(state, {})
        case ActionTypes.FETCH_STRIPE_CONNECT_URL_FULFILLED:
            if (action.payload && action.payload) {
                return updateObject(state, {
                    stripeConnectURL: action.payload.account_link,
                })
            } else {
                return updateObject(state, {})
            }
        default: return state;
    }
}