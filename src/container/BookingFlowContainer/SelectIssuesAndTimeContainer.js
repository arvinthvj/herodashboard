import React, { Component } from 'react';
import SelectIssuesAndTime from '../../components/BookingFlow/SelectIssuesAndTime';
import * as actions from '../../redux/actions/index';
import { connect } from 'react-redux';
import { routes, TypesOfIssues } from '../../utility/constants/constants';
import { validateAVHeroCode } from '../../api/bookingAPI';
import { toastInfo, } from '../../utility/utility';
import storage from '../../utility/storage';
import { withRouter } from 'react-router'
const cloneDeep = require('clone-deep');

class SelectIssuesAndTimeContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            business_card_hero_code: null
        }
    }

    componentWillUnmount = () => {
        // const currentRoute = this.props.history.location.pathname;
        // if (currentRoute !== routes.LOCATION_AND_PAYMENT_DETAIL && currentRoute !== routes.REVIEW_AND_CONFIRM) {
        //     showConfirmAlert("Cancel Booking?", "Please Confirm", (response) => {
        //          
        //     })
        // }
    }

    componentDidMount = () => {
        // this.props.isBlocking(true);
        // this.props.bookingCreated(false)
        let business_card_booking = storage.get('booking_from_business_card', null)
        if (business_card_booking) {
            this.setState({ business_card_hero_code: business_card_booking.hero_code })
            storage.remove('booking_from_business_card')
        }
    }
    addIssuesAndTime = async (values) => {
        console.log(values);
        // this.props.isBlocking(false);

        const IssuesAndTImeData = cloneDeep(values);

        if (IssuesAndTImeData.asap) {
            IssuesAndTImeData['category'] = 'asap';
            IssuesAndTImeData.scheduled_at = new Date();
        } else {
            IssuesAndTImeData['category'] = 'future';
        }

        const booking_services_attributes = IssuesAndTImeData.services.map((issue, i) => {
            if (issue) {
                return { service_id: i }
            }
        })
        booking_services_attributes.map((service, i) => {
            if (!service) {
                booking_services_attributes.splice(i, 1)
            }
        })
        // delete IssuesAndTImeData.issues;
        IssuesAndTImeData['booking_services_attributes'] = booking_services_attributes.filter(service => service);

        if (values.code && this.props.user) {
            //validate code
            this.setState({
                isLoading: true
            })

            let response = await validateAVHeroCode(values.code)

            this.setState({
                isLoading: false
            })

            if (response.data.success === "true") {
                IssuesAndTImeData["preferred_provider_id"] = response.data.user.id;
                const ServiceProviderServices = cloneDeep(response.data.user.services);
                let index = [];
                IssuesAndTImeData.booking_services_attributes.map(service => {
                    index.push(ServiceProviderServices.findIndex(s => service.service_id === s.id));

                })

                let OtherIndex = null;
                this.props.services.forEach(ser => {
                    if (ser.name === TypesOfIssues.OTHER) {
                        OtherIndex = IssuesAndTImeData.booking_services_attributes.findIndex(s => s.service_id === ser.id);
                    }
                })
                // let otherIndex = this.props.services.findIndex(s => s.name === TypesOfIssues.OTHER)
                // const otherObject = this.props.services[otherIndex];

                // otherIndex = IssuesAndTImeData.booking_services_attributes.findIndex(s => service.service_id === otherObject.id);

                if (index.includes(-1) || (OtherIndex && OtherIndex > -1)) {
                    const isExpert = ServiceProviderServices.every(s => s.experience === 'expert');
                    if (!isExpert) {
                        toastInfo("This hero doesn't support this service.");
                    } else {
                        this.props.updateBookingState({ ...this.props.bookingData, ...IssuesAndTImeData });
                        this.props.history.push({
                            pathname: routes.LOCATION_AND_PAYMENT_DETAIL,
                            // state: { ...this.props.history.location.state, ...IssuesAndTImeData }
                        });
                    }
                }
                else if (index.includes(-1)) {
                    toastInfo("The services you have selected do not match the requested HERO’s services");
                } else {
                    this.props.updateBookingState({ ...this.props.bookingData, ...IssuesAndTImeData });
                    this.props.history.push(routes.LOCATION_AND_PAYMENT_DETAIL)
                }
            } else {
                IssuesAndTImeData["preferred_provider_id"] = '';
                this.setState({
                    isLoading: false
                })
                // toastInfo("Please enter a valid avhero code");
                return;
            }
        } else {
            if (this.props.user) {
                IssuesAndTImeData["preferred_provider_id"] = '';
                this.props.updateBookingState({ ...this.props.bookingData, ...IssuesAndTImeData });
                this.props.history.push(routes.LOCATION_AND_PAYMENT_DETAIL);
            } else {
                IssuesAndTImeData["preferred_provider_id"] = '';
                this.props.updateBookingState({ ...this.props.bookingData, ...IssuesAndTImeData });
                this.props.updateIsSigningFromBooking(true);
                this.props.history.push(routes.REGISTER, { signUpAsHero: false, signUpAsUser: true });
            }
        }
    }

    render() {

        return (
            <SelectIssuesAndTime
                user={this.props.user}
                bookingData={this.props.bookingData}
                location={this.props.location}
                addIssuesAndTime={this.addIssuesAndTime}
                business_card_hero_code={this.state.business_card_hero_code}
                services={this.props.services ? this.props.services : []}
                isLoading={this.state.isLoading}
            />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.authReducer.user,
        services: state.configReducer.services,
        bookingData: state.clientOrHeroReducer.bookingData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateIsSigningFromBooking: (enable) => { dispatch(actions.updateIsSigningFromBooking(enable)) },
        bookingCreated: (value) => dispatch(actions.bookingCreated(value)),
        isBlocking: (value) => dispatch(actions.isBlocking(value)),
        updateBookingState: (updateBookingState) => dispatch(actions.updateBookingState(updateBookingState))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SelectIssuesAndTimeContainer));