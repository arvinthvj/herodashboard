import React from "react";
import { Form, Formik, Field } from "formik";
import { errorStyle, themeBlackColor } from "../../utility/constants/constants";
import { validateLoginForm } from "../../utility/validator/FormValidation/FormValidation";
import { FaceBook, Google } from "../SocialMediaLogin/SocialMediaLogin";
import RingLoader from "react-spinners/RingLoader";
import { css } from "@emotion/core";

const loginForm = (props) => {
  const overrideSpinnerCSS = css`
    margin: 0 auto;
  `;

  return (
    <div className="home_hero">
      <div class="container">
        <div class="sub_head_tlt">
          <div class="mainTitle">
            <h2 class="ft_Weight_600">SIGN IN</h2>
          </div>
        </div>
      </div>
      <div className="wrap-login100">
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => {
            props.loginUser({ user: values });
          }}
          validationSchema={validateLoginForm}
        >
          {(formik_props) => {
            const errors = formik_props.errors;
            const touched = formik_props.touched;
            console.log(errors, "errors", touched, "touched");
            return (
              <Form className="login100-form" id="login_form">
                <article className="limiter_heading_wrp ml-auto mr-auto">
                  <h1 class="display4 ft_Weight_600">Sign in</h1>
                </article>
                <div className="inner_form">
                  <div className="fields">
                    <div className="form_group_modify">
                      <Field
                        id="email"
                        type="email"
                        style={
                          errors.email && touched.email ? errorStyle : null
                        }
                        className="input_modify input_modify_lg"
                        name="email"
                        placeholder="Email"
                      />
                      <span
                        style={{ color: "rgb(221, 39, 38)", fontSize: "13px" }}
                      >
                        {errors.email && touched.email && errors.email}
                      </span>
                    </div>
                    <div className="form_group_modify">
                      <div className="input-group">
                        <Field
                          id="password"
                          type={props.showPassword ? "text" : "password"}
                          style={
                            errors.password && touched.password
                              ? errorStyle
                              : null
                          }
                          className="input_modify input_modify_lg form-control password_fix"
                          name="password"
                          placeholder="Password"
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
                  </div>
                  <div className="form-group">
                    {props.isLoading ? (
                      <RingLoader
                        css={overrideSpinnerCSS}
                        sizeUnit={"px"}
                        size={30}
                        color={themeBlackColor}
                        loading={props.isLoading}
                      />
                    ) : (
                      <button
                        className="theme_primary btn-block theme_btn_lg theme_btn"
                        type="submit"
                      >
                        {" "}
                        Sign In{" "}
                      </button>
                    )}
                  </div>
                  <div className="text-center">
                    <span className="text_or">Or</span>
                  </div>
                  <div className="social_btn_blocks">
                    <FaceBook {...props} {...formik_props} />
                    <Google {...props} {...formik_props} />
                  </div>
                  <div className="fot_link">
                    <ul>
                      <li>
                        <a
                          id="resetPassword"
                          href="javascript:void(0);"
                          onClick={props.moveToForgotPassword}
                        >
                          <span>Forgot Password</span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-circle"></i>{" "}
                        </a>
                      </li>
                      <li>
                        <a
                          href="javascript:void(0);"
                          onClick={props.moveToSignUp}
                          id="signup"
                          className="primary-action"
                        >
                          <span>Sign Up For An Account</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default loginForm;
