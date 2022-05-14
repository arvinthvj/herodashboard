import React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import {
  routes,
  roles,
  assessment_status,
  background_check,
  TypesOfIssues,
} from "../../utility/constants/constants";
import "./Home.css";
import * as actions from "../../redux/actions";
import moment from "moment";
import Oux from "../../hoc/Oux/Oux";
import storage from "../../utility/storage";
import { validateAVHeroCode } from "../../api/bookingAPI";
import { toastInfo } from "../../utility/utility";

const cloneDeep = require("clone-deep");

class Home extends React.Component {
  validateCode = async (bookingData) => {
    this.setState({
      isLoading: true,
    });

    const IssuesAndTImeData = cloneDeep(bookingData);
    let response = await validateAVHeroCode(bookingData.code);

    this.setState({
      isLoading: false,
    });

    if (response.data.success === "true") {
      IssuesAndTImeData["preferred_provider_id"] = response.data.user.id;
      const ServiceProviderServices = cloneDeep(response.data.user.services);
      let index = [];
      IssuesAndTImeData.booking_services_attributes.map((service) => {
        index.push(
          ServiceProviderServices.findIndex((s) => service.service_id === s.id)
        );
      });

      let OtherIndex = null;
      this.props.services.forEach((ser) => {
        if (ser.name === TypesOfIssues.OTHER) {
          OtherIndex = IssuesAndTImeData.booking_services_attributes.findIndex(
            (s) => s.service_id === ser.id
          );
        }
      });
      // let otherIndex = this.props.services.findIndex(s => s.name === TypesOfIssues.OTHER)
      // const otherObject = this.props.services[otherIndex];

      // otherIndex = IssuesAndTImeData.booking_services_attributes.findIndex(s => service.service_id === otherObject.id);

      if (index.includes(-1) || (OtherIndex && OtherIndex > -1)) {
        const isExpert = ServiceProviderServices.every(
          (s) => s.experience === "expert"
        );
        if (!isExpert) {
          toastInfo("This hero doesn't support this service.");
          this.props.history.push(routes.SELECT_ISSUES_AND_TIME);
        } else {
          this.props.updateBookingState({
            ...this.props.bookingData,
            ...IssuesAndTImeData,
          });
          this.props.history.push({
            pathname: routes.LOCATION_AND_PAYMENT_DETAIL,
            // state: { ...this.props.history.location.state, ...IssuesAndTImeData }
          });
        }
      } else if (index.includes(-1)) {
        toastInfo(
          "The services you have selected do not match the requested HERO’s services"
        );
        this.props.history.push(routes.SELECT_ISSUES_AND_TIME);
      } else {
        this.props.updateBookingState({
          ...this.props.bookingData,
          ...IssuesAndTImeData,
        });
        this.props.history.push(routes.LOCATION_AND_PAYMENT_DETAIL);
      }
    } else {
      this.props.history.push(routes.SELECT_ISSUES_AND_TIME);
    }
  };

  componentDidMount() {
    let isDisabled =
      this.props.user.role === roles.service_provider &&
      (this.props.user.assessment_status.toLowerCase() ===
        assessment_status.SUBMITTED.toLowerCase() ||
        this.props.user.assessment_status.toLowerCase() ===
        assessment_status.FAILED.toLowerCase() ||
        (this.props.user.background_check &&
          (this.props.user.background_check.toLowerCase() ===
            background_check.FAILED.toLowerCase() ||
            this.props.user.background_check.toLowerCase() ===
            background_check.PENDING.toLowerCase())));

    if (this.props.emailPath) {
      this.props.history.push(this.props.emailPath);
    } else {
      if (this.props.user) {
        this.props.getUserProfile();
        let business_card_booking = storage.get(
          "booking_from_business_card",
          null
        );
        if (business_card_booking) {
          this.props.history.push(routes.SELECT_ISSUES_AND_TIME);
        }
      }
      if (this.props.isSigningupForBooking) {
        if (this.props.user && this.props.bookingData.code !== "") {
          this.validateCode(this.props.bookingData);
        } else {
          this.props.history.push(routes.LOCATION_AND_PAYMENT_DETAIL);
        }
        this.props.updateIsSigningFromBooking(false);
      } else if (
        isDisabled &&
        this.props.user.address &&
        Object.keys(this.props.user.address).length > 0 &&
        this.props.user.assessment_status.toLowerCase() !==
        assessment_status.REQUESTED.toLowerCase()
      ) {
      } else if (
        this.props.user && this.props.user.role === roles.service_provider &&
        this.props.user.assessment_status.toLowerCase() ===
        assessment_status.REQUESTED.toLowerCase()
      ) {

      } else {
        this.props.history.push(routes.DASHBOARD);
      }
    }
  }

  navigateToBookingFlow = () => {
    this.props.history.push(routes.SELECT_ISSUES_AND_TIME);
    // if (this.props.user) {
    //     this.props.history.push(routes.SELECT_ISSUES_AND_TIME);
    // } else {
    //     this.props.updateIsSigningFromBooking(true);
    //     this.props.history.push(routes.REGISTER, { signUpAsHero: false, signUpAsUser: true });
    // }
  };

  render() {
    let step = null;
    let retestBtn = null;
    if (this.props.user && this.props.user.role === roles.service_provider) {
      let reTakeTestDate = this.props.user.next_attempt_at_utc;
      let todayDate = new Date();
      let currentUTCDateTime = moment(todayDate.toUTCString()).format(
        "YYYY-MM-DDTHH:mm:ss[Z]"
      );
      if (this.props.user.assessment_status === assessment_status.SUBMITTED) {
        if (currentUTCDateTime >= reTakeTestDate) {
          retestBtn = (
            <a
              className="theme_btn theme_danger mt-3"
              style={{ color: "white" }}
              onClick={() => console.log("Retest Clicked")}
            >
              ReTake Test
            </a>
          );
        }
        step = (
          <section className="home_hero homeHeroNew FlexVrCenter home_section_hero_wrapper">
            <div className="container">
              <div class="iNeedHeroWrap">
                <article
                  className="art_hero_text_home take_hero_assessment hero_assessment_completed"
                  style={{ width: "100%" }}
                >
                  <h1 className="about-us-hero__title">
                    Thank you for completing the AV HERO Assessment.
                  </h1>
                  <p className="about-us-hero__title">
                    AV HERO HQ will be in touch shortly!
                  </p>
                  <div className="art_hero_btn">
                    <a
                      className="theme_btn theme_danger"
                      style={{ color: "white" }}
                      onClick={() =>
                        this.props.history.push(routes.EDIT_PROFILE)
                      }
                    >
                      Go To My Account
                    </a>
                    {/* {retestBtn} */}
                  </div>
                </article>
              </div>
            </div>
          </section>
        );
      } else if (
        this.props.user.assessment_status === assessment_status.FAILED
      ) {
        if (currentUTCDateTime >= reTakeTestDate) {
          retestBtn = (
            <a
              className="theme_btn theme_danger"
              style={{ color: "white" }}
              onClick={() => console.log("Retest Clicked")}
            >
              ReTake Test
            </a>
          );
        }
        step = (
          <section className="home_hero homeHeroNew FlexVrCenter home_section_hero_wrapper">
            <div class="container">
              <div class="iNeedHeroWrap">
                <article className="art_hero_text_home take_hero_assessment bg_check_pending bg_check_failed">
                  <h1 className="about-us-hero__title">
                    We are unable to activate your account at this time
                  </h1>
                  <p className="about-us-hero__title">
                    For more information please contact{" "}
                    <a
                      className="text-primary"
                      href="mailto:support@avhero.com"
                      target="_blank"
                    >
                      support@avhero.com
                    </a>
                  </p>
                  <div className="art_hero_btn">
                    {/* <a className="theme_btn theme_danger" style={{ color: 'white' }} onClick={() => this.props.history.push(routes.EDIT_PROFILE)}>Go To My Account</a> */}
                    {/* {retestBtn} */}
                  </div>
                </article>
              </div>
            </div>
          </section>
        );
      } else if (
        this.props.user.assessment_status === assessment_status.REQUESTED
      ) {
        step = (
          <section className="home_hero homeHeroNew FlexVrCenter home_section_hero_wrapper">
            <div class="container">
              <div class="iNeedHeroWrap">
                <article className="art_hero_text_home take_hero_assessment">
                  <h1 className="about-us-hero__title">
                    Thank you for signing up to become an AV HERO!
                  </h1>
                  <p className="about-us-hero__title">
                    Next step is to take the AV HERO Assessment....
                  </p>
                  <div className="art_hero_btn">
                    <a
                      onClick={() =>
                        this.props.history.push(routes.PROFILE_QUESTIONS)
                      }
                      className="theme_btn theme_danger"
                    >
                      LET’S GO!
                    </a>
                  </div>
                </article>
              </div>
            </div>
          </section>
        );
      } else if (
        this.props.user.background_check === background_check.PENDING
      ) {
        step = (
          <section className="home_hero homeHeroNew FlexVrCenter home_section_hero_wrapper">
            <article className="art_hero_text_home take_hero_assessment bg_check_pending">
              <h1 className="about-us-hero__title">
                You are one step closer to becoming an AV HERO!{" "}
              </h1>
              <p className="about-us-hero__title">
                An email with a background check link has been sent to you.{" "}
                <br /> Please complete at your convenience.
              </p>
            </article>
          </section>
        );
      } else if (this.props.user.background_check === background_check.FAILED) {
        step = (
          <section className="home_hero homeHeroNew FlexVrCenter home_section_hero_wrapper">
            <article className="art_hero_text_home take_hero_assessment bg_check_pending bg_check_failed">
              <h1 className="about-us-hero__title">
                We are unable to activate your account at this time
              </h1>
              <p className="about-us-hero__title">
                For more information please contact{" "}
                <a
                  className="text-primary"
                  href="mailto:support@avhero.com"
                  target="_blank"
                >
                  support@avhero.com
                </a>
              </p>
            </article>
          </section>
        );
      } else {
        step = (
          <section className="home_hero homeHeroNew FlexVrCenter home_section_hero_wrapper">
            {/* <div className="container">
              <article className="art_hero_text_home">
                <Oux>
                  <h1 className="about-us-hero__title">
                    AV HERO’s Mission: <br />
                    SAVE THE DAY
                  </h1>
                  <p className="about-us-hero__title">
                    Simple. Fast. Cost-Effective // <br />
                    On-Demand Audio Visual Services{" "}
                  </p>
                </Oux>
                <div className="art_hero_btn">
                  <a
                    className="theme_btn theme_danger font-weight-bold font-italic"
                    onClick={this.navigateToBookingFlow}
                  >
                    I Need a Hero!
                  </a>
                </div>
              </article>
            </div> */}
          </section>
        );
      }
    } else {
      step = (
        <section className="home_hero homeHeroNew FlexVrCenter home_section_hero_wrapper">
          {/*  <div className="container">
            <div className="iNeedHeroWrap">
              <article className="art_hero_text_home">
                <h1 className="about-us-hero__title">
                  AV HERO’s Mission: <br /> SAVE THE DAY
                </h1>
                <p className="about-us-hero__title">
                  On-Demand Audio Visual Services
                  <br /> // Simple. Fast. Cost-Effective.
                </p>
                <div className="art_hero_btn ">
                  <a
                    className="theme_btn theme_danger font-weight-bold font-italic"
                    onClick={this.navigateToBookingFlow}
                  >
                    I Need a Hero!
                  </a>
                </div>
              </article>
            </div>
      </div> */}
        </section>
      );
    }
    return step;
  }
}

const mapStateToProps = (state) => ({
  user: state.authReducer.user,
  isSigningupForBooking: state.authReducer.isSigningupForBooking,
  emailPath: state.authReducer.emailPath,
  bookingData: state.clientOrHeroReducer.bookingData,
  services: state.configReducer.services,
});

const mapStateToDispatch = (dispatch) => ({
  updateIsSigningFromBooking: (enable) => {
    dispatch(actions.updateIsSigningFromBooking(enable));
  },
  getUserProfile: () => dispatch(actions.getUserProfile()),
  updateBookingState: (updateBookingState) =>
    dispatch(actions.updateBookingState(updateBookingState)),
});

export default connect(mapStateToProps, mapStateToDispatch)(withRouter(Home));
