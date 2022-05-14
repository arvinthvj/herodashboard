import React from 'react'
import { Field, Formik, Form } from 'formik'
import { validateChangePassword } from '../../../utility/validator/FormValidation/FormValidation'
import { errorStyle, routes, roles, assessment_status } from '../../../utility/constants/constants'
import RingLoader from 'react-spinners/RingLoader';
import { css } from "@emotion/core";

const changePassword = props => {

    const overrideSpinnerCSS = css`
        margin: 0 auto;
    `;

    let initialFormValues = {
        current_password: '',
        password: '',
        password_confirmation: ''
    }

    return (
        <div style={{ display: 'block' }} className="tab-pane active show fade" id="Change_Password" role="tabpanel" aria-labelledby="Change_Password_tab">
            <h4 className="ml-4 mb-4 ft_Weight_600 text-uppercase  wow fadeInDown">Change Password</h4>
            <Formik
                enableReinitialize={true}
                initialValues={initialFormValues}
                onSubmit={(values, { setFieldError, resetForm, setValues }) => {
                    if (values.current_password === values.password) {
                        setFieldError('password', 'New Password Cannot Be Same As Old Password')
                    }
                    else {
                        props.changePassword({ user: { ...values } })
                        resetForm({ ...initialFormValues })
                    }
                }}
                validationSchema={validateChangePassword}>
                {(formik_props) => {

                    const errors = formik_props.errors
                    const touched = formik_props.touched
                    let isDisabled = props.user.role === roles.service_provider && (props.user.assessment_status.toLowerCase() === assessment_status.SUBMITTED.toLowerCase() || props.user.assessment_status.toLowerCase() === assessment_status.FAILED.toLowerCase())
                    // console.log(errors, 'errors', touched, 'touched')
                    console.log(formik_props.values, "Form Values")
                    return (
                        <Form>
                            <div className="input_pro_edit input_proPass_edit">
                                <div className="personal_info_block info_pass">
                                    <div className="labelled-input">
                                        <label htmlFor="current_password" className="xssMobile_top">Enter Old Password</label>
                                        <Field
                                            style={errors.current_password && touched.current_password ? { ...errorStyle, filter: 'unset' } : { filter: 'unset' }}
                                            className={errors.current_password && touched.current_password ? "form-control top-input top-input-error" : "form-control top-input"}
                                            placeholder="********"
                                            type="password"
                                            value={formik_props.values.current_password}
                                            name="current_password"
                                            disabled={isDisabled}
                                            id="current_password" />
                                        <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>
                                            {errors.current_password && touched.current_password && errors.current_password}
                                        </span>
                                    </div>
                                    <div className="labelled-input">
                                        <label htmlFor="password" className="mobile_top label_more">Type Your New Password</label>
                                        <Field
                                            style={errors.password && touched.password ? { ...errorStyle, filter: 'unset' } : { filter: 'unset' }}
                                            className={errors.password && touched.password ? "form-control top-input top-input-error" : "form-control top-input"}
                                            placeholder="********"
                                            type="password"
                                            value={formik_props.values.password}
                                            name="password"
                                            disabled={isDisabled}
                                            id="password" />
                                        <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>
                                            {errors.password && touched.password && errors.password}
                                        </span>
                                    </div>
                                    <div className="labelled-input">
                                        <label htmlFor="password_confirmation" className="mobile_top label_more label_more_conf">Confirm Your New Password</label>
                                        <Field
                                            style={errors.password_confirmation && touched.password_confirmation ? { ...errorStyle, filter: 'unset' } : { filter: 'unset' }}
                                            className={errors.password_confirmation && touched.password_confirmation ? "form-control top-input top-input-error" : "form-control top-input"}
                                            placeholder="********"
                                            type="password"
                                            disabled={isDisabled}
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
                                            color={'#241e1e'}
                                            loading={props.isLoading} />
                                        : <button disabled={isDisabled} style={isDisabled ? { opacity: '0.6', cursor: 'default' } : null} className="theme_btn theme_primary w-420" type="submit">UPDATE PASSWORD</button>
                                }
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default changePassword