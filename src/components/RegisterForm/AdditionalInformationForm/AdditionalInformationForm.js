import React from 'react'
import GooglePlacesAutoComplete from '../../UI/StarRating/GooglePlacesAutoComplete';
import ReactPhoneNumberInput from '../../UI/ReactPhoneNumberInput/ReactPhoneNumberInput';
import RingLoader from 'react-spinners/RingLoader';
import { errorStyle, roles, themeBlackColor } from '../../../utility/constants/constants'
import { css } from "@emotion/core";
import { Formik, Form, Field } from 'formik'
import { validateAdditionalInformationForm } from '../../../utility/validator/FormValidation/FormValidation';
import './AdditionalInformation.css'

const additionalInformationForm = props => {

    const overrideSpinnerCSS = css`
        margin: 0 auto;
    `;

    let initialFormValues = {
        address_attributes: {
            street_address: '',
            city: '',
            state: '',
            zip: '',
        }
    }

    return (
        <div className="home_hero">
            <div className="wrap-login100">
                {props.isLoading
                    ? <RingLoader
                        css={overrideSpinnerCSS}
                        sizeUnit={"px"}
                        size={50}
                        color={themeBlackColor}
                        loading={props.isLoading} />
                    : <Formik
                        initialValues={initialFormValues}
                        onSubmit={(values) => {
                            props.editProfile(props.user.id, { user: { ...values } });
                        }}
                        validationSchema={validateAdditionalInformationForm}>
                        {(formik_props) => {
                            const errors = formik_props.errors
                            const touched = formik_props.touched
                            console.log(errors, 'errors')
                            console.log(touched, 'touched')

                            return (
                                <Form className="login100-form" id="login_form">
                                    <article className="limiter_heading_wrp ml-auto mr-auto">
                                        <h1 className="display4 ft_Weight_600">Location Information</h1>
                                    </article>
                                    <div className="inner_form add_info_form">
                                        <div className="fields">
                                            <div className="form_group_modify">
                                                <p>Please Enter Your Location Information</p>
                                            </div>
                                            <div className="form_group_modify" >
                                                <label htmlFor="address_attributes[street_address]">Address</label>
                                                <GooglePlacesAutoComplete
                                                    name="address_attributes[street_address]"
                                                    errors={errors}
                                                    touched={touched}
                                                    setFieldTouched={formik_props.setFieldTouched}
                                                    address_attributes={props.address_attributes}
                                                    value={formik_props.values.address_attributes['street_address']}
                                                    onChange={formik_props.setFieldValue}
                                                    handleAddressSelect={props.handleAddressSelect}
                                                />
                                                <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>
                                                    {(errors.address_attributes && errors.address_attributes['street_address']) && (touched.address_attributes && touched.address_attributes['street_address']) && errors.address_attributes['street_address']}
                                                </span>
                                            </div>
                                            {/* <div className="form_group_modify" >
                                                <label htmlFor="address_attributes[city]">City</label>
                                                <Field
                                                    style={(errors.address_attributes && errors.address_attributes['city']) && (touched.address_attributes && touched.address_attributes['city']) ? errorStyle : null}
                                                    className="form-control top-input"
                                                    placeholder="City"
                                                    type="text"
                                                    readOnly={true}
                                                    // value={props.address_attributes ? props.address_attributes.city : props.user && props.user.address ? props.user.address.city : null}
                                                    value={formik_props.values.address_attributes.city}
                                                    name="address_attributes[city]"
                                                    id="address_attributes[city]" />
                                                <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>
                                                    {(errors.address_attributes && errors.address_attributes['city']) && (touched.address_attributes && touched.address_attributes['city']) && errors.address_attributes['city']}
                                                </span>
                                            </div>
                                            <div className="form_group_modify" >
                                                <label htmlFor="address_attributes[state]">State</label>
                                                <Field
                                                    style={(errors.address_attributes && errors.address_attributes['state']) && (touched.address_attributes && touched.address_attributes['state']) ? errorStyle : null}
                                                    className="form-control top-input"
                                                    placeholder="State"
                                                    readOnly={true}
                                                    type="text"
                                                    // value={props.address_attributes ? props.address_attributes.state : props.user && props.user.address ? props.user.address.state : null}
                                                    value={formik_props.values.address_attributes.state}
                                                    name="address_attributes[state]"
                                                    id="address_attributes[state]" />
                                                <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>
                                                    {(errors.address_attributes && errors.address_attributes['state']) && (touched.address_attributes && touched.address_attributes['state']) && errors.address_attributes['state']}
                                                </span>
                                            </div> */}
                                            <div className="form_group_modify" >
                                                <label htmlFor="address_attributes[zip]">Zip Code</label>
                                                <Field
                                                    style={(errors.address_attributes && errors.address_attributes['zip']) && (touched.address_attributes && touched.address_attributes['zip']) ? errorStyle : null}
                                                    className={(errors.address_attributes && errors.address_attributes['zip']) && (touched.address_attributes && touched.address_attributes['zip']) ? "form-control number_font top-input top-input-error add_info_zip" : "form-control number_font top-input add_info_zip"}
                                                    placeholder="Zip Code"
                                                    type="text"
                                                    name="address_attributes[zip]"
                                                    id="address_attributes[zip]" />
                                                <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>
                                                    {(errors.address_attributes
                                                         && errors.address_attributes['zip']) && (touched.address_attributes && touched.address_attributes['zip']) && errors.address_attributes['zip']}
                                                </span>
                                            </div>
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
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                }
            </div>
        </div>
    )
}

export default additionalInformationForm