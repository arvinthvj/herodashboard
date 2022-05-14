import React, { useEffect, useState } from 'react';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  IssuesList,
  TypesOfIssues,
  themeBlackColor,
  routes,
} from '../../utility/constants/constants';
import { isSafari } from '../../utility/utility';
import { SelectIssuesAndTimeValidation } from '../../utility/validator/FormValidation/FormValidation';
import { DatePickerField } from '../UI/StarRating/DatePicker';
import RingLoader from 'react-spinners/RingLoader';
import { css } from '@emotion/core';
import ReactTooltip from 'react-tooltip';
import './SelectIssuesAndTime.css';
import { Prompt } from 'react-router-dom';
import $ from 'jquery';

const IssuesImages = (issue, i) => {
  if (issue.name === TypesOfIssues.AUDIO) {
    return (
      <span className="check_icn audio_icn_postion">
        <svg
          className="mr-1 svg_icon"
          xmlns="http://www.w3.org/2000/svg"
          width="25.545"
          height="28.398"
          viewBox="0 0 25.545 28.398"
          key={i}
        >
          <g id="speaker" transform="translate(0 2.301)">
            <g
              id="Group_87"
              data-name="Group 87"
              transform="translate(0 -2.301)"
            >
              <g id="Group_86" data-name="Group 86">
                <path
                  id="Path_139"
                  className="icn_hover"
                  data-name="Path 139"
                  d="M38.387,0a.955.955,0,0,1,.562.183L48.88,7.392a.94.94,0,0,0,.556.18h5.976a1.422,1.422,0,0,1,1.42,1.42V19.406a1.421,1.421,0,0,1-1.42,1.42H49.436a.941.941,0,0,0-.556.18l-9.932,7.209a.953.953,0,0,1-.561.183.963.963,0,0,1-.961-.964V.959A.961.961,0,0,1,38.387,0Zm-.014,27.435c0,.005,0,.017.014.017l9.936-7.211a1.88,1.88,0,0,1,1.112-.361h5.976a.474.474,0,0,0,.473-.473V8.992a.474.474,0,0,0-.473-.474H49.436a1.879,1.879,0,0,1-1.112-.361L38.373.959Z"
                  transform="translate(-31.287)"
                  fill="#333"
                />
                <path
                  id="Path_140"
                  className="icn_hover"
                  data-name="Path 140"
                  d="M584.665,249.133a.473.473,0,0,1,.21.636,9.231,9.231,0,0,0,0,8.037.473.473,0,0,1-.846.425,10.209,10.209,0,0,1,0-8.888A.474.474,0,0,1,584.665,249.133Z"
                  transform="translate(-580.177 -239.588)"
                  fill="#333"
                />
                <path
                  id="Path_141"
                  className="icn_hover"
                  data-name="Path 141"
                  d="M638.368,195.772a.473.473,0,0,1,.795.514,11.53,11.53,0,0,0,0,12.028.473.473,0,1,1-.795.514A12.517,12.517,0,0,1,638.368,195.772Z"
                  transform="translate(-636.53 -188.102)"
                  fill="#333"
                />
              </g>
            </g>
          </g>
        </svg>
      </span>
    );
  } else if (issue.name === TypesOfIssues.VIDEO) {
    return (
      <span className="check_icn video_icn_postion">
        <svg
          className="mr-1 svg_icon"
          xmlns="http://www.w3.org/2000/svg"
          width="25.504"
          height="21.253"
          viewBox="0 0 25.504 21.253"
          key={i}
        >
          <g id="next" transform="translate(0 -42.667)">
            <g
              id="Group_89"
              data-name="Group 89"
              transform="translate(0 42.667)"
            >
              <g id="Group_88" data-name="Group 88" transform="translate(0 0)">
                <path
                  id="Path_142"
                  className="icn_hover"
                  data-name="Path 142"
                  d="M16.8,52.934.652,42.733A.425.425,0,0,0,0,43.092V63.5a.425.425,0,0,0,.652.359L16.8,53.653a.425.425,0,0,0,0-.719ZM.85,62.724V43.863l14.931,9.43Z"
                  transform="translate(0 -42.667)"
                  fill="#333"
                />
                <path
                  id="Path_143"
                  className="icn_hover"
                  data-name="Path 143"
                  d="M495.359,42.667a.425.425,0,0,0-.425.425V63.5a.425.425,0,0,0,.85,0v-20.4A.425.425,0,0,0,495.359,42.667Z"
                  transform="translate(-470.28 -42.667)"
                  fill="#333"
                />
                <path
                  id="Path_144"
                  className="icn_hover"
                  data-name="Path 144"
                  d="M392.959,42.667a.425.425,0,0,0-.425.425V63.5a.425.425,0,0,0,.85,0v-20.4A.425.425,0,0,0,392.959,42.667Z"
                  transform="translate(-372.981 -42.667)"
                  fill="#333"
                />
              </g>
            </g>
          </g>
        </svg>
      </span>
    );
  } else if (issue.name === TypesOfIssues.CONTROL) {
    return (
      <span className="check_icn">
        <svg
          className="mr-1 svg_icon"
          xmlns="http://www.w3.org/2000/svg"
          width="25.691"
          height="22.266"
          viewBox="0 0 25.691 22.266"
          key={i}
        >
          <g
            id="switch"
            transform="translate(0 -34.133)"
            style={{ mixBlendMode: 'luminosity', isolation: 'isolate' }}
          >
            <g
              id="Group_91"
              data-name="Group 91"
              transform="translate(0 34.133)"
            >
              <g id="Group_90" data-name="Group 90" transform="translate(0 0)">
                <path
                  id="Path_145"
                  className="icn_hover"
                  data-name="Path 145"
                  d="M4.71,43.553H20.981a4.71,4.71,0,0,0,0-9.42H4.71a4.71,4.71,0,1,0,0,9.42Zm0-8.564H20.981a3.854,3.854,0,0,1,0,7.707H4.71a3.854,3.854,0,0,1,0-7.707Z"
                  transform="translate(0 -34.133)"
                  fill="#333"
                />
                <path
                  id="Path_146"
                  className="icn_hover"
                  data-name="Path 146"
                  d="M37.131,74.262a3,3,0,1,0-3-3A3,3,0,0,0,37.131,74.262Zm0-5.138a2.141,2.141,0,1,1-2.141,2.141A2.143,2.143,0,0,1,37.131,69.123Z"
                  transform="translate(-32.421 -66.554)"
                  fill="#3a3a3a"
                />
                <path
                  id="Path_147"
                  className="icn_hover"
                  data-name="Path 147"
                  d="M20.981,290.133H4.71a4.71,4.71,0,0,0,0,9.42H20.981a4.71,4.71,0,0,0,0-9.42Zm0,8.564H4.71a3.854,3.854,0,0,1,0-7.707H20.981a3.854,3.854,0,1,1,0,7.707Z"
                  transform="translate(0 -277.288)"
                  fill="#333"
                />
                <path
                  id="Path_148"
                  className="icn_hover"
                  data-name="Path 148"
                  d="M361.4,324.267a3,3,0,1,0,3,3A3,3,0,0,0,361.4,324.267Zm0,5.138a2.141,2.141,0,1,1,2.141-2.141A2.143,2.143,0,0,1,361.4,329.405Z"
                  transform="translate(-340.416 -309.709)"
                  fill="#333"
                />
              </g>
            </g>
          </g>
        </svg>
      </span>
    );
  } else if (issue.name === TypesOfIssues.OTHER) {
    return (
      <span className="check_icn ">
        <svg
          className="mr-1 svg_icon"
          xmlns="http://www.w3.org/2000/svg"
          width="25.065"
          height="25.708"
          viewBox="0 0 25.065 25.708"
          key={i}
        >
          <g id="menu" transform="translate(-35.973 -122.229)">
            <g
              id="Group_93"
              data-name="Group 93"
              transform="translate(35.973 122.229)"
            >
              <g id="Group_92" data-name="Group 92" transform="translate(0 0)">
                <path
                  id="Path_149"
                  className="icn_hover"
                  data-name="Path 149"
                  d="M10.926,85.333H.643A.643.643,0,0,0,0,85.976V96.259a.642.642,0,0,0,.643.643H10.926a.642.642,0,0,0,.643-.643V85.976A.642.642,0,0,0,10.926,85.333Zm-.643,10.283h-9v-9h9v9Z"
                  transform="translate(0 -85.333)"
                  fill="#333"
                />
                <path
                  id="Path_150"
                  className="icn_hover"
                  data-name="Path 150"
                  d="M190.126,85.333H179.843a.642.642,0,0,0-.643.643V96.259a.643.643,0,0,0,.643.643h10.283a.642.642,0,0,0,.643-.643V85.976A.642.642,0,0,0,190.126,85.333Zm-.643,10.283h-9v-9h9v9Z"
                  transform="translate(-165.703 -85.333)"
                  fill="#333"
                />
                <path
                  id="Path_152"
                  className="icn_hover"
                  data-name="Path 152"
                  d="M10.926,273.067H.643A.643.643,0,0,0,0,273.71v10.283a.643.643,0,0,0,.643.643H10.926a.642.642,0,0,0,.643-.643V273.71A.642.642,0,0,0,10.926,273.067Zm-.643,10.283h-9v-9h9v9Z"
                  transform="translate(0 -258.928)"
                  fill="#3a3a3a"
                />
                <path
                  id="Path_153"
                  className="icn_hover"
                  data-name="Path 153"
                  d="M190.126,273.067H179.843a.642.642,0,0,0-.643.643v10.283a.643.643,0,0,0,.643.643h10.283a.642.642,0,0,0,.643-.643V273.71A.642.642,0,0,0,190.126,273.067Zm-.643,10.283h-9v-9h9v9Z"
                  transform="translate(-165.703 -258.928)"
                  fill="#333"
                />
              </g>
            </g>
          </g>
        </svg>
      </span>
    );
  }
};

const SelectIssue = (issue, i, props, services) => {
  const issuesClicked = async (name, id) => {
    if (name === TypesOfIssues.OTHER) {
      services.forEach(service => {
        if (service.id != id) {
          props.setFieldValue(`services[${service.id}]`, false);
        }
      });
    } else {
      services.forEach(service => {
        if (service.name === TypesOfIssues.OTHER) {
          props.setFieldValue(`services[${service.id}]`, false);
        }
      });
    }
    await Promise.resolve();
    props.validateForm();
  };

  return (
    <li>
      {/* <ErrorMessage name="additional_info" render={msg => <span className="error_message">{msg}</span>} /> */}
      <div className="avh_checkbox_cont clearfix">
        <div data-toggle="buttons" className="btn-group itemcontent">
          <label
            style={
              props.values.services[issue.id]
                ? { backgroundColor: '#5c6060', borderColor: '#5c6060' }
                : null
            }
            className={
              props.values.services[issue.id]
                ? 'btn btn_check active'
                : 'btn btn_check'
            }
          >
            <div className="itemcontent">
              <Field
                type="checkbox"
                name={`services[${issue.id}]`}
                key={i}
                onClick={() => issuesClicked(issue.name, issue.id)}
              />
              {/* <input type="checkbox" name="var_id[]" autocomplete="off" value=""> */}

              {/* {IssuesImages(issue, i)} */}
              <span className={'check_title'}>{issue.name}</span>
            </div>
          </label>
        </div>
      </div>
    </li>
  );
};

