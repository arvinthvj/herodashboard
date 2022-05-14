import React, { Component } from 'react';
import ReviewAndConfirm from '../../components/BookingFlow/ReviewAndConfirm';
import * as actions from '../../redux/actions/index';
import { convertDateToDifferentTZ } from '../../utility/utility';
import { connect } from 'react-redux';
import { routes } from '../../utility/constants/constants';
import moment from 'moment'
import { withRouter } from 'react-router-dom';

const cloneDeep = require('clone-deep');

class ReviewAndConfirmContainer extends Component {

    componentDidMount() {
        // this.props.isBlocking(true);
        console.log(this.props.bookingData);

        const servicesIds = [];

        // this.props.bookingData.booking_services_attributes.map(service =>
        //     servicesIds.push(service.service_id)
        // )
        let servicesIdsString = ''
        this.props.bookingData.booking_services_attributes.map(service => {
            servicesIdsString = servicesIdsString.concat('service_ids[]=' + service.service_id + '&')
        })

        this.props.getUserFavoriteHerosList(servicesIdsString, this.props.bookingData.address_attributes.latitude, this.props.bookingData.address_attributes.longitude);
        console.log(this.props.location.state);
    }

    // componentWillUnmount = () => {
    //     console.log(this.props.history);
    //     if (this.props.history.location.pathname === routes.LOCATION_AND_PAYMENT_DETAIL) {
    //         this.props.history.push({
    //             pathname: routes.LOCATION_AND_PAYMENT_DETAIL,
    //             state: { ...this.props.location.state }
    //         });
    //     }
    // }
    addReviewAndConfirm = (values) => {
        let booking = cloneDeep(values);
        // this.props.isBlocking(false);
        booking = { ...this.props.bookingData, ...booking }

        if (!booking.asap) {
            // booking.scheduled_at = convertDateToDifferentTZ(booking.scheduled_at, booking.address_attributes.timeZone);
        } else {
            delete booking.scheduled_at;
        }

        booking.preferred_provider_id = parseInt(booking.preferred_provider_id);
        booking.scheduled_at = moment(booking.scheduled_at).format('YYYY-MM-DDTHH:mm::ss[Z]')
        delete booking.asap;
        delete booking.services;
        delete booking.address;
        this.props.createBooking(booking);
    }

    render() {
        return (
            <ReviewAndConfirm
                history={this.props.history}
                user={this.props.user}
                createBookingLoading={this.props.createBookingLoading}
                bookingData={this.props.bookingData}
                addReviewAndConfirm={this.addReviewAndConfirm}
                services={this.props.services}
                settings={this.props.settings}
                userFavoriteHerosList={this.props.userFavoriteHerosList ? this.props.userFavoriteHerosList : []}
            />
        )
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.authReducer.user,
        services: state.configReducer.services,
        userFavoriteHerosList: state.clientOrHeroReducer.userFavoriteHerosList,
        createBookingLoading: state.clientOrHeroReducer.createBookingLoading,
        bookingData: state.clientOrHeroReducer.bookingData,
        settings: state.configReducer.settings,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createBooking: (data) => dispatch(actions.createBooking(data)),
        getUserFavoriteHerosList: (serviceIds, lat, lng) => dispatch(actions.getUserFavoriteHerosList(serviceIds, lat, lng))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReviewAndConfirmContainer));