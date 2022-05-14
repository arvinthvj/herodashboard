import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Formik, Field, ErrorMessage } from "formik";
import GooglePlacesAutoComplete from "../UI/StarRating/GooglePlacesAutoComplete";
import { PhoneNumberField } from "../UI/StarRating/PhoneNumberField";
import { LocationAndPaymentDetailsValidation } from "../../utility/validator/FormValidation/FormValidation";
import { isSafari } from "../../utility/utility";
import { Elements, StripeProvider } from "react-stripe-elements";
import { sweetSuccessAlert } from "../../utility/sweetAlerts/sweetAlerts";
import {
  CardElement,
  injectStripe,
  AddressSection,
  CardSection,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement,
} from "react-stripe-elements";
import RingLoader from "react-spinners/RingLoader";
import { getFormatedNumber } from "../../utility/utility";
import { css } from "@emotion/core";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import CheckoutForm from "../../container/CheckoutForm/CheckoutForm";
import { Prompt } from "react-router-dom";
import { StripeKey } from "../../config";
import { routes } from "../../utility/constants/constants";

const LocationAndPaymentDetail = (props) => {
  console.log(props.user.cc_by_pass, "skdihfuisehfksjnsdufhkujdfh................------")
  const [isBlocking, setIsBlocking] = useState(true);
  const overrideSpinnerCSS = css`
    margin: 0 auto;
  `;
  // function usePrevious(value) {
  //     const ref = useRef();
  //     useEffect(() => {
  //         ref.current = value;
  //     });
  //     return ref.current;
  // }

  const [updateCard, setUpdateCard] = useState(true);
  // const [isLoading, setIsLoading] = useState(false);
  // const prevLoading = usePrevious(isLoading);
  // const bookingObject = useSelector(state => state.clientOrHeroReducer.updateBookingObject);
  // const prevBookingObject = usePrevious(bookingObject);

  // const didMountRef = useRef(false)
  // useEffect(() => {
  //     if (didMountRef.current) {

  //         if ((bookingObject !== prevBookingObject) && isLoading) {
  //             sweetSuccessAlert("Card Added", "Your Card is Succesfully added", "Okay");
  //             setIsLoading(false);
  //         }
  //     } else didMountRef.current = true
  // })
  // useEffect(() => {

  // })
  const setCardValue = (setFieldValue) => {
    setUpdateCard(true);
    setFieldValue("card", "");
  };
  // const phoneNumber = parsePhoneNumberFromString(props.bookingData && props.bookingData.phone ? props.bookingData.phone : props.user.phone);
  const phoneNumber = parsePhoneNumberFromString(props.user.phone);
  let formatNumber = "(###) ###-####";
  // if (phoneNumber && phoneNumber.country === 'US') {
  //     formatNumber = '(###) ###-####'
  // } else if (phoneNumber) {
  //     formatNumber = getFormatedNumber(phoneNumber && phoneNumber.formatNational());
  // }

  const SavedAddress = props.savedAddresses[props.savedAddresses.length - 1];

  const addAddressAndPaymentDetails = (values) => {
    setIsBlocking(false);
    props.addAddressAndPaymentDetails(values);
  };
  //
  let address = "";

  if (SavedAddress) {
    if (SavedAddress.street_address) {
      address = SavedAddress.street_address;
    } else {
      address = SavedAddress.formatted_address;
    }
  } else if (props.user.address) {
    address = props.user.address.street_address;
  } else if (props.bookingData && props.bookingData.address) {
    address = props.bookingData.address;
  }
  // SavedAddress ? SavedAddress.formatted_address : props.user.address ? props.user.address.formatted_address : props.bookingData && props.bookingData.address ? props.bookingData.address : ''
  const setInitialValues = {
    address: address,
    description:
      props.bookingData &&
        props.bookingData.address_attributes &&
        props.bookingData.address_attributes.description
        ? props.bookingData.address_attributes.description
        : "",
    // verify_code: props.bookingData && props.bookingData.verify_code ? props.bookingData.verify_code : '',
    point_of_contact:
      props.bookingData && props.bookingData.point_of_contact
        ? props.bookingData.point_of_contact
        : props.user.first_name + " " + props.user.last_name,
    phone: phoneNumber ? phoneNumber.nationalNumber : props.bookingData.phone,
    card:
      props.bookingData && props.bookingData.card ? props.bookingData.card : [],
  };

  const addedCard = async (e) => {
    if (e.error) {
      props.setState.setState({
        cardError: e.error.message,
      });
    } else {
      props.setState.setState({
        cardError: null,
      });
    }
  };


  return (
    <div className="home_hero">
      <div className="container">
        <div className="sub_head_tlt">
          <div className="mainTitle">
            <h2 className="ft_Weight_600 mb-0 text-uppercase">I NEED A HERO</h2>
          </div>
        </div>
      </div>
      {/* {(props.location.pathname !== routes.LOCATION_AND_PAYMENT_DETAIL && props.location.pathname !== routes.REVIEW_AND_CONFIRM && props.location.pathname !== routes.SELECT_ISSUES_AND_TIME) ? */}
      {!isSafari() && (
        <Prompt
          when={isBlocking}
          message={(location) => `Do you want to leave the booking page?`}
        />
      )}
      {/* : null} */}
      <div className="wrap-login100 wrapW500">
        <Formik
          enableReinitialize={true}
          initialValues={setInitialValues}
          validate={LocationAndPaymentDetailsValidation}
          onSubmit={addAddressAndPaymentDetails}
        >
          {(formikProps) => {
            const errors = formikProps.errors;
            const touched = formikProps.touched;
            // let cc_by_pass = false
            // if (props.user.cc_by_pass === "true") {
            //   cc_by_pass = true
            // }
            return (
              <Form className="login100-form" id="login_form">
                <article className="limiter_heading_wrp ml-auto mr-auto">
                  <h1 className="text-primary display4 ft_Weight_600">{props.user.cc_by_pass ? "Location Detail" : "Location & Payment Detail"}</h1>
                  {/* <h1 className="display4 ft_Weight_600 text-danger">
                    Location & Payment Detail
                  </h1> */}
                </article>
                <div className="inner_form">
                  {/* <h5>Location Information</h5> */}
                  <div className="fields">
                    <div className="form_group_modify">
                      <label for="conf_add" className="label_modify">
                        Please Confirm Address
                      </label>
                      <GooglePlacesAutoComplete
                        name="address"
                        errors={errors}
                        touched={touched}
                        value={formikProps.values.address}
                        onChange={formikProps.setFieldValue}
                        handleAddressSelect={props.handleAddressSelect}
                      />
                      {/* <span className="error_message">{errors.address && touched.address && errors.address}</span> */}
                      <ErrorMessage
                        name="address"
                        render={(msg) => (
                          <span className="error_message">{msg}</span>
                        )}
                      />
                    </div>
                    <div className="form_group_modify">
                      <Field
                        as="textarea"
                        name="description"
                        placeholder="Additional Location Details..."
                        className={
                          formikProps.errors.description
                            ? "form-control error_class"
                            : "form-control"
                        }
                        rows="3"
                      />

                      {/* <ErrorMessage name="description" render={msg => <span className="error_message">{msg}</span>} /> */}
                    </div>
                    <div className="form_group_modify">
                      <label for="point_cont" className="label_modify">
                        Contact Name
                      </label>
                      <Field
                        id="point_cont"
                        type="text"
                        className={
                          errors.point_of_contact && touched.point_of_contact
                            ? "input_modify input_modify_lg error_class"
                            : "input_modify input_modify_lg"
                        }
                        name="point_of_contact"
                        placeholder="Type here"
                      />
                      {/* <span className="error_message">{errors.point_of_contact && touched.point_of_contact && errors.point_of_contact}</span> */}
                      <ErrorMessage
                        name="point_of_contact"
                        render={(msg) => (
                          <span className="error_message">{msg}</span>
                        )}
                      />
                    </div>
                    <div className="form_group_modify">
                      <label for="cont_number" className="label_modify">
                        Contact Number
                      </label>
                      <PhoneNumberField
                        value={formikProps.values.phone}
                        formatNumber={formatNumber}
                        onChange={formikProps.setFieldValue}
                        className={
                          errors.phone && touched.phone
                            ? "input_modify input_modify_lg error_class"
                            : "input_modify input_modify_lg"
                        }
                        name="phone"
                        placeholder="Add a number"
                      />
                      {/* <span className="error_message">{errors.phone_number && touched.phone_number && errors.phone_number}</span> */}
                      <ErrorMessage
                        name="phone"
                        render={(msg) => (
                          <span className="error_message">{msg}</span>
                        )}
                      />
                      {/* <input id="cont_number" type="text" className="input_modify input_modify_lg" name="cont_number" placeholder="Add a number" /> */}
                    </div>
                  </div>
                  {/* </div> */}
                  {/* <div className="inner_form payment_info_inner"> */}
                    {props.user.cc_by_pass === true ? null : 
                      (
                        <div className="fields">
                      <span
                        style={{ color: "rgb(221, 39, 38)", fontSize: "13px" }}
                      >
                        {props.state.cardError}
                      </span>
                      <div
                        className="form_group_modify"
                        style={{ borderTop: "1px solid #d4d3d3" }}
                      >
                        <label for="conf_add" className="label_modify">Payment Information</label>
                        {updateCard && formikProps.values.card.length === 0 ? (
                          <div className="payment_card">
                            {/* <StripeProvider apiKey={StripeKey()}>
                                                        <Elements> */}
                            <div
                              className="checkout"
                              style={{
                                width: "100%",
                                paddingTop: "15px",
                                paddingBottom: "15px",
                              }}
                            >
                              <CardElement onChange={addedCard} />
                            </div>
                            {/* </Elements>
                                                    </StripeProvider> */}
                          </div>
                        ) : (
                          formikProps.values.card.map((card) => (
                            <div className="payment_detail_info">
                              <article className="left_side_payment">
                                <h5 className="h5_title">{`Card ending in XXXX XXXX XXXX ${card.last4}`}</h5>
                              </article>
                              <div className="card_body">
                                <p className="card_title_info">
                                  Expries {card.exp_month}/{card.exp_year}
                                </p>
                                <button
                                  type="button"
                                  className="a_tag_to_button card_info_anchor"
                                  onClick={() =>
                                    setCardValue(formikProps.setFieldValue)
                                  }
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                      )
                    }
                    
                  
                  

                </div>

                <div className="form-group px_25 btn_block_inner">
                  {props.state.isLoading ? (
                    <RingLoader
                      css={overrideSpinnerCSS}
                      sizeUnit={"px"}
                      size={30}
                      color={"#241e1e"}
                      loading={props.state.isLoading}
                    />
                  ) : (
                    <button
                      type="submit"
                      disabled={props.state.cardError ? true : false}
                      className={
                        props.state.cardError
                          ? "btn-block theme_btn_lg theme_btn"
                          : "theme_primary btn-block theme_btn_lg theme_btn"
                      }
                    >
                      {" "}
                      NEXT{" "}
                    </button>
                  )}
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default LocationAndPaymentDetail;