const SelectIssuesAndTime = props => {
  const [isBlocking, setIsBlocking] = useState(true);

  useEffect(() => {
    $('.react-datepicker-wrapper').attr(
      'data-tip',
      'Select this if you would like to book for a future Date/Time.',
    );
    ReactTooltip.rebuild();
  }, []);

  const overrideSpinnerCSS = css`
    margin: 0 auto;
  `;

  const dateInputClicked = onChange => {
    onChange('asap', false);
  };

  const addIssuesAndTime = values => {
    setIsBlocking(false);
    props.addIssuesAndTime(values);
  };
  const setInitialValues = {
    description:
      props.bookingData && props.bookingData.description
        ? props.bookingData.description
        : '',
    code: props.business_card_hero_code
      ? props.business_card_hero_code
      : props.bookingData && props.bookingData.code
        ? props.bookingData.code
        : '',
    scheduled_at:
      props.bookingData &&
        props.bookingData.scheduled_at &&
        !props.bookingData.asap
        ? props.bookingData.scheduled_at
        : '',
    asap:
      props.bookingData && props.bookingData.asap !== undefined
        ? props.bookingData.asap
        : true,
    services:
      props.bookingData && props.bookingData.services
        ? props.bookingData.services
        : [],
  };

  return (
    <div className="home_hero">
      <div className="container">
        {/* {(props.location.pathname === routes.LOCATION_AND_PAYMENT_DETAIL || props.location.pathname === routes.REVIEW_AND_CONFIRM || props.location.pathname === routes.SELECT_ISSUES_AND_TIME) ? */}
        <div className="sub_head_tlt">
          <div className="mainTitle">
            <h2 className="ft_Weight_600 mb-0 text-uppercase">I NEED A HERO</h2>
          </div>
        </div>
      </div>
      {!isSafari() && (
        <Prompt
          when={isBlocking}
          message={location => `Do you want to leave the booking page?`}
        />
      )}
      {/* : null} */}
      <div className="wrap-login100 wrapW500">
        <Formik
          enableReinitialize={true}
          initialValues={setInitialValues}
          validate={values =>
            SelectIssuesAndTimeValidation(values, props.services)
          }
          onSubmit={addIssuesAndTime}
        >
          {formicProps => {
            return (
              <Form className="login100-form" id="login_form">
                <article className="limiter_heading_wrp mx-auto">
                  <h1 className="text-primary display4 ft_Weight_600">
                    Please Describe Your Request
                  </h1>{' '}
                  <h4 className="mt-2">(check all that apply)</h4>
                  {/* <h1 className="display4 ft_Weight_600 text-danger">
                    Please Describe Your Request <br />
                    <h4>(check all that apply)</h4>
                  </h1> */}
                </article>
                <ReactTooltip
                  globalEventOff="click"
                  className="tooltip-custom"
                  html={true}
                />
                <div className="inner_form items_collection">
                  <div className="fields">
                    <div className="form_group_modify1 mb-1">
                      <ErrorMessage
                        name="scheduled_at"
                        render={msg => (
                          <span className="error_message">{msg}</span>
                        )}
                      />
                      <ErrorMessage
                        name="services"
                        render={msg => (
                          <span className="error_message">{msg}</span>
                        )}
                      />
                      <ul className="avh_action_list">
                        {props.services.map((issue, i) =>
                          SelectIssue(issue, i, formicProps, props.services),
                        )}
                      </ul>
                      <ul className="avh_action_list">
                        <li className="w-97_textarea">
                          <Field
                            as="textarea"
                            name="description"
                            placeholder="Please Provide Details..."
                            className="form-control"
                            rows="3"
                          />
                          <ErrorMessage
                            name="description"
                            render={msg => (
                              <span className="error_message">{msg}</span>
                            )}
                          />
                        </li>

                        <li>
                          <div
                            data-tip="Select this if you want our service as soon as possible"
                            className="avh_checkbox_cont clearfix"
                          >
                            <div
                              data-toggle="buttons"
                              className="btn-group itemcontent"
                            >
                              <label
                                className={
                                  formicProps.values.asap
                                    ? 'btn btn-default btn_check active'
                                    : 'btn btn-default btn_check'
                                }
                              >
                                <div className="itemcontent">
                                  {/* disabled={formicProps.values.date} */}
                                  <Field
                                    type="checkbox"
                                    name="asap"
                                    onClick={() =>
                                      formicProps.setFieldValue(
                                        'scheduled_at',
                                        '',
                                      )
                                    }
                                  />
                                  <span
                                    className={
                                      formicProps.values.asap
                                        ? 'check_title asap_text_color'
                                        : 'check_title'
                                    }
                                  >
                                    ASAP
                                  </span>
                                </div>
                              </label>
                            </div>
                          </div>
                        </li>
                        <li>
                          <DatePickerField
                            name="scheduled_at"
                            minDate={new Date()}
                            dateFormat="MM-dd-yyyy h:mm aa"
                            showTimeSelect={true}
                            placeholder="FUTURE"
                            dateInputClicked={dateInputClicked}
                            timeCaption="time"
                            timeFormat="hh:mm aa"
                            timeIntervals={15}
                            className={
                              formicProps.values.scheduled_at
                                ? 'dateplaceholder action_link mb-0 w-100 active datePointerClass'
                                : 'dateplaceholder action_link mb-0 w-100 datePointerClass removeBlinker'
                            }
                            // disabled={formicProps.values.asap}
                            value={formicProps.values.scheduled_at}
                            onChange={formicProps.setFieldValue}
                          />
                        </li>
                      </ul>
                    </div>
                    {/* {props.user ? */}
                    <div className="form_group_modify">
                      <ReactTooltip
                        // globalEventOff="click"
                        className="tooltip-custom"
                        html={true}
                      />
                      <label for="code" className="label_modify">
                        HERO Code (Optional){' '}
                      </label>
                      <img
                        className="toolTipInfoClass pointer_cursor"
                        data-tip={` The HERO Code is a unique identifier that allows you to request a specific AV HERO.`}
                        src="/images/icons/info.svg"
                      />{' '}
                      <Field
                        id="code"
                        type="text"
                        className="input_modify input_modify_lg"
                        name="code"
                        placeholder="Enter here"
                      />
                      {/* <ErrorMessage name="code" render={msg => <span className="error_message">{msg}</span>} /> */}
                    </div>
                    {/* : null} */}
                  </div>
                  <div className="form-group mb-0">
                    {props.isLoading ? (
                      <RingLoader
                        css={overrideSpinnerCSS}
                        sizeUnit={'px'}
                        size={30}
                        color={themeBlackColor}
                        loading={props.isLoading}
                      />
                    ) : (
                      <button
                        type="submit"
                        className="theme_primary btn-block theme_btn_lg theme_btn"
                      >
                        {' '}
                        Next{' '}
                      </button>
                    )}
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

export default SelectIssuesAndTime;
