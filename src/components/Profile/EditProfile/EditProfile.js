import React from 'react'
import { Formik, Form, Field } from 'formik'
import { validateClientProfileForm, validateHeroProfileForm, validate_custom_phone_number_field } from '../../../utility/validator/FormValidation/FormValidation'
import { errorStyle, roles, address_attributes, assessment_status, themeBlackColor, HeroProfilePicPath, ClientProfilePicPath, background_check } from '../../../utility/constants/constants'
import './EditProfile.css'
import ReactPhoneNumberInput from '../../UI/ReactPhoneNumberInput/ReactPhoneNumberInput'
import RingLoader from 'react-spinners/RingLoader';
import { css } from "@emotion/core";
import GooglePlacesAutoComplete from '../../UI/StarRating/GooglePlacesAutoComplete'
import DragAndDropImageUpload from '../../UI/DragAndDropImageUpload/DragAndDropImageUpload'
import Avatar from 'react-avatar';
import storage from '../../../utility/storage'

const editProfile = props => {

    const overrideSpinnerCSS = css`
        margin: 0 auto;
    `;

    let initialHeroFormValues = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address_attributes: {
            street_address: '',
            city: '',
            state: '',
            zip: '',
        }
    }

    let initialClientFormValues = {
        first_name: '',
        last_name: '',
        email: '',
        company_name: '',
        phone: '',
        address_attributes: {
            street_address: '',
            city: '',
            state: '',
            zip: '',
        }
    }

    let imgSrc = null
    let profilePicName = null
    let profilePicBgColor = storage.get('profilePicBgColor', null)
    if (props.user) {
        profilePicName = props.user.first_name.charAt(0).toUpperCase() + " " + props.user.last_name.charAt(0).toUpperCase()
    }

    if (props.profileImage) {
        imgSrc = props.profileImage;
    }

    console.log(props.profileImage, "propsimage")

    console.log(props.address_attributes, "add state")
    if (props.user && props.user.role === roles.client) {
        initialClientFormValues = {
            first_name: props.user.first_name,
            last_name: props.user.last_name,
            email: props.user.email,
            company_name: props.user.company_name,
            phone: props.user.phone ? props.user.phone : '',
            address_attributes: {
                street_address: props.user.address && props.user.address.street_address ? props.user.address.street_address : props.user.address && props.user.address.formatted_address ? props.user.address.formatted_address : null,
                city: props.user.address ? props.user.address.city : null,
                state: props.user.address ? props.user.address.state : null,
                zip: props.user.address ? props.user.address.zip : null,
                id: props.user.address ? props.user.address.id : null
            }
        }
    }
    else {
        initialHeroFormValues = {
            first_name: props.user.first_name,
            last_name: props.user.last_name,
            email: props.user.email,
            phone: props.user.phone ? props.user.phone : '',
            address_attributes: {
                street_address: props.user.address && props.user.address.street_address ? props.user.address.street_address : props.user.address && props.user.address.formatted_address ? props.user.address.formatted_address : null,
                city: props.user.address ? props.user.address.city : null,
                state: props.user.address ? props.user.address.state : null,
                zip: props.user.address ? props.user.address.zip : null,
                id: props.user.address ? props.user.address.id : null
            }
        }
    }

    return (
        <div className="tab-pane fade show active all_tab " id="edit_profile" role="tabpanel" aria-labelledby="edit_profile-tab">
            <div className="input_pro_edit">
                <Formik
                    enableReinitialize={true}
                    initialValues={props.role === roles.client ? initialClientFormValues : initialHeroFormValues}
                    onSubmit={(values) => {

                        if (!values.address_attributes.street_address) {
                            values = {
                                ...values,
                                address_attributes: undefined,
                            }
                        }
                        else {

                            if (props.user && props.user.address) {
                                if (!values["address_attributes"]["latitude"] || !values["address_attributes"]["longitude"]) {
                                    values = {
                                        ...values,
                                        address_attributes: {
                                            ...values.address_attributes,
                                            latitude: props.user.address.latitude,
                                            longitude: props.user.address.longitude
                                        }
                                    }
                                }
                            }
                        }
                        if (props.profilePhotoPath) {
                            values = {
                                ...values,
                                photo_path: props.profilePhotoPath
                            }
                            props.setProfileImageStateNull()
                        }

                        if (props.user.address && props.user.address.id) {
                            values["address_attributes"]["id"] = props.user.address.id;
                        }
                        if (values.phone) {
                            if (!values.phone.includes('+')) {
                                values = {
                                    ...values,
                                    phone: "+" + values.phone,
                                }
                            }
                        }
                        if (props.user.phone !== values.phone) {
                            props.sendOTP({ ...values, isUserEditingProfile: true })
                        }
                        else {
                            values = {
                                ...values,
                                first_name: values.first_name.charAt(0).toUpperCase() + values.first_name.slice(1),
                                last_name: values.last_name.charAt(0).toUpperCase() + values.last_name.slice(1),
                            }
                            props.editProfile(props.id, { user: { ...values } })
                        }
                        console.log(values)
                    }}
                    validationSchema={props.role === roles.client ? validateClientProfileForm : validateHeroProfileForm}>
                    {(formik_props) => {
                        const errors = formik_props.errors
                        const touched = formik_props.touched
                        let isDisabled = (props.user.role === roles.service_provider && props.isPhoneVerified) && ((props.user.assessment_status.toLowerCase() === assessment_status.SUBMITTED.toLowerCase() || props.user.assessment_status.toLowerCase() === assessment_status.FAILED.toLowerCase())
                            || (props.user.background_check.toLowerCase() === background_check.FAILED.toLowerCase() || props.user.background_check.toLowerCase() === background_check.PENDING.toLowerCase()))
                        console.log(isDisabled, "isDisabled")
                        console.log(errors, 'errors')
                        console.log(touched, 'touched')
                        let imageProfile = null
                        if (imgSrc) {
                            imageProfile = imgSrc
                        }
                        else if (props.user) {
                            if (Object.keys(props.user.photo_urls).length > 0) {
                                imageProfile = props.user.photo_urls.medium
                            }
                            else if (props.user.social_photo_url) {
                                imageProfile = props.user.social_photo_url
                            }
                        }
                        console.log(imageProfile, "imageProfile")
                        console.log(formik_props.values, "formikProps")
                        return (
                            <Form>
                                <div className="personal_info_block">
                                    <h4 className="ml-4 mb-4 ft_Weight_600 text-uppercase wow fadeInDown">Account Information</h4>
                                    <div className="labelled-input">
                                        <div className="profile_picture form-control auto-height top-input">
                                            <div className="row">
                                                <div className="col-lg-3">
                                                    <h2 className="theme_sm_title">Profile Picture</h2>
                                                </div>
                                                <div className="col-lg-8">
                                                    <div className="media align-items-center">
                                                        <div className="circle_img user-pic mr-3">
                                                            {
                                                                isDisabled
                                                                    ? imageProfile ? <img style={{ cursor: 'pointer' }} src={imageProfile} alt="..." /> : <img className="client_profile_pic_bgcolor" style={{ cursor: 'pointer' }} src={props.user.role === roles.service_provider ? HeroProfilePicPath.FLYING : ClientProfilePicPath.FLYING} alt="User" />
                                                                    : <DragAndDropImageUpload files={props.file} uploadFile={props.onImageUpload}>
                                                                        {
                                                                            imageProfile ? <img style={{ cursor: 'pointer' }} src={imageProfile} alt="..." /> : <img className="client_profile_pic_bgcolor" style={{ cursor: 'pointer' }} src={props.user.role === roles.service_provider ? HeroProfilePicPath.FLYING : ClientProfilePicPath.FLYING} alt="User" />
                                                                        }
                                                                    </DragAndDropImageUpload>
                                                            }
                                                        </div>
                                                        <div className="media-body">
                                                            <div style={{ width: 'fit-content' }}>
                                                                {
                                                                    isDisabled
                                                                        ? <a href="javascript:void(0)" style={{ opacity: '0.6', cursor: 'default' }} className="theme_btn theme_primary text_inherie">
                                                                            Upload photo
                                                                        </a>
                                                                        : <DragAndDropImageUpload files={props.file} uploadFile={props.onImageUpload}>
                                                                            <a href="javascript:void(0)" className="theme_btn theme_primary text_inherie">
                                                                                Upload photo
                                                                            </a>
                                                                        </DragAndDropImageUpload>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="info_txt">
                                                        <p> Please provide a company logo or profile picture where your face is clearly visible.  Max size: 10Mb
                                                                </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="labelled-input">
                                        <label htmlFor="first_name">First name</label>
                                        <Field
                                            style={errors.first_name && touched.first_name ? errorStyle : null}
                                            className={errors.first_name && touched.first_name ? "form-control top-input top-input-error" : "form-control top-input"}
                                            placeholder="First Name"
                                            type="text"
                                            name="first_name"
                                            disabled={isDisabled}
                                            id="first_name" />
                                        <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>
                                            {errors.first_name && touched.first_name && errors.first_name}
                                        </span>
                                    </div>
                                    <div className="labelled-input">
                                        <label htmlFor="last_name">Last name</label>
                                        <Field
                                            style={errors.last_name && touched.last_name ? errorStyle : null}
                                            className={errors.last_name && touched.last_name ? "form-control top-input top-input-error" : "form-control top-input"}
                                            placeholder="Last Name"
                                            type="text"
                                            disabled={isDisabled}
                                            name="last_name"
                                            id="last_name" />
                                        <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>
                                            {errors.last_name && touched.last_name && errors.last_name}
                                        </span>
                                    </div>
                                    <div className="labelled-input">
                                        <label htmlFor="email">Email</label>
                                        <Field
                                            style={errors.email && touched.email ? errorStyle : null}
                                            className={errors.email && touched.email ? "form-control top-input top-input-error" : "form-control top-input"}
                                            placeholder="example@abc.com"
                                            type="email"
                                            name="email"
                                            disabled={true}
                                            id="email" />
                                        <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>
                                            {errors.email && touched.email && errors.email}
                                        </span>
                                    </div>
                                </div>
                                <div className="personal_info_block">
                                    <h4 className="ml-4 mb_45 ft_Weight_600 text-uppercase mt_80 wow fadeInDown">Contact Information</h4>
                                    <div className="labelled-input edit-profile-phone-container">
                                        <label htmlFor="phone" style={{ zIndex: 1, marginLeft: '30px' }} className="phone_numb">Phone number</label>
                                        {/* <Field
                                            style={errors.phone && touched.phone ? errorStyle : null}
                                            className={errors.phone && touched.phone ? "form-control number_font top-input top-input-error" : "form-control number_font top-input"}
                                            placeholder="(123) 456-7890"
                                            type="text"
                                            name="phone"
                                            id="phone" /> */}
                                        <Field
                                            id="phone"
                                            name="phone"
                                            validate={(value) => validate_custom_phone_number_field(value)}
                                            render={() => <ReactPhoneNumberInput
                                                className={errors.phone && touched.phone ? "form-control number_font edit-profile-phone-input top-input top-input-error" : "form-control number_font edit-profile-phone-input top-input"}
                                                touched={formik_props.touched.phone}
                                                setFieldTouched={formik_props.setFieldTouched}
                                                errors={formik_props.errors}
                                                disabled={isDisabled}
                                                blurHandler={formik_props.handleBlur}
                                                dropDownClassName="profile-flag-dropdown"
                                                dropdownClass="edit-profile-phone-container"
                                                setFieldValue={formik_props.setFieldValue}
                                                phoneValue={formik_props.values.phone} />
                                            } />
                                        <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>
                                            {errors.phone && touched.phone && errors.phone}
                                        </span>
                                    </div>
                                    {
                                        props.role === roles.client
                                            ? <div className="labelled-input">
                                                <label htmlFor="company_name" className="phone_numb">Company name</label>
                                                <Field
                                                    style={errors.company_name && touched.company_name ? errorStyle : null}
                                                    className={errors.company_name && touched.company_name ? "form-control top-input top-input-error" : "form-control top-input"}
                                                    placeholder="Company name"
                                                    type="text"
                                                    disabled={isDisabled}
                                                    name="company_name"
                                                    id="company_name" />
                                                <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>
                                                    {errors.company_name && touched.company_name && errors.company_name}
                                                </span>
                                            </div>
                                            : null
                                    }
                                    <div className="labelled-input">
                                        <label htmlFor="address_attributes[street_address]">Address</label>
                                        {/* <Field
                                            style={errors.address_attributes && errors.address_attributes['street_address'] && touched.address_attributes['street_address'] ? errorStyle : null}
                                            className="form-control top-input"
                                            placeholder="Address"
                                            type="text"
                                            name="address_attributes[street_address]"
                                            id="address_attributes[street_address]" /> */}
                                        <GooglePlacesAutoComplete
                                            name="address_attributes[street_address]"
                                            errors={errors}
                                            touched={touched}
                                            disabled={isDisabled}
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
                                    {/* <div className="labelled-input">
                                        <label htmlFor="address_attributes[city]">City</label>
                                        <Field
                                            style={(errors.address_attributes && errors.address_attributes['city']) && (touched.address_attributes && touched.address_attributes['city']) ? errorStyle : null}
                                            className="form-control top-input"
                                            placeholder="City"
                                            type="text"
                                            disabled={true}
                                            value={props.address_attributes ? props.address_attributes.city : props.user && props.user.address ? props.user.address.city : null}
                                            name="address_attributes[city]"
                                            id="address_attributes[city]" />
                                        <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>
                                            {(errors.address_attributes && errors.address_attributes['city']) && (touched.address_attributes && touched.address_attributes['city']) && errors.address_attributes['city']}
                                        </span>
                                    </div>
                                    <div className="labelled-input">
                                        <label htmlFor="address_attributes[state]">State</label>
                                        <Field
                                            style={(errors.address_attributes && errors.address_attributes['state']) && (touched.address_attributes && touched.address_attributes['state']) ? errorStyle : null}
                                            className="form-control top-input"
                                            placeholder="State"
                                            disabled={true}
                                            type="text"
                                            value={props.address_attributes ? props.address_attributes.state : props.user && props.user.address ? props.user.address.state : null}
                                            name="address_attributes[state]"
                                            id="address_attributes[state]" />
                                        <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>
                                            {(errors.address_attributes && errors.address_attributes['state']) && (touched.address_attributes && touched.address_attributes['state']) && errors.address_attributes['state']}
                                        </span>
                                    </div> */}
                                    <div className="labelled-input">
                                        <label htmlFor="address_attributes[zip]">Zip Code</label>
                                        <Field
                                            style={(errors.address_attributes && errors.address_attributes['zip']) && (touched.address_attributes && touched.address_attributes['zip']) ? errorStyle : null}
                                            className={(errors.address_attributes && errors.address_attributes['zip']) && (touched.address_attributes && touched.address_attributes['zip']) ? "form-control number_font top-input top-input-error" : "form-control number_font top-input"}
                                            placeholder="Zip Code"
                                            type="text"
                                            disabled={isDisabled}
                                            name="address_attributes[zip]"
                                            id="address_attributes[zip]" />
                                        <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>
                                            {(errors.address_attributes && errors.address_attributes['zip']) && (touched.address_attributes && touched.address_attributes['zip']) && errors.address_attributes['zip']}
                                        </span>
                                    </div>
                                </div>
                                <div className="personal_info_block">
                                    <div className="actions_btns mt-5 text-center">
                                        {
                                            props.isLoading
                                                ? <RingLoader
                                                    css={overrideSpinnerCSS}
                                                    sizeUnit={"px"}
                                                    size={30}
                                                    color={themeBlackColor}
                                                    loading={props.isLoading} />
                                                : <button disabled={isDisabled || (!imgSrc && !formik_props.dirty)} style={(isDisabled || (!imgSrc && !formik_props.dirty)) ? { opacity: '0.6', cursor: 'default' } : null} className="theme_btn theme_primary w-420" type="submit">Save Changes</button>
                                        }
                                    </div>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div >
    )
}

export default editProfile