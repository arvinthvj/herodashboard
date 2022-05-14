import React, { Component } from 'react';
import { address_attributes, routes } from '../../utility/constants/constants';
import getDetailAddress from '../../utility/getDetailAddress';
import LocationAndPaymentDetail from '../../components/BookingFlow/LocationAndPaymentDetail';
import { connect } from 'react-redux';
import { injectStripe } from 'react-stripe-elements';
import * as actions from '../../redux/actions/index';
import { withRouter } from 'react-router-dom';
const cloneDeep = require('clone-deep');

class LocationAndPaymentDetailContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            address_attributes: this.props.savedAddresses && this.props.savedAddresses.length > 0 ? this.props.savedAddresses[this.props.savedAddresses.length - 1] : this.props.user.address ? this.props.user.address : address_attributes,
            isAddressEmpty: false,
            isZipEmpty: false,
            card: null,
            isLoading: false,
            cardError: null
        }
        this.handleAddressSelect = this.handleAddressSelect.bind(this);
        this.addAddressAndPaymentDetails = this.addAddressAndPaymentDetails.bind(this);
    }
    componentDidMount() {
        //  
        // this.props.isBlocking(true);
        if (!this.props.bookingData.card) {
            this.props.getCardDetails(this.props.user.id);
            // alert(this.props.location.state);
        }
    }
    componentDidUpdate = (PrevProps, PrevState) => {

        if (PrevProps.isCardLoading && !this.props.isCardLoading) {
            this.setState({
                isLoading: false
            })
        }
    }

    componentWillReceiveProps = () => {

    }
    // componentWillUnmount = () => {
    //     if (this.props.history.location.pathname === routes.SELECT_ISSUES_AND_TIME) {
    //         this.props.history.push({
    //             pathname: routes.SELECT_ISSUES_AND_TIME,
    //             state: { ...this.props.location.state }
    //         });
    //     }
    // }
    async  addAddressAndPaymentDetails(data) {
        // this.props.isBlocking(false);
        this.setState({
            isLoading: true
        })

        let values = cloneDeep(data);
        values['address_attributes'] = this.state.address_attributes;
        values.address_attributes.description = values.description;
        delete values.description;
        if (values.address_attributes.latitude === '' && values.address_attributes.longitude === '') {
            delete values.address_attributes;
        }

        const bookingData = { ...this.props.bookingData, ...values };

        if (values.card.length === 0 && this.props.user && !this.props.user.cc_by_pass) {

            let { token } = await this.props.stripe.createToken({ name: "Name" });
            if (!token) {
                this.setState({
                    cardError: "Please add Card Details.",
                    isLoading: false
                })
            } else {
                this.props.addCard(token.id, bookingData);
            }
        } else {
            this.props.updateBookingState(bookingData);
            this.props.history.push(routes.REVIEW_AND_CONFIRM);
        }





        // this.props.updateBookingState(bookingData);
        // this.props.history.push({
        //     pathname: routes.REVIEW_AND_CONFIRM,
        //     // state: { ...IssuesAndDate, ...values }
        // });
    }

    async handleAddressSelect(address, onChange, name) {
        const addressFields = await getDetailAddress(address);
        //  
        // addressFields['timeZone'] = geoTz(addressFields.latitude, addressFields.longitude);

        if (onChange && name) {
            onChange(name, addressFields.street_address)
        }
        this.setState({
            address_attributes: addressFields,
        })
    };

    render() {

        return (
            <LocationAndPaymentDetail
                setState={this}
                user={this.props.user}
                bookingData={this.props.bookingData}
                savedAddresses={this.props.savedAddresses ? this.props.savedAddresses : []}
                history={this.props.history}
                location={this.props.location}
                card={this.setCardDetails}
                state={this.state}
                addAddressAndPaymentDetails={this.addAddressAndPaymentDetails}
                handleAddressSelect={this.handleAddressSelect}
            />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.authReducer.user,
        services: state.configReducer.services,
        savedAddresses: state.clientOrHeroReducer.savedAddresses,
        bookingData: state.clientOrHeroReducer.bookingData,
        isCardLoading: state.clientOrHeroReducer.isCardLoading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCardDetails: (id) => dispatch(actions.getCardDetails(id)),
        addCard: (token, bookingData) => dispatch(actions.addCard(token, bookingData)),
        isBlocking: (value) => dispatch(actions.isBlocking(value)),
        updateBookingState: (updateBookingState) => dispatch(actions.updateBookingState(updateBookingState))
    }
}

export default injectStripe(connect(mapStateToProps, mapDispatchToProps)(withRouter(LocationAndPaymentDetailContainer)));