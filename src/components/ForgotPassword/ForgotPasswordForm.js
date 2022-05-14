import React from 'react'
import { Formik, Form, Field } from 'formik'
import { errorStyle, routes } from '../../utility/constants/constants'
import { validate_email_field } from '../../utility/validator/FormValidation/FormValidation';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/index'
import RingLoader from 'react-spinners/RingLoader';
import { css } from "@emotion/core";
import Oux from '../../hoc/Oux/Oux';
import { themeBlackColor } from '../../utility/constants/constants';

const ForgotPassword = props => {

    const overrideSpinnerCSS = css`
        margin: 0 auto;
    `;

    const goBack = () => {
        props.history.goBack()
    }


    if (!props.history.location.state || !props.history.location.state.isResetPasswordClicked) {
        if (!props.history.location.search) {
            props.history.push(routes.LOGIN)
        }
    }

    const initialFormValues = {
        password: '',
        password_confirmation: ''
    }

    let step = (
        <Formik
            initialValues={{ email: '' }}
            onSubmit={(values) => props.forgotPassword({ user: { ...values } })}>
            {(formik_props) => {
                const errors = formik_props.errors
                const touched = formik_props.touched
                console.log(errors)
                return (
                    <Form className="login100-form" id="login_form">
                        <article className="limiter_heading_wrp ml-auto mr-auto">
                            <h1 className="display4 ft_Weight_600">Reset Password</h1>
                        </article>
                        <div className="inner_form">
                            <div className="fields">
                                <div className="form_group_modify">
                                    <label htmlFor="email" className="label_modify">Account Email Address</label>
                                    <Field id="email" type="email" validate={validate_email_field} style={errors.email && touched.email ? errorStyle : null} className="input_modify input_modify_lg" name="email" placeholder="Email Address" />
                                    <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>{errors.email && touched.email && errors.email}</span>
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
                                        : <button className="theme_primary btn-block theme_btn_lg theme_btn" type="submit"> Send Reset Email </button>
                                }
                            </div>
                            <div className="form-group mb-0">
                                <a className="form_link font-semi-bold">Go back to <a className="form_link font-semi-bold" onClick={goBack}><span style={{ color: '#DB3732', cursor: 'pointer' }}>Sign In</span></a></a>
                            </div>
                        </div>
                    </Form>
                )
            }}
        </Formik>
    )

    if (props.history.location.search) {
        step = (
            <Oux>
                <Formik
                    enableReinitialize={true}
                    initialValues={initialFormValues}
                    onSubmit={(values, { setFieldError, resetForm, setValues }) => {
                        let reset_password_token = props.history.location.search.split('=')[1]
                        values = {
                            ...values,
                            reset_password_token: reset_password_token
                        }
                        props.resetPassword({ user: { ...values } })
                        resetForm({ ...initialFormValues })
                    }}
                // validationSchema={validateChangePassword}
                >
                    {(formik_props) => {

                        const errors = formik_props.errors
                        const touched = formik_props.touched
                        // console.log(errors, 'errors', touched, 'touched')
                        console.log(formik_props.values, "Form Values")
                        return (
                            <Form className="reset_password_form_container">
                                <h4 className="theme_sm_title">Reset Password</h4>
                                <div className="input_pro_edit input_proPass_edit">
                                    <div className="personal_info_block info_pass">
                                        <div className="labelled-input">
                                            <label htmlFor="password" className="mobile_top label_more">New Password</label>
                                            <Field
                                                style={errors.password && touched.password ? errorStyle : null}
                                                className={errors.password && touched.password ? "form-control top-input top-input-error" : "form-control top-input"}
                                                placeholder="********"
                                                type="password"
                                                value={formik_props.values.password}
                                                name="password"
                                                id="password" />
                                            <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>
                                                {errors.password && touched.password && errors.password}
                                            </span>
                                        </div>
                                        <div className="labelled-input">
                                            <label htmlFor="password_confirmation" className="mobile_top label_more label_more_conf">Confirm New Password</label>
                                            <Field
                                                style={errors.password_confirmation && touched.password_confirmation ? errorStyle : null}
                                                className={errors.password_confirmation && touched.password_confirmation ? "form-control top-input top-input-error" : "form-control top-input"}
                                                placeholder="********"
                                                type="password"
                                                value={formik_props.values.password_confirmation}
                                                name="password_confirmation"
                                                id="password_confirmation" />
                                            <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>
                                                {errors.password_confirmation && touched.password_confirmation && errors.password_confirmation}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="actions_btns mt-5 text-center">
                                    {
                                        props.isLoading
                                            ? <RingLoader
                                                css={overrideSpinnerCSS}
                                                sizeUnit={"px"}
                                                size={30}
                                                color={themeBlackColor}
                                                loading={props.isLoading} />
                                            : <button className="theme_btn theme_primary w-420" type="submit">Reset password</button>
                                    }
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </Oux>
        )
    }
    return (
        <div className="home_hero">
            <div className="wrap-login100">
                {step}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    isSigningupForBooking: state.authReducer.isSigningupForBooking,
    isLoading: state.authReducer.isloading
});

const mapStateToDispatch = (dispatch) => ({
    forgotPassword: (credentials) => dispatch(actions.forgotPassword(credentials))
});

export default connect(mapStateToProps, mapStateToDispatch)(ForgotPassword)