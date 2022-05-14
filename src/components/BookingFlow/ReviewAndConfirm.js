import React, { useState } from "react";
import { Form, Formik, Field, ErrorMessage } from "formik";
import {
  convertTZToJobCardTime,
  capitalizeFirstLetter,
} from "../../utility/utility";
import {
  FavHeros,
  IssuesList,
  themeBlackColor,
  routes,
} from "../../utility/constants/constants";
import { ReviewAndConfirmValidation } from "../../utility/validator/FormValidation/FormValidation";
import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import RingLoader from "react-spinners/RingLoader";
import GoogleMapReact from "google-map-react";
import { Prompt } from "react-router-dom";
import { css } from "@emotion/core";
import { isSafari } from "../../utility/utility";
var moment = require("moment");

const getFavHeros = (heros) => {
  const FavHeros = (heros) =>
    heros.map((h, i) => {
      console.log(h, "hero");
      let heroProfile = null;
      if (h.photo_urls && Object.keys(h.photo_urls).length > 0) {
        heroProfile = h.photo_urls.small;
      } else if (h.social_photo_url) {
        heroProfile = h.social_photo_url;
      } else {
        heroProfile = "/custom_images/hero_placeholder.png";
      }
      return (
        <li key={i}>
          <label className="btn_rado_container">
            {h.short_name}
            <Field
              type="checkbox"
              name="preferred_provider_id"
              value={h.id.toString()}
            />
            <span className="btn_rado_checkmark"></span>
            <span className="favHeroImageSpan">
              <img
                className="favHeroImage"
                src={heroProfile}
                alt="hero image"
              />
            </span>
          </label>
        </li>
      );
    });

  return (
    <>
      <div className="avh_seprator avh_sep_xl"></div>
      <ReactTooltip
        globalEventOff="click"
        className="tooltip-custom"
        html={true}
      />
      <div className="avh_info_list">
        <h3>
          Would you like to work with one of your favorite AV HEROES?
          <img
            className="pointer_cursor"
            style={{ paddingBottom: "5px", marginLeft: "2px", width: "12px" }}
            data-tip={`If your preferred AV HERO does not accept the job within 2-hours, the job will be sent to other HEROES in your area.`}
            data-event="click focus"
            src="/images/icons/info.svg"
          />
        </h3>
        <ul className="items_collection">{FavHeros(heros)}</ul>
      </div>
    </>
  );
};

const onClickToolTip = () => {
  $(function () {
    $('[data-toggle="popover"]').popover();
  });
};

const selectedIssues = (selectedServices, services) => {
  const JSXIssuesData = [];
  // const IssuesKeys = [];

  // services.forEach((element, key) => {
  //     if (element) {
  //         IssuesKeys.push(key);
  //     }
  // });

  selectedServices.forEach((sService) => {
    services.map((service) => {
      if (service.id === sService.service_id) {
        JSXIssuesData.push(<a>{service.name}</a>);
      }
    });
  });
  return JSXIssuesData;
};

const ReviewAndConfirm = (props) => {
  const [isBlocking, setIsBlocking] = useState(true);

  console.log(props.bookingData);
  const overrideSpinnerCSS = css`
    margin: 0 auto;
  `;

  const addReviewAndConfirm = (values) => {
    setIsBlocking(false);
    props.addReviewAndConfirm(values);
  };

  const addressClicked = () => {
    setIsBlocking(false);
    if (process.env.REACT_APP_ENV === "development") {
      props.history.push(routes.OPEN_GOOGLE_MAPS);
    }
    if (process.env.REACT_APP_ENV === "staging") {
      window.open(`https://stage.avhero.com${routes.OPEN_GOOGLE_MAPS}`); //to open new page
    }
    if (process.env.REACT_APP_ENV === "production") {
      console.log("production if");
      window.open(`https://stage.avhero.com${routes.OPEN_GOOGLE_MAPS}`); //to open new page
    }
  };
  //
  return (
    <div className="home_hero">
      <div className="container">
        <div className="sub_head_tlt">
          <div className="mainTitle">
            <h2 className="ft_Weight_600 mb-0 text-uppercase">I NEED A HERO</h2>
          </div>
        </div>
      </div>
      {!isSafari() && (
        <Prompt
          when={isBlocking}
          message={(location) => `Do you want to leave the booking page?`}
        />
      )}
      <div className="wrap-login100 wrapW500">
        <Formik
          initialValues={{}}
          validate={ReviewAndConfirmValidation}
          onSubmit={addReviewAndConfirm}
        >
          <Form className="login100-form" id="login_form">
            <article className="limiter_heading_wrp mx-auto">
              <h1 className="text-primary ft_Weight_600 display4">Review and Confirm</h1>
              {/* <h1 className="display4 ft_Weight_600 text-danger">
                Please Review and Confirm
              </h1> */}
            </article>
            <div className="inner_form">
              <ReactTooltip
                globalEventOff="click"
                className="tooltip-custom"
                html={true}
              />
              <article className="avh_art avh_art_aud text-center review_confrm">
                {/* <h3>Thank you {props.user.first_name + ' ' + props.user.last_name} for the request</h3> */}
                <h2 style={{ fontWeight: 500 }}>
                  {capitalizeFirstLetter(props.user.company_name)}
                </h2>
                <h3>
                  {capitalizeFirstLetter(props.bookingData.point_of_contact)}
                </h3>

                <h6
                  className="text_blue_100 mb-14"
                // onClick={addressClicked} style={{ cursor: 'pointer' }}
                >
                  {capitalizeFirstLetter(props.bookingData.address)}
                  {props.bookingData.address_attributes.description &&
                    props.bookingData.address_attributes.description.length >
                    0 ? (
                    <img
                      className="toolTipInfoClass pointer_cursor"
                      data-tip={`${props.bookingData.address_attributes.description}`}
                      data-event="click focus"
                      src="/custom_images/note_icon.svg"
                    />
                  ) : null}
                </h6>
                {props.bookingData.code && props.bookingData.code !== "" ? (
                  <h5 className="font-semi-bold">
                    You have requested{" "}
                    <span className=" text-danger number_font text-uppercase">
                      {props.bookingData.code}
                    </span>{" "}
                    for this booking
                    <img
                      className="toolTipInfoClass pointer_cursor"
                      data-tip={`If your preferred AV HERO does not accept the job within 2-hours, the job will be sent to other HEROES in your area.`}
                      data-event="click focus"
                      src="/images/icons/info.svg"
                    />
                  </h5>
                ) : null}

                <h5 className="font-semi-bold">
                  You will be charged a rate of{" "}
                  <span className=" text-danger number_font">
                    ${props.settings.hourly_rate} Per Hour
                  </span>
                  <img
                    className="toolTipInfoClass pointer_cursor"
                    data-tip={`There is a 1 hour minimum for AV HERO services.<br/> After the first hour you will be billed in 15-minute increments.`}
                    data-event="click focus"
                    src="/images/icons/info.svg"
                  />
                </h5>
                <div className="audio_btns">
                  {selectedIssues(
                    props.bookingData.booking_services_attributes,
                    props.services
                  )}
                </div>
                {!props.bookingData.description ||
                  props.bookingData.description === "" ? null : (
                  <h6
                    className="text_blue_100 mb-14"
                    style={{ wordWrap: "break-word" }}
                  >
                    {props.bookingData.description}
                  </h6>
                )}
                <div className="avh_seprator"></div>
                <h3
                  className={
                    props.bookingData.asap ? "text-danger font-semi-bold" : ""
                  }
                >
                  {props.bookingData.asap
                    ? "ASAP"
                    : props.bookingData.scheduled_at
                      ? convertTZToJobCardTime(props.bookingData.scheduled_at)
                      : ""}
                </h3>
              </article>

              {props.bookingData.code && props.bookingData.code !== ""
                ? null
                : props.userFavoriteHerosList.length !== 0
                  ? getFavHeros(props.userFavoriteHerosList)
                  : null}
              <div className="form-group">
                {props.createBookingLoading ? (
                  <RingLoader
                    css={overrideSpinnerCSS}
                    sizeUnit={"px"}
                    size={30}
                    color={themeBlackColor}
                    loading={props.createBookingLoading}
                  />
                ) : (
                  <button
                    type="submit"
                    className={"theme_primary btn-block theme_btn_lg theme_btn"}
                  >
                    {" "}
                    CONFIRM{" "}
                  </button>
                )}
              </div>
              <div className="form-group">
                <h5 className="font-semi-bold text-center">
                By confirming, you agree to AV HERO'S <br />
                  <a
                    href={routes.TERMS_OF_USE}
                    target="_blank"
                    className="theme_link_danger form_link"
                  >
                    Terms of Use{" "}
                  </a>{" "}
                  and{" "}
                  <a
                    href={routes.PRIVACY_POLICY}
                    target="_blank"
                    className="theme_link_danger form_link"
                  >
                    Privacy Policy{" "}
                  </a>
                </h5>
              </div>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ReviewAndConfirm;