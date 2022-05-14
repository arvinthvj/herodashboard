import React from 'react'
import { Formik, Form, Field } from 'formik'
import { errorStyle, routes, themeBlackColor } from '../../../utility/constants/constants'
import { validate_otp_code, validate_mobile_number, validate_custom_phone_number_field } from '../../../utility/validator/FormValidation/FormValidation';
import RingLoader from 'react-spinners/RingLoader';
import { css } from "@emotion/core";
import Oux from '../../../hoc/Oux/Oux';
import ReactPhoneNumberInput from '../../UI/ReactPhoneNumberInput/ReactPhoneNumberInput';
import storage from '../../../utility/storage';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const otpVerificationForm = props => {

    const overrideSpinnerCSS = css`
        margin: 0 auto;
    `;

    const userDetails = props.history.location.state && props.history.location.state.userDetails ? props.history.location.state.userDetails : null

    let parsedPhoneNumber = parsePhoneNumberFromString(userDetails ? userDetails.phone : props.phone)

    function formatPhoneNumber() {
        var match = parsedPhoneNumber ? parsedPhoneNumber.nationalNumber.match(/^(\d{3})(\d{3})(\d{4})$/) : null
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        }
        else {
            props.onClickReEditPhoneNumber(true)
            return null
        }
    }

    let formattedphoneNumber = formatPhoneNumber()

    return (
        <div className="home_hero">
            <div className="wrap-login100">
                <Formik
                    enableReinitialize={true}
                    initialValues={props.isReEditPhoneNumber ? { phone: '' } : { verify_otp_code: '' }}
                    onSubmit={(values, { setFieldTouched, setFieldError }) => {
                        if (props.isReEditPhoneNumber) {
                            // props.editProfile(props.user.id, { user: { phone: values.phone } })
                            if (!values) {
                                setFieldError('phone', 'This is field is required')
                            }
                            else {
                                values = {
                                    ...values,
                                    phone: "+" + values.phone,
                                }
                                props.sendOTP({ ...values })
                            }
                        }
                        else if (values.verify_otp_code === '12345') {
                            if (process.env.REACT_APP_ENV === 'staging') {
                                if (props.history.location.state && props.history.location.state.userDetails) {
                                    storage.set('isPhoneVerified', true)
                                    props.editProfile(props.user.id, { user: { ...props.history.location.state.userDetails } })
                                    props.history.push(routes.ROOT)
                                }
                                else {
                                    storage.set('isPhoneVerified', true)
                                    props.history.push(routes.ROOT)
                                }
                            }
                            else if (process.env.REACT_APP_ENV === 'development') {
                                if (props.history.location.state && props.history.location.state.userDetails) {
                                    storage.set('isPhoneVerified', true)
                                    props.editProfile(props.user.id, { user: { ...props.history.location.state.userDetails, isUserEditingProfile: undefined } })
                                    if (props.history.location.state.userDetails.isUserEditingProfile) {
                                        props.history.push(routes.EDIT_PROFILE)
                                    }
                                    else {
                                        props.history.push(routes.ROOT)
                                    }
                                }
                                else {
                                    storage.set('isPhoneVerified', true)
                                    if (props.history.location.state && props.history.location.state.userDetails && props.history.location.state.userDetails.isUserEditingProfile) {
                                        props.history.push(routes.EDIT_PROFILE)
                                    }
                                    else {
                                        props.history.push(routes.ROOT)
                                    }
                                }
                            }
                        }
                        else {
                            props.submitOTP({ code: values.verify_otp_code, phone: userDetails ? userDetails.phone : props.phone });
                        }
                        console.log(values, 'Values')
                    }}>
                    {(formik_props) => {
                        const errors = formik_props.errors
                        const touched = formik_props.touched
                        console.log(errors)
                        return (
                            <Form className="login100-form" id="login_form">
                                <article className="limiter_heading_wrp ml-auto mr-auto">
                                    {props.isReEditPhoneNumber ? <h1 className="display4 ft_Weight_600">Enter Your Mobile Number</h1> : <h1 className="display4 ft_Weight_600">Enter Your 5-Digit Code</h1>}
                                </article>
                                <div className="inner_form">
                                    <div className="fields">
                                        <div className="form_group_modify">
                                            {props.isReEditPhoneNumber ? null : <p>We have sent a verification code to {formattedphoneNumber}</p>}
                                        </div>
                                        {
                                            props.isReEditPhoneNumber
                                                ? <div className="form_group_modify">
                                                    <label htmlFor="phone" className="label_modify">Enter Your Phone Number</label>
                                                    <Field
                                                        id="phone"
                                                        name="phone"
                                                        validate={validate_custom_phone_number_field}
                                                        render={() => <ReactPhoneNumberInput
                                                            className="form-control input_modify input_modify_lg custom_phone_input"
                                                            touched={formik_props.touched.phone}
                                                            dropDownClassName="otp-flag-dropdown"
                                                            setFieldTouched={formik_props.setFieldTouched}
                                                            errors={formik_props.errors}
                                                            blurHandler={formik_props.handleBlur}
                                                            setFieldValue={formik_props.setFieldValue}
                                                            phoneValue={formik_props.values.phone} />
                                                        } />
                                                    <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>{errors.phone && touched.phone && errors.phone}</span>
                                                </div>
                                                : <div className="form_group_modify">
                                                    <label htmlFor="verfy_otp_code" className="label_modify">Enter Your Verification Code</label>
                                                    <Field style={errors.verify_otp_code && touched.verify_otp_code ? errorStyle : null} id="verify_otp_code" validate={validate_otp_code} type="text" className="input_modify input_modify_lg" name="verify_otp_code" placeholder="Enter Code" />
                                                    <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>{errors.verify_otp_code && touched.verify_otp_code && errors.verify_otp_code}</span>
                                                </div>
                                        }
                                    </div>
                                    <div className="form-group">
                                        {
                                            props.isLoading
                                                ? <RingLoader
                                                    css={overrideSpinnerCSS}
                                                    sizeUnit={"px"}
                                                    size={30}
                                                    color={themeBlackColor}
                                                    loading={props.isLoading} />
                                                : <button className="theme_primary btn-block theme_btn_lg theme_btn" type="submit"> SUBMIT </button>
                                        }
                                    </div>
                                    <div className="form-group mb-0">
                                        {props.isReEditPhoneNumber ? null : <button type="button" onClick={() => props.sendOTP({ phone: userDetails ? userDetails.phone : props.phone, country_code: userDetails ? userDetails.country_code : props.countryShortCode })} className="form_link link_danger font-semi-bold link_underline a_tag_to_button">Re-send code</button>}
                                        {props.isReEditPhoneNumber ? null : <a className="form_link link_primary font-semi-bold pull-right" href="javascript:void(0)" onClick={() => props.onClickReEditPhoneNumber(true)}>Edit Phone Number</a>}
                                    </div>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )
}

export default otpVerificationForm