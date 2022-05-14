import React, { Component } from 'react';
import { CardElement, injectStripe, AddressSection, CardSection, CardNumberElement, CardExpiryElement, CardCVCElement, PostalCodeElement, } from 'react-stripe-elements';
import { routes } from '../../utility/constants/constants';
import * as actions from '../../redux/actions/index';
import { connect } from 'react-redux';
import { sweetSuccessAlert } from '../../utility/sweetAlerts/sweetAlerts';
import PulseLoader from "react-spinners/PulseLoader";
import { css } from "@emotion/core";

class CheckoutForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
        this.submit = this.submit.bind(this);
    }

    componentDidUpdate = (PrevProps, PrevState) => {
        console.log(this.props);

        // if (this.props.cardValues !== '') {
        //     sweetSuccessAlert("Card Added", "Your Card is Succesfully added", "Okay");
        //     // this.props.setUpdateCard(false);
        //     this.setState({
        //         isLoading: false
        //     })
        // }
    }

    loading = () => {
        this.setState({
            isLoading: true
        })
    }

    async submit(ev) {
        this.loading();
        let { token } = await this.props.stripe.createToken({ name: "Name" });

        // this.props.history.push({
        //     pathname: routes.REVIEW_AND_CONFIRM,
        //     state: {}
        // });

        this.props.addCard(token.id, this.props.setCard);

    }

    render() {

        return (
            <div className="checkout" style={{
                width: '100%',
                paddingTop: '15px',
                paddingBottom: '15px'
            }}>

                <CardElement />
                {/* <div className="payment_card" style={{ margin: '5px', paddingRight: '0px' }}>
                    <span className="label_card label_modify" style={{ marginRight: '15px' }}>card <img src="images/icons/icn_card.png" alt="Card" /></span>

                    <CardNumberElement
                        className="input_modify card_field" />

                </div>
                <div className="payment_card" style={{ margin: '5px', paddingRight: '0px', width: '50%' }}>
                    <span className="label_card label_modify" style={{ marginRight: '15px' }}>exp </span>
                    <CardExpiryElement
                        className="input_modify expry_dat_field" />
                </div>
                <div className="payment_card" style={{ margin: '5px', paddingRight: '0px', width: '50%' }}>
                    <span className="label_card label_modify" style={{ marginRight: '15px' }}>cvc </span>
                    <CardCVCElement
                        className="input_modify expry_dat_field"
                    />
                </div> */}

                <button type="button" className="theme_primary theme_btn_lg theme_btn" onClick={this.submit}>
                    {this.state.isLoading ?
                        <PulseLoader
                            sizeUnit={"px"}
                            size={5}
                            color={'#ffffff'}
                            loading={this.state.isLoading} /> : "Add Card"}
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addCard: (token, setCard) => dispatch(actions.addCard(token, setCard))
    }
}

export default injectStripe(connect(mapStateToProps, mapDispatchToProps)(CheckoutForm));
