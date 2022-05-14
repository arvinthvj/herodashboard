import React, { useState, useRef, useEffect } from 'react';
import { Form, Formik, Field } from 'formik';
import { useDispatch, useSelector } from "react-redux";
import { validateCreditCardForm } from '../../../../utility/validator/FormValidation/FormValidation';
import * as actions from '../../../../redux/actions/index';
import { CardElement, injectStripe, AddressSection, CardSection, CardNumberElement, CardExpiryElement, CardCVCElement, PostalCodeElement, StripeProvider } from 'react-stripe-elements';
import { errorStyle, themeBlackColor } from '../../../../utility/constants/constants';
import RingLoader from 'react-spinners/RingLoader';
import { css } from "@emotion/core";
import $ from 'jquery';
import { StripeKey } from '../../../../config';
import Oux from '../../../../hoc/Oux/Oux';

const BankCardDetails = (props) => {

    const [updateCard, setUpdateCard] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const bookingData = useSelector(state => state.clientOrHeroReducer.bookingData);
    const user = useSelector(state => state.authReducer.user);
    const isCardLoading = useSelector(state => state.clientOrHeroReducer.isCardLoading)
    const didMountRef = useRef(false);

    const overrideSpinnerCSS = css`
    margin: 0 auto;`;

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
            if (!bookingData || !bookingData.card) {
                dispatch(actions.getCardDetails(user.id));
            }
        } else didMountRef.current = true
    })

    const setCardValue = (setFieldValue) => {
        setUpdateCard(true);
        setFieldValue('card', '')
    }

    const addCreditCard = (values) => {
        props.addCreditCard(values);
    }

    const initialFormValues = {
        card: bookingData && bookingData.card ? bookingData.card : []
    }

    const addedCard = async (e) => {
        if (e.error) {
            props.setState.setState({
                cardError: e.error.message
            })
        } else {
            props.setState.setState({
                cardError: null
            })
        }
    }

    return (
        <div style={{ display: 'block' }} className="tab-pane active show fade" id="card_details" role="tabpanel" aria-labelledby="card_details_tab">
            <h4 className="ml-4 ft_Weight_600 text-uppercase wow fadeInDown"> Card Details</h4>
            <div className="row">
                <div className="col-sm-12 col-md-8">
                    <div className="add_card_details bank_ac_card refer_tab_cont">
                        <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>{props.state.cardError}</span>
                        <Formik
                            enableReinitialize={true}
                            initialValues={initialFormValues}
                            onSubmit={addCreditCard}
                        // validationSchema={validateCreditCardForm}
                        >
                            {(formikProps) => {
                                const errors = formikProps.errors
                                const touched = formikProps.touched
                                console.log(errors, 'errors', touched, 'touched')

                                return (
                                    <Oux>
                                        <Form className={((updateCard && formikProps.values.card.length === 0) || (!isCardLoading && formikProps.values.card.length === 0)) ? "" : "add_card_details"}>
                                            {(((updateCard && formikProps.values.card.length === 0) || (!isCardLoading && formikProps.values.card.length === 0))) ?
                                                <>
                                                    <div className="payment_card">
                                                        {/* <StripeProvider apiKey={StripeKey()}> */}
                                                        <div className="checkout" style={{
                                                            width: '100%',
                                                            paddingTop: '15px',
                                                            paddingBottom: '15px'
                                                        }}>
                                                            <CardElement onChange={addedCard} />
                                                        </div>

                                                        {/* </StripeProvider> */}
                                                    </div>
                                                </>
                                                :
                                                formikProps.values.card.map(card => (

                                                    <div className="payment_detail_info">
                                                        <article class="left_side_payment">
                                                            <h5 className="h5_title">{`Card ending in XXXX XXXX XXXX ${card.last4}`}</h5>
                                                        </article>
                                                        <div class="card_body">
                                                            <p className="card_title_info">Expries {card.exp_month}/{card.exp_year}</p>
                                                            <button type="button" className="a_tag_to_button card_info_anchor" onClick={() => setCardValue(formikProps.setFieldValue)}>Update</button>
                                                        </div>
                                                    </div>
                                                ))
                                            }

                                            {(((updateCard && formikProps.values.card.length === 0) || (!isCardLoading && formikProps.values.card.length === 0)))
                                                ? <div className="actions_btns mt-2 text-center">
                                                    {props.state.isLoading ?
                                                        <RingLoader
                                                            css={overrideSpinnerCSS}
                                                            sizeUnit={"px"}
                                                            size={30}
                                                            color={themeBlackColor}
                                                            loading={props.state.isLoading} /> :
                                                        <button type="submit" disabled={props.state.cardError ? true : false} className={props.state.cardError ? "theme_btn w-420 mb-2 " : "theme_btn theme_primary w-420 mb-2 "} >Update</button>
                                                    }
                                                </div>
                                                : null}
                                        </Form>
                                    </Oux>
                                )
                            }}
                        </Formik>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default BankCardDetails