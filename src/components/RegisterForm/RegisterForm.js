import React from "react";
import { Formik, Form, Field } from "formik";
import {
  validateRegisterClientForm,
  validateRegisterHeroForm,
  validate_company_name,
  validate_custom_phone_number_field,
} from "../../utility/validator/FormValidation/FormValidation";
import {
  errorStyle,
  routes,
  roles,
  PhNoPattern,
  client_sign_up_types,
  themeBlackColor,
} from "../../utility/constants/constants";
import { FaceBook, Google } from "../SocialMediaLogin/SocialMediaLogin";
import RingLoader from "react-spinners/RingLoader";
import { css } from "@emotion/core";
import ReactPhoneNumberInput from "../UI/ReactPhoneNumberInput/ReactPhoneNumberInput";
import Oux from "../../hoc/Oux/Oux";
import "./RegisterForm.css";
import { WPLink } from "../../config";

const registerForm = (props) => {
  const overrideSpinnerCSS = css`
    margin: 0 auto;
  `;

  const initialValuesHeroForm = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    register_checkbox: false,
  };
  const initialValuesClientForm = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    company_name: "",
    client_type: client_sign_up_types.BUSINESS,
    register_checkbox: false,
  };

  let routerStateProps = props.history.location.state;
  if (props.history.location.search.includes("hero=true")) {
    if (routerStateProps) {
      routerStateProps["signUpAsHero"] = true
    } else {
      routerStateProps = { "signUpAsHero": true }
    }
  }

  return (
    <div class="home_hero">
      <div class="container">
        <div class="sub_head_tlt">
          <div class="mainTitle">
            <h2 class="ft_Weight_600">
              {(routerStateProps && routerStateProps.signUpAsUser) ||
                (props.signUpAsUser && !routerStateProps)
                ? "SIGN UP"
                : "BECOME AN AV HERO"}
            </h2>
          </div>
        </div>
      </div>

      <div className="wrap-login100">
        <Formik
          enableReinitialize={true}
          initialValues={
            routerStateProps && routerStateProps.signUpAsHero
              ? initialValuesHeroForm
              : initialValuesClientForm
          }
          onSubmit={(values) => {
            values = {
              ...values,
              first_name:
                values.first_name.charAt(0).toUpperCase() +
                values.first_name.slice(1),
              last_name:
                values.last_name.charAt(0).toUpperCase() +
                values.last_name.slice(1),
              phone: "+" + values.phone,
              role:
                (routerStateProps && routerStateProps.signUpAsHero) ||
                  props.signUpAsHero
                  ? roles.service_provider
                  : roles.client,
            };
            props.registerUser({ user: values });
            console.log(values, "Values");
          }}
          validateOnBlur={false}
          validationSchema={
            routerStateProps && routerStateProps.signUpAsHero
              ? validateRegisterHeroForm
              : validateRegisterClientForm
          }
        >
          {(formik_props) => {
            const errors = formik_props.errors;
            const touched = formik_props.touched;
            // console.log(errors, 'errors')
            return (
              <Form className="login100-form" id="login_form">
                <article className="limiter_heading_wrp ml-auto mr-auto">
                  <h1 class="display4 ft_Weight_600 text-danger">
                    AV HERO is ready to <br /> Save the Day!
                  </h1>
                  <h5 class="mb-0">
                    Please Sign Up or{" "}
                    <a
                      className="theme_link_danger form_link sign_in_link"
                      href="javascript:void(0)"
                      onClick={props.moveToSignIn}
                    >
                      Sign In
                    </a>
                  </h5>
                </article>
                <div
                  className="btn-group signup_btns_group sign_up_btn_xs"
                  role="group"
                >
                  {(routerStateProps && routerStateProps.signUpAsUser) ||
                    (props.signUpAsUser && !routerStateProps) ? (
                    <button
                      style={{ padding: "0", pointerEvents: "none" }}
                      type="button"
                      onClick={() =>
                        props.toggleSignUpAsUser(formik_props.resetForm)
                      }
                      className={
                        (routerStateProps && routerStateProps.signUpAsUser) ||
                          (props.signUpAsUser && !routerStateProps)
                          ? "btn theme_btn theme_primary active"
                          : "btn theme_btn theme_primary active"
                      }
                    >
                      Sign up as a Customer
                    </button>
                  ) : null}
                  {routerStateProps && routerStateProps.signUpAsHero ? (
                    <button
                      style={{ padding: "0", pointerEvents: "none" }}
                      type="button"
                      onClick={() =>
                        props.toggleSignUpAsHero(formik_props.resetForm)
                      }
                      className={
                        routerStateProps && routerStateProps.signUpAsHero
                          ? "btn theme_btn theme_danger active"
                          : "btn theme_btn theme_danger active"
                      }
                    >
                      Sign up as an AV HERO
                    </button>
                  ) : null}
                </div>
                <div className="inner_form">
                  <div className="fields">
                    <div className="row">
                      <div className="col-md-6 pr_10">
                        <div className="form_group_modify">
                          <label htmlFor="first_name" className="label_modify">
                            First Name*
                          </label>
                          <Field
                            style={
                              errors.first_name && touched.first_name
                                ? errorStyle
                                : null
                            }
                            id="first_name"
                            type="text"
                            className="input_modify input_modify_lg"
                            name="first_name"
                            placeholder=""
                          />
                          <span
                            style={{
                              color: "rgb(221, 39, 38)",
                              fontSize: "13px",
                            }}
                          >
                            {errors.first_name &&
                              touched.first_name &&
                              errors.first_name}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6 pl_10">
                        <div className="form_group_modify">
                          <label htmlFor="last_name" className="label_modify">
                            Last Name*
                          </label>
                          <Field
                            style={
                              errors.last_name && touched.last_name
                                ? errorStyle
                                : null
                            }
                            id="last_name"
                            type="text"
                            className="input_modify input_modify_lg"
                            name="last_name"
                            placeholder=""
                          />
                          <span
                            style={{
                              color: "rgb(221, 39, 38)",
                              fontSize: "13px",
                            }}
                          >
                            {errors.last_name &&
                              touched.last_name &&
                              errors.last_name}
                          </span>
                        </div>
                      </div>
                    </div>
                    {(routerStateProps && routerStateProps.signUpAsUser) ||
                      (props.signUpAsUser && !routerStateProps) ? (
                      <Oux>
                        <div className="row">
                          <div className="col-md-4 pr_10">
                            <div className="form_group_modify">
                              <div className="form-group text-center form_para_sm">
                                {/* <Field type="checkbox" id="customCheck1" name="register_checkbox" className="custom-control-input" checked={formik_props.values.register_checkbox} onChange={(event) => formik_props.setFieldValue("register_checkbox", event.target.checked)} />
                                                                <label className={errors.register_checkbox && touched.register_checkbox ? "custom-control-label checkbox-error-class" : "custom-control-label"} htmlFor="customCheck1">I accept the <a href="javascript:void(0)" className="theme_link" style={{cursor:'pointer'}} onClick={()=>props.history.push(routes.TERMS_AND_CONDITIONS)}>Terms of Service</a><a href="https://sugarapi.ctaxcrm.com/mobile-app/CTaxMobileTC.php" target="_blank" className="theme_link">Terms of Service</a> </label> */}
                                <label className="theme_checkbox_cont text-left mb-4">
                                  Residence
                                  <Field
                                    type="checkbox"
                                    name="residence_checkbox"
                                    onChange={(event) => {
                                      formik_props.setFieldValue(
                                        "client_type",
                                        event.target.checked
                                          ? client_sign_up_types.RESIDENCE
                                          : client_sign_up_types.BUSINESS
                                      );
                                      // formik_props.setFieldValue("business_checkbox", !event.target.checked)
                                    }}
                                    checked={
                                      formik_props.values.client_type ===
                                      client_sign_up_types.RESIDENCE
                                    }
                                  />
                                  <span
                                    style={
                                      errors.residence_checkbox &&
                                        touched.residence_checkbox
                                        ? errorStyle
                                        : null
                                    }
                                    className="theme_checkmark register_type_checkbox"
                                  >
                                    {" "}
                                  </span>
                                  <p
                                    style={{
                                      color: "rgb(221, 39, 38)",
                                      fontSize: "13px",
                                    }}
                                  >
                                    {errors.residence_checkbox &&
                                      touched.residence_checkbox &&
                                      errors.residence_checkbox}
                                  </p>
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 pl_10">
                            <div className="form_group_modify">
                              <div className="form-group text-center form_para_sm">
                                {/* <Field type="checkbox" id="customCheck1" name="register_checkbox" className="custom-control-input" checked={formik_props.values.register_checkbox} onChange={(event) => formik_props.setFieldValue("register_checkbox", event.target.checked)} />
                                                                <label className={errors.register_checkbox && touched.register_checkbox ? "custom-control-label checkbox-error-class" : "custom-control-label"} htmlFor="customCheck1">I accept the <a href="javascript:void(0)" className="theme_link" style={{cursor:'pointer'}} onClick={()=>props.history.push(routes.TERMS_AND_CONDITIONS)}>Terms of Service</a><a href="https://sugarapi.ctaxcrm.com/mobile-app/CTaxMobileTC.php" target="_blank" className="theme_link">Terms of Service</a> </label> */}
                                <label className="theme_checkbox_cont text-left mb-4">
                                  Business
                                  <Field
                                    type="checkbox"
                                    name="business_checkbox"
                                    onChange={(event) => {
                                      // formik_props.setFieldValue("residence_checkbox", !event.target.checked)
                                      // formik_props.setFieldValue("business_checkbox", event.target.checked)
                                      formik_props.setFieldValue(
                                        "client_type",
                                        event.target.checked
                                          ? client_sign_up_types.BUSINESS
                                          : client_sign_up_types.RESIDENCE
                                      );
                                    }}
                                    checked={
                                      formik_props.values.client_type ===
                                      client_sign_up_types.BUSINESS
                                    }
                                  />
                                  <span
                                    style={
                                      errors.business_checkbox &&
                                        touched.business_checkbox
                                        ? errorStyle
                                        : null
                                    }
                                    className="theme_checkmark register_type_checkbox"
                                  >
                                    {" "}
                                  </span>
                                  <p
                                    style={{
                                      color: "rgb(221, 39, 38)",
                                      fontSize: "13px",
                                    }}
                                  >
                                    {errors.business_checkbox &&
                                      touched.business_checkbox &&
                                      errors.business_checkbox}
                                  </p>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Oux>
                    ) : null}
                    {((routerStateProps && routerStateProps.signUpAsUser) ||
                      (props.signUpAsUser && !routerStateProps)) &&
                      formik_props.values.client_type ===
                      client_sign_up_types.BUSINESS ? (
                      <div className="form_group_modify">
                        <label htmlFor="company_name" className="label_modify">
                          Company Name*
                        </label>
                        <Field
                          validate={validate_company_name}
                          id="company_name"
                          style={
                            errors.company_name && touched.company_name
                              ? errorStyle
                              : null
                          }
                          type="text"
                          className="input_modify input_modify_lg"
                          name="company_name"
                          placeholder=""
                        />
                        <span
                          style={{
                            color: "rgb(221, 39, 38)",
                            fontSize: "13px",
                          }}
                        >
                          {errors.company_name &&
                            touched.company_name &&
                            errors.company_name}
                        </span>
                      </div>
                    ) : null}
                    <div className="form_group_modify">
                      <label htmlFor="phone" className="label_modify">
                        Mobile Number*
                      </label>
                      <Field
                        id="phone"
                        name="phone"
                        validate={validate_custom_phone_number_field}
                        children={({ field, form: { touched, errors } }) => (
                          <ReactPhoneNumberInput
                            className="form-control input_modify input_modify_lg custom_phone_input"
                            touched={formik_props.touched.phone}
                            dropDownClassName="signup-flag-dropdown"
                            setFieldTouched={formik_props.setFieldTouched}
                            errors={formik_props.errors}
                            blurHandler={formik_props.handleBlur}
                            setFieldValue={formik_props.setFieldValue}
                            phoneValue={formik_props.values.phone}
                          />
                        )}
                      />

                      <span
                        style={{ color: "rgb(221, 39, 38)", fontSize: "13px" }}
                      >
                        {errors.phone && touched.phone && errors.phone}
                      </span>
                    </div>
                    <div className="form_group_modify">
                      <label htmlFor="email" className="label_modify">
                        Email*
                      </label>
                      <Field
                        style={
                          errors.email && touched.email ? errorStyle : null
                        }
                        id="email"
                        type="text"
                        className="input_modify input_modify_lg"
                        name="email"
                        placeholder=""
                      />
                      <span
                        style={{ color: "rgb(221, 39, 38)", fontSize: "13px" }}
                      >
                        {errors.email && touched.email && errors.email}
                      </span>
                    </div>
                    <div className="form_group_modify passwordWrapper mb-4">
                      <label htmlFor="password" className="label_modify">
                        Password*
                      </label>
                      <div className="input-group">
                        <Field
                          style={
                            errors.password && touched.password
                              ? errorStyle
                              : null
                          }
                          id="password"
                          type={props.showPassword ? "text" : "password"}
                          className="input_modify input_modify_lg form-control password_fix"
                          name="password"
                          placeholder=""
                        />
                        <div className="input-group-append">
                          <span
                            onClick={props.onToggleShowHidePassword}
                            style={{ cursor: "pointer" }}
                            id="password_eye_icon"
                            className="input-group-text"
                          >
                            {props.showPassword ? (
                              <img
                                width="20px"
                                height="20px"
                                src="/custom_images/eye.svg"
                              />
                            ) : (
                              <img
                                width="20px"
                                height="20px"
                                src="/custom_images/eye_slash.svg"
                              />
                            )}
                          </span>
                        </div>
                      </div>
                      <span
                        style={{ color: "rgb(221, 39, 38)", fontSize: "13px" }}
                      >
                        {errors.password && touched.password && errors.password}
                      </span>
                    </div>
                    <div className="form-group text-center form_para_sm mb-4">
                      {/* <Field type="checkbox" id="customCheck1" name="register_checkbox" className="custom-control-input" checked={formik_props.values.register_checkbox} onChange={(event) => formik_props.setFieldValue("register_checkbox", event.target.checked)} />
                                                <label className={errors.register_checkbox && touched.register_checkbox ? "custom-control-label checkbox-error-class" : "custom-control-label"} htmlFor="customCheck1">I accept the <a href="javascript:void(0)" className="theme_link" style={{cursor:'pointer'}} onClick={()=>props.history.push(routes.TERMS_AND_CONDITIONS)}>Terms of Service</a><a href="https://sugarapi.ctaxcrm.com/mobile-app/CTaxMobileTC.php" target="_blank" className="theme_link">Terms of Service</a> </label> */}
                      <label className="theme_checkbox_cont text-left mb-1">
                        <Field
                          type="checkbox"
                          name="register_checkbox"
                          checked={formik_props.values.register_checkbox}
                          onChange={(event) =>
                            formik_props.setFieldValue(
                              "register_checkbox",
                              event.target.checked
                            )
                          }
                        />
                        <span
                          style={
                            errors.register_checkbox &&
                              touched.register_checkbox
                              ? errorStyle
                              : null
                          }
                          className="theme_checkmark"
                        >
                          {" "}
                        </span>
                      </label>
                      <span className="termsAndConditionText">
                        By clicking, you agree to both the AV HERO, Inc.{" "}
                        <a
                          href={WPLink.termsOfUse}
                          target="_blank"
                          className="theme_link_danger form_link"
                        >
                          Terms of Use{" "}
                        </a>{" "}
                        and{" "}
                        <a
                          href={WPLink.privacy}
                          target="_blank"
                          className="theme_link_danger form_link"
                        >
                          Privacy Policy{" "}
                        </a>
                        <p
                          style={{
                            color: "rgb(221, 39, 38)",
                            fontSize: "13px",
                          }}
                        >
                          {errors.register_checkbox &&
                            touched.register_checkbox &&
                            errors.register_checkbox}
                        </p>
                      </span>
                    </div>
                  </div>
                  <div className="form_group_modify">
                    <p>
                      * <span>Required fields</span>
                    </p>
                  </div>
                  <div className="form-group mt-3 px_25">
                    <RingLoader
                      css={overrideSpinnerCSS}
                      sizeUnit={"px"}
                      size={30}
                      color={themeBlackColor}
                      loading={props.isLoading}
                    />
                    {props.isLoading ? null : (
                      <button
                        // style={{
                        //   backgroundColor: "#0E55A5",
                        //   borderColor: "#0E55A5",
                        // }}
                        className="theme_primary btn-block theme_btn_lg theme_btn"
                        type="submit"
                      >
                        {" "}
                        {(routerStateProps && routerStateProps.signUpAsUser) ||
                          (props.signUpAsUser && !routerStateProps)
                          ? "Sign up as a Customer"
                          : "Sign up as an AV HERO"}{" "}
                      </button>
                    )}
                  </div>
                  <div className="social_btn_blocks mb-2">
                    <FaceBook {...props} {...formik_props} />
                    <Google {...props} {...formik_props} />
                  </div>
                  <p className="form-group font-semi-bold mb-0 text-center">
                    Already have an account?{" "}
                    <a
                      className="theme_link_danger form_link"
                      href="javascript:void(0)"
                      onClick={props.moveToSignIn}
                    >
                      Sign In
                    </a>
                  </p>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default registerForm;