import React, { Component } from 'react'
import AdditionalInformationForm from '../../../components/RegisterForm/AdditionalInformationForm/AdditionalInformationForm'
import { connect } from 'react-redux'
import getDetailAddress from '../../../utility/getDetailAddress';
import * as actions from '../../../redux/actions/index'

class AdditionalInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phoneFieldError: null,
            address_attributes: null
        }
        this.handleAddressSelect = this.handleAddressSelect.bind(this);
    }

    validatePhoneField = (errorMsg) => {
        this.setState({ phoneFieldError: errorMsg })
    }

    async handleAddressSelect(address, onChange, name) {
        const addressFields = await getDetailAddress(address);
        this.setState({
            address_attributes: addressFields,
        })
        if (onChange && name) {
            onChange(name, address)
            onChange('address_attributes[city]', this.state.address_attributes.city)
            onChange('address_attributes[state]', this.state.address_attributes.state)
            onChange('address_attributes[zip]', this.state.address_attributes.zip)
            onChange('address_attributes[latitude]', this.state.address_attributes.latitude)
            onChange('address_attributes[longitude]', this.state.address_attributes.longitude)
        }
    };

    resetAddressAttributesState = () => {
        this.setState({ address_attributes: null })
    }

    render() {
        return (
            <AdditionalInformationForm
                validatePhoneField={this.validatePhoneField}
                handleAddressSelect={this.handleAddressSelect}
                editProfile={this.props.editProfile}
                phoneFieldError={this.state.phoneFieldError}
                address_attributes={this.state.address_attributes}
                user={this.props.user}
                resetAddressAttributesState={this.resetAddressAttributesState}
                isLoading={this.props.isLoading} />
        )
    }
}

const mapStateToProps = (state) => ({
    isSigningupForBooking: state.authReducer.isSigningupForBooking,
    user: state.authReducer.user,
    isLoading: state.authReducer.isloading
});

const mapStateToDispatch = (dispatch) => ({
    editProfile: (id, credentials) => dispatch(actions.editProfile(id, credentials))
});

export default connect(mapStateToProps, mapStateToDispatch)(AdditionalInformation)