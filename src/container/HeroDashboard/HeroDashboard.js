import React, { Component, useState, useEffect } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import {
  HeroFilterSections,
  HeroJobStatus,
  hours,
  minutes,
  BookingType,
  themeBlackColor,
  routes,
  HeroProfilePicPath,
  JobTimeText,
  ClientProfilePicPath,
  TransactionHistoryStatus,
} from "../../utility/constants/constants";
import {
  convertDurationToString,
  convertUTCToDifferentTZ,
  convertDateToDifferentTZ,
  differenceBetweenTwoDatesInHours,
  convertSecondsToDisplayFormatInHrMM,
  heroFilterKey,
  toFloatWithDecimal,
} from "../../utility/utility";
import CancelResonJobOrBooking from "../../components/AlertComponents/cancelResonJobOrBooking";
import CompleteJob from "../../components/AlertComponents/CompleteJob";
import RescheduleBookingOrJob from "../../components/AlertComponents/rescheduleBookingOrJob";
import MiscellaneousCost from "../../components/AlertComponents/miscellaneousCost";
import ViewMiscellaneousCost from "../../components/AlertComponents/viewMiscellaneousCost";
import { HeroOnTheWayTime } from "../../utility/constants/constants";
import Oux from "../../hoc/Oux/Oux";
import { Form, Formik, Field } from "formik";
import { loadJquery, updateHeight } from "../../styles/js/custom";
import "@emotion/core";
import PulseLoader from "react-spinners/PulseLoader";
import * as actions from "../../redux/actions/index";
import RingLoader from "react-spinners/RingLoader";
import Moment from "react-moment";
import ReactTooltip from "react-tooltip";
import TimeElapsed from "../../components/TimeElapsed/TimeElapsed";
import storage from "../../utility/storage";
import { showConfirmAlert } from "../../utility/sweetAlerts/sweetAlerts";
import moment from "moment";
import Tbdpopup from "../../components/AlertComponents/tbdAlert";

const queryString = require("query-string");
const cloneDeep = require("clone-deep");

class HeroDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: HeroFilterSections.available,
      urlFragment: null,
      updateJobLoading: false,
      currentUpdatingBookingId: null,
      isLoading: true,
      jobs: [],
      refreshList: false,
      tbdThere : false,
    };
  }

  componentWillMount = () => {
    this.props.fetchBookingMetrics();
  };

  componentDidUpdate = (PrevProps, PrevState) => {
    ReactTooltip.rebuild();
    if (
      this.props.bookingList &&
      this.props.bookingList !== PrevProps.bookingList
    ) {
      this.setState({
        isLoading: false,
        updateJobLoading: false,
        currentUpdatingBookingId: null,
      });
      loadJquery();
    }

    let { filter } = queryString.parse(this.props.location.search);

    if (
      this.state.selectedFilter &&
      filter &&
      this.state.selectedFilter.key !== filter
    ) {
      // this is when navigated on job actions
      this.setState({
        selectedFilter: HeroFilterSections[filter],
        isLoading: true,
      });
      let apiFilter = heroFilterKey(filter);
      this.props.getHeroJobsList(apiFilter);
    }
    if (PrevProps.fetchingBookings && !this.props.fetchingBookings) {
      loadJquery();
    }
    if (!PrevState.refreshList && this.state.refreshList) {
      loadJquery();
      this.setState({ refreshList: false });
    }

    if (
      !this.props.stripeConnectURL &&
      this.props.user &&
      this.props.user.stripe_requirements
    ) {
      this.props.fetchStripeConnectURL();
    }
  };

  componentDidMount = () => {
    console.log();
    this.props.getUserProfile();
    let business_card_booking = storage.get("booking_from_business_card", null);
    if (business_card_booking) {
      storage.remove("booking_from_business_card");
    }
    if (
      this.props.emailPath &&
      !this.props.emailPath.includes(routes.DASHBOARD)
    ) {
      this.props.history.push(this.props.emailPath);
    } else {
      let { filter } = queryString.parse(this.props.location.search);
      let allowedFilters = Object.keys(HeroFilterSections);
      if (!allowedFilters.includes(filter)) {
        this.props.history.push(
          routes.DASHBOARD + `?filter=${this.state.selectedFilter.key}`
        );
        let apiFilter = heroFilterKey(this.state.selectedFilter.key);
        this.props.getHeroJobsList(apiFilter);
      } else {
        if (filter) {
          this.setState({
            selectedFilter: HeroFilterSections[filter],
          });
        }
        if (!this.props.bookingList || this.props.bookingFilter !== filter) {
          let apiFilter = heroFilterKey(
            filter ? filter : this.state.selectedFilter.key
          );
          this.props.getHeroJobsList(apiFilter);
          this.setState({
            isLoading: true,
          });
        } else {
          loadJquery();
          this.setState({
            isLoading: false,
          });
        }
      }
    }
    if (
      !this.props.stripeConnectURL &&
      this.props.user &&
      this.props.user.stripe_requirements
    ) {
      this.props.fetchStripeConnectURL();
    }
  };

  onRefreshList = () => {
    this.setState({ refreshList: true });
  };

  filterClickHandler = (filter) => {
    if (!this.props.history.location.search.includes(filter.key)) {
      this.props.history.push({
        search: `?filter=${filter.key}`,
      });
    }
    this.setState({
      selectedFilter: filter,
      isLoading: true,
    });
    let apiFilter = heroFilterKey(filter.key);
    this.props.getHeroJobsList(apiFilter);
    this.props.fetchBookingMetrics();
  };

  openCancelPopup = (booking) => {
    this.props.openPopUp(booking);
  };
  openTBDpopupFunction = (booking) => {
    this.props.openTbdPopup(booking) 
  };
  acceptJob = (id) => {
    this.setState({
      updateJobLoading: true,
      currentUpdatingBookingId: id,
    });
    this.props.acceptJob(id);
  };

  rescheduleJobClicked = (booking) => {
    this.props.rescheduleJobClicked(booking);
  };

  acceptRescheduleJob = (id) => {
    this.setState({
      updateJobLoading: true,
      currentUpdatingBookingId: id,
    });
    this.props.acceptRescheduleJob(id);
  };

  onMyWay = (id, arriving_in) => {
    const booking = {
      status: HeroJobStatus.on_the_way.status,
      arriving_in: isNaN(arriving_in) ? arriving_in : parseInt(arriving_in),
    };

    this.setState({
      updateJobLoading: true,
      currentUpdatingBookingId: id,
    });
    this.props.updateBooking(id, booking);
  };

  startJob = (id) => {
    const booking = {
      status: HeroJobStatus.in_progress.status,
    };

    this.setState({
      updateJobLoading: true,
      currentUpdatingBookingId: id,
    });
    this.props.updateBooking(id, booking);
  };

  openCompletePopup = (booking, minutes_worked) => {
    this.props.openCompletedPopUp(booking);
    this.setState(
      {
        minutes_worked: minutes_worked,
      },
      () => {
        this.props.openCompletedPopUp(booking);
      }
    );
  };

  miscellaneousCostClicked = (booking) => {
    this.props.miscellaneousCostClicked(booking);
  };

  viewMiscellaneousCostClicked = (booking) => {
    this.props.viewMiscellaneousCostClicked(booking);
  };

  render() {
    let filters = [];
    let jobsContent = [];
    Object.keys(HeroFilterSections).forEach((key) => {
      if (key === HeroFilterSections.available.key) {
        if (
          HeroFilterSections.available.key === this.state.selectedFilter.key
        ) {
          filters.push(
            <li>
              <a
                className="dashboard_filter pointer_cursor active"
                onClick={() => this.filterClickHandler(HeroFilterSections[key])}
              >
                {HeroFilterSections[key].title}
                {this.props.clientNewItemCount > 0 && (
                  <span className="badge badge-warning theme_badge">
                    {this.props.clientNewItemCount}
                  </span>
                )}
              </a>{" "}
            </li>
          );
        } else {
          filters.push(
            <li>
              <a
                className="dashboard_filter pointer_cursor"
                onClick={() => this.filterClickHandler(HeroFilterSections[key])}
              >
                {HeroFilterSections[key].title}
                {this.props.clientNewItemCount > 0 && (
                  <span className="badge badge-warning theme_badge">
                    {this.props.clientNewItemCount}
                  </span>
                )}
              </a>{" "}
            </li>
          );
        }
      } else if (key === HeroFilterSections.active.key) {
        if (
          HeroFilterSections.active.key === this.state.selectedFilter.key
        ) {
          filters.push(
            <li>
              <a
                className="dashboard_filter pointer_cursor active"
                onClick={() => this.filterClickHandler(HeroFilterSections[key])}
              >
                {HeroFilterSections[key].title}
                {this.props.heroOngoingCount > 0 && (
                  <span className="badge badge-warning theme_badge">
                    {this.props.heroOngoingCount}
                  </span>
                )}
              </a>{" "}
            </li>
          );
        } else {
          filters.push(
            <li>
              <a
                className="dashboard_filter pointer_cursor"
                onClick={() => this.filterClickHandler(HeroFilterSections[key])}
              >
                {HeroFilterSections[key].title}
                {this.props.heroOngoingCount > 0 && (
                  <span className="badge badge-warning theme_badge">
                    {this.props.heroOngoingCount}
                  </span>
                )}
              </a>{" "}
            </li>
          );
        }
      } else if (key === HeroFilterSections.accepted.key) {
        if (
          HeroFilterSections.accepted.key === this.state.selectedFilter.key
        ) {
          filters.push(
            <li>
              <a
                className="dashboard_filter pointer_cursor active"
                onClick={() => this.filterClickHandler(HeroFilterSections[key])}
              >
                {HeroFilterSections[key].title}
                {this.props.heroAcceptedCount > 0 && (
                  <span className="badge badge-warning theme_badge">
                    {this.props.heroAcceptedCount}
                  </span>
                )}
              </a>{" "}
            </li>
          );
        } else {
          filters.push(
            <li>
              <a
                className="dashboard_filter pointer_cursor"
                onClick={() => this.filterClickHandler(HeroFilterSections[key])}
              >
                {HeroFilterSections[key].title}
                {this.props.heroAcceptedCount > 0 && (
                  <span className="badge badge-warning theme_badge">
                    {this.props.heroAcceptedCount}
                  </span>
                )}
              </a>{" "}
            </li>
          );
        }
      } else if (key === this.state.selectedFilter.key) {
        filters.push(
          <li>
            <a
              className="dashboard_filter active  pointer_cursor"
              onClick={() => this.filterClickHandler(HeroFilterSections[key])}
            >
              {HeroFilterSections[key].title}
            </a>{" "}
          </li>
        );
      } else {
        filters.push(
          <li>
            <a
              className="dashboard_filter pointer_cursor"
              onClick={() => this.filterClickHandler(HeroFilterSections[key])}
            >
              {HeroFilterSections[key].title}
            </a>{" "}
          </li>
        );
      }
    });

    if (this.props.bookingList && this.props.bookingList.length > 0) {
      this.props.bookingList.sort((a, b) => {
        let aDateTime = convertUTCToDifferentTZ(
          a.updated_at,
          a.address.timezone
        );
        let bDateTime = convertUTCToDifferentTZ(
          b.updated_at,
          b.address.timezone
        );
        if (
          this.state.selectedFilter.key === HeroFilterSections.active.key &&
          aDateTime < bDateTime
        ) {
          return 1;
        } else if (
          this.state.selectedFilter.key === HeroFilterSections.active.key &&
          aDateTime > bDateTime
        ) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    if (
      this.props.bookingList &&
      this.props.bookingList.length > 0 &&
      this.state.selectedFilter.key === HeroFilterSections.active.key
    ) {
      this.props.bookingList.sort((a, b) => {
        if (a.status === HeroJobStatus.contested.status) {
          return 1;
        } else if (b.status === HeroJobStatus.contested.status) {
          return -1;
        } else if (a.status === HeroJobStatus.completed.status) {
          return 1;
        } else if (b.status === HeroJobStatus.completed.status) {
          return -1;
        } else if (a.status === HeroJobStatus.in_progress.status) {
          return 1;
        } else if (b.status === HeroJobStatus.in_progress.status) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    if (
      this.props.bookingList &&
      this.props.bookingList.length > 0 &&
      this.state.selectedFilter.key === HeroFilterSections.active.key
    ) {
      this.props.bookingList.sort((a, b) => {
        if (a.category.toLowerCase() > b.category.toLowerCase()) {
          return 1;
        } else if (a.category.toLowerCase() < b.category.toLowerCase()) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    if (this.props.bookingList && this.props.bookingList.length > 0) {
      this.props.bookingList.map((job, index) => {
        jobsContent.push(
          <JobCard
            key={index}
            booking={job}
            isAcceptBookingLoading={this.props.isAcceptBookingLoading}
            onRefreshList={this.onRefreshList}
            acceptJob={this.acceptJob}
            rescheduleJobClicked={this.rescheduleJobClicked}
            miscellaneousCostClicked={this.miscellaneousCostClicked}
            acceptReschduleJob={this.acceptReschduleJob}
            openCancelPopup={this.openCancelPopup}
            openTBDpopupFunction = {this.openTBDpopupFunction}
            onMyWay={this.onMyWay}
            startJob={this.startJob}
            completeJob={this.openCompletePopup}
            acceptRescheduleJob={this.acceptRescheduleJob}
            viewMiscellaneousCostClicked={this.viewMiscellaneousCostClicked}
            state={this.state}
            {...this.props}
          />
        );
      });
    }
    if (jobsContent.length === 0 && !this.state.isLoading) {
      let noJobsContent = (
        <p className="empty_items_text">{`No ${this.state.selectedFilter.title.toLowerCase()} jobs found. Please check back later! `}</p>
      );
      jobsContent = (
        <div className="empty_dashboard_section">
          <div className="no_jobs_txt">
            <div className="empty_img">
              {/* <img style={{ width: '30%' }} src={HeroProfilePicPath.FLYING_PNG} /> */}
              {noJobsContent}
            </div>
          </div>
        </div>
      );
    }
    
   
    
    return (
      <section className="home_hero">
        <div className="container">
          <div class="sub_head_wrap">
            <div className="mainTitle titleAbslt">
              <h2 className="ft_Weight_600 mb-1">DASHBOARD</h2>
            </div>
          </div>
        </div>
        <div class="container-fluid">
          <div class="row align-items-center">
            <div class="col-lg-12">
              <div
                className={
                  this.props.user.stripe_requirements
                    ? "avh_filter_cont stripe_banner_activated"
                    : "avh_filter_cont"
                }
              >
                <ul>
                  <li className="filter_label"></li>
                  {filters}
                </ul>
              </div>
            </div>
          </div>
          {this.props.openCompletePopup && (
            <CompleteJob minutes_worked={this.state.minutes_worked} />
          )}
          {  <Tbdpopup/> }
          {this.props.isCancelPopupTrue ? <CancelResonJobOrBooking /> : null}
          {this.props.isReschedulePopupTrue ? (
            <RescheduleBookingOrJob
              selectedFilter={this.state.selectedFilter}
            />
          ) : null}
          {this.props.isMiscellaneousPopupTrue ? <MiscellaneousCost /> : null}
          {this.props.isViewMiscellaneousPopupTrue ? (
            <ViewMiscellaneousCost />
          ) : null}
          <div className="container-fluid">
            <div className="row row_H_D">
              {jobsContent}
              {this.state.isLoading && (
                <div className="empty_dashboard_section">
                  <div className="no_jobs_txt">
                    <div className="empty_img">
                      <RingLoader
                        sizeUnit={"px"}
                        size={70}
                        color={themeBlackColor}
                        loading={this.state.isloading}
                      />
                      <h5>Loading...</h5>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.authReducer.user,
  isAcceptBookingLoading: state.clientOrHeroReducer.isAcceptBookingLoading,
  bookingList: state.clientOrHeroReducer.bookingList,
  openCompletePopup: state.clientOrHeroReducer.openCompletePopup,
  isTbdPopup : state.clientOrHeroReducer.isTbdPopup,
  isCancelPopupTrue: state.clientOrHeroReducer.isCancelPopupTrue,
  isReschedulePopupTrue: state.clientOrHeroReducer.isReschedulePopupTrue,
  isMiscellaneousPopupTrue: state.clientOrHeroReducer.isMiscellaneousPopupTrue,
  isViewMiscellaneousPopupTrue:
    state.clientOrHeroReducer.isViewMiscellaneousPopupTrue,
  updateBookingObject: state.clientOrHeroReducer.updateBookingObject,
  emailPath: state.authReducer.emailPath,
  fetchingBookings: state.clientOrHeroReducer.fetchingBookings,
  clientNewItemCount: state.clientOrHeroReducer.clientNewItemCount,
  stripeConnectURL: state.clientOrHeroReducer.stripeConnectURL,
  heroOngoingCount: state.clientOrHeroReducer.heroOngoingCount,
  heroAcceptedCount: state.clientOrHeroReducer.heroAcceptedCount
});

const mapStateToDispatch = (dispatch) => ({
  getHeroJobsList: (filter) => dispatch(actions.getHeroJobsList(filter)),
  openPopUp: (booking) => dispatch(actions.openPopUp(booking)),
  openTbdPopup: (booking) => dispatch(actions.openTbdPopup(booking)),
  openCompletedPopUp: (booking) =>
    dispatch(actions.openCompletedPopUp(booking)),
  acceptJob: (id) => dispatch(actions.acceptJob(id)),
  acceptRescheduleJob: (id) => dispatch(actions.acceptRescheduleJob(id)),
  rescheduleJobClicked: (booking) =>
    dispatch(actions.rescheduleJobClicked(booking)),
  miscellaneousCostClicked: (booking) =>
    dispatch(actions.miscellaneousCostClicked(booking)),
  viewMiscellaneousCostClicked: (booking) =>
    dispatch(actions.viewMiscellaneousCostClicked(booking)),
  fetchBookingMetrics: () => dispatch(actions.fetchBookingMetrics()),
  updateBooking: (id, booking) => dispatch(actions.updateBooking(id, booking)),
  fetchStripeConnectURL: () => dispatch(actions.fetchStripeConnectURL()),
  getUserProfile: () => dispatch(actions.getUserProfile()),
});

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(withRouter(HeroDashboard));

const JobCard = (props) => {
  let booking = cloneDeep(props.booking);
  let [isStopped, setIsStopped] = useState(false);
  // let [isTbdPopupNeeded , setIsTbdPopupNeeded] = useState(false);
  let [
    manuallyUpdateHoursOnCompletion,
    setManuallyUpdateHoursOnCompletion,
  ] = useState(false);
  let [jobCompletedTime, setJobCompletedTime] = useState(0);
  let [isCardHeightUpdated, setIsCardHeightUpdated] = useState(false);
  let [jobStarted, setJobStarted] = useState(false);
  let [isTbdNeeded , setIsNeeded] =useState(false)
  debugger
  useEffect(() => {
    setTimeout(() => {
      props.onRefreshList();
    }, 5000);
  }, [
    isCardHeightUpdated,
    isStopped,
    manuallyUpdateHoursOnCompletion,
    jobStarted,
  ]);
  useEffect(() => {
    debugger
    if(props.booking.tbd && props.booking.tbd == true && isTbdNeeded == false && props.booking.status && props.booking.status.includes('on_the_way') && props.state.updateJobLoading == false){
      setIsNeeded(true);
        window.$("#alert_tbd").modal("toggle");
      }
  },[props.booking.tbd,isTbdNeeded, props.booking.status])
// useEffect(() => {
//   if(booking?.tbd == true){
//     setIsNeeded(true)
//   }
// } , [booking])
  if (booking) {
    // let timeElapsed = uses
    let status = booking.status;
    let timezone = booking.address.timezone;
    let category = booking.category;
    let dateTime = convertUTCToDifferentTZ(booking.scheduled_at_utc, timezone);
    let name = booking.point_of_contact
      ? booking.point_of_contact
      : booking.client.short_name;
    let heroName = booking.hero && booking.hero.name;
    let duration = booking.minutes_worked;
    let phone = booking.phone;
    let address = booking.address.street_address;
    let issues = booking.services.map((service) => service.name);
    let desc = booking.description;
    let requested_by = booking.client.full_name;
    let clientProfilePic = ClientProfilePicPath.FLYING;
    if (
      booking.client.photo_urls &&
      Object.keys(booking.client.photo_urls).length > 0
    ) {
      clientProfilePic = booking.client.photo_urls.medium;
    } else if (booking.client.social_photo_url) {
      clientProfilePic = booking.client.social_photo_url;
    }
    let statusData = HeroJobStatus[status];
    let title = statusData.title;

    if (booking.status === HeroJobStatus.rescheduling.status) {
      if (booking.rescheduled_by_id === booking.provider.id) {
        title = statusData.title;
      } else {
        title = "CLIENT UPDATED JOB TIME";
      }
    }
    
    let subtitle = statusData.sub_title;
    let isCancelBookingAllowed = statusData.cancellation_allowed;
    let call_allowed = statusData.call_allowed;

    let additionalContent = null;
    let actionContent = null;

    if (status === HeroJobStatus.created.status) {
      if (
        booking.preferred_provider_id &&
        props.user.id === booking.preferred_provider_id
      ) {
        //showing this title to only if it matches with the user id
        //if it job is accepted by someone else, we will not show this even though the user requested using AVHERO code.
        title = <p className="">Job is Requested via HERO code</p>;
      }
      if (category.toLowerCase() === BookingType.asap.key.toLowerCase()) {
        actionContent = (
          <Oux>
            <div className="btn_block">
              <button
                className="theme_btn theme_primary btn_w"
                onClick={() => {
                  if (category === BookingType.asap.key.toLowerCase()) {
                    // showConfirmAlert("Accept the ASAP Job?", 'ASAP jobs require an AV HERO to arrive onsite within a two hour timeframe', () => {
                    props.acceptJob(booking.id);
                    // })
                  }
                }}
              >
                {props.state.updateJobLoading &&
                  props.booking.id === props.state.currentUpdatingBookingId ? (
                  <PulseLoader
                    // css={overrideSpinnerCSS}
                    sizeUnit={"px"}
                    size={5}
                    color={"#ffffff"}
                    loading={
                      props.isAcceptBookingLoading
                      // props.state.updateJobLoading
                    }
                  />
                ) : (
                  "Accept"
                )}
              </button>
            </div>
          </Oux>
        );
      } else {
        actionContent = (
          <Oux>
            <div className="btn_block">
              <button
                className="theme_btn theme_primary mr-2"
                onClick={() => {
                  props.acceptJob(booking.id);
                }}
              >
                {props.state.updateJobLoading &&
                  props.booking.id === props.state.currentUpdatingBookingId ? (
                  <PulseLoader
                    // css={overrideSpinnerCSS}
                    sizeUnit={"px"}
                    size={5}
                    color={"#ffffff"}
                    loading={props.state.updateJobLoading}
                  />
                ) : (
                  "Accept"
                )}
              </button>
              <button
                data-toggle="modal"
                data-target="#alert_one"
                className="theme_btn theme_outline_primary"
                onClick={() => {
                  props.rescheduleJobClicked(booking);
                }}
              >
                {props.state.updateJobLoading &&
                  props.booking.id === props.state.currentUpdatingBookingId ? (
                  <PulseLoader
                    // css={overrideSpinnerCSS}
                    sizeUnit={"px"}
                    size={5}
                    color={"#ffffff"}
                    loading={props.state.updateJobLoading}
                  />
                ) : (
                  "Reschedule"
                )}
              </button>
            </div>
          </Oux>
        );
      }
    } else if (status === HeroJobStatus.assigned.status) {
      let currentDate = new Date();
      let jobStartTimeInBookingTZ = dateTime;
      let currentTimeInBookingTZ = convertUTCToDifferentTZ(
        currentDate.toISOString(),
        timezone
      );
      let differenceInHours = differenceBetweenTwoDatesInHours(
        currentTimeInBookingTZ,
        jobStartTimeInBookingTZ
      );
      // less than 2 hours show on the way
      if (differenceInHours < 2) {
        additionalContent = (
          <Oux>
            <p className="text-uppercase sm_txt_label">Please Provide ETA</p>
            <Formik initialValues={{ arriving_in: 15 }}>
              {(formicProps) => {
                return (
                  <Form className="btn_group mt-0 btn_group_left">
                    <div className="select_time_form">
                      <div
                        className="form_group_hrs"
                        style={{ marginBottom: "0px" }}
                      >
                        <Field
                          as="select"
                          className="input_modify number_font cstSelect"
                          name="arriving_in"
                          id="hrs"
                        >
                          {HeroOnTheWayTime.filter(e=> {return props.booking.category == "future" ? e.id != "tbd" : true} ).map((heroTime, i) => {
                            return (
                              <option value={heroTime.id}>
                                {heroTime.name}
                              </option>
                            );
                          })}
                        </Field>
                      </div>
                    </div>

                    <button
                      type="button"
                  // className="a_tag_to_button text-danger pull-right font-semi-bold text-uppercase cancel_booking_link"
                      onClick={() => {
                        props.onMyWay(
                          booking.id,
                          formicProps.values.arriving_in
                        );
                      }
                       
                        // props.openTbdPopup();
                        // props.onMyWay(
                        //   booking.id,
                        //   formicProps.values.arriving_in
                        // );
                      }
                      className="theme_btn theme_primary btn_m125"
                    >
                      {props.state.updateJobLoading &&
                        props.booking.id ===
                        props.state.currentUpdatingBookingId ? (
                        <PulseLoader
                          // css={overrideSpinnerCSS}
                          sizeUnit={"px"}
                          size={5}
                          color={"#ffffff"}
                          loading={props.state.updateJobLoading}
                        />
                      ) : (
                        "Confirm"
                      )}
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </Oux>
        );
      }
    } else if (status === HeroJobStatus.on_the_way.status) {
      let arrivingDate = new Date(props.booking.arriving_at_utc);
      let currentDate = new Date();
      console.log(arrivingDate, "arriving", currentDate, "current");
      let diffTime = moment(arrivingDate).diff(moment(currentDate), "minutes");
      if (diffTime > 0) {
        subtitle = `Please arrive in ${diffTime} minutes`;
      } else {
        subtitle = booking?.tbd ? `Please arrive in TBD minutes` : HeroJobStatus.on_the_way.sub_title;
      }
      additionalContent = (
        <Oux>
          <button
            type="button"
            onClick={() => {
              setJobStarted(true);
              window.isjobStarted = true;
              props.startJob(booking.id);
            }}
            className="theme_btn theme_primary w-100 mb-2"
          >
            {props.state.updateJobLoading &&
              props.booking.id === props.state.currentUpdatingBookingId ? (
              <PulseLoader
                // css={overrideSpinnerCSS}
                sizeUnit={"px"}
                size={5}
                color={"#ffffff"}
                loading={props.state.updateJobLoading}
              />
            ) : (
              "START JOB"
            )}
          </button>
          {/* <a href="" onClick={() => props.startJob(booking.id)} className="theme_btn theme_primary w-100 mb-2">START JOB</a> */}
        </Oux>
      );
    } else if (status === HeroJobStatus.in_progress.status) {
      if (isStopped) {
        const AddMiscellaneous = () => {
          // if (booking.order) {
          const index = booking.order.order_items.findIndex(
            (m) => m.category === "miscellaneous"
          );
          if (index > -1) {
            return (
              <span className="other_des makeFlex FlexHrCenter FlexVrCenter">
                <p className="text-primary fontS13 mb-0 font-semi-bold pull-left">
                  ${booking.order.order_items[index].unit_price} Convenience Fee
                  added.
                </p>
                <p className="text-danger fontS13 mb-0 text-right font-semi-bold">
                  <a
                    className="a_tag_to_button text-danger pull-left ml-2"
                    data-toggle="modal"
                    data-target="#alert_miscellaneous"
                    onClick={() => {
                      props.miscellaneousCostClicked(booking);
                    }}
                  >
                    Edit
                  </a>
                </p>
              </span>
            );
          } else {
            return (
              <span className="other_des makeFlex FlexHrCenter FlexVrCenter">
                <p className="fontS13 mb-0 font-semi-bold pull-left">
                  Add Convenience Fee?
                </p>
                <p className="text-danger fontS13 mb-0 text-right font-semi-bold">
                  <a
                    className="a_tag_to_button text-primary pull-left ml-2"
                    data-toggle="modal"
                    data-target="#alert_miscellaneous"
                    onClick={() => {
                      props.miscellaneousCostClicked(booking);
                    }}
                  >
                    Click here
                  </a>
                </p>
              </span>
            );
          }
        };

        if (manuallyUpdateHoursOnCompletion) {
          let loggedHours = parseInt(jobCompletedTime / 60 / 60);
          loggedHours = loggedHours > 12 ? 12 : loggedHours;
          let loggedMinutes = parseInt(
            (jobCompletedTime - loggedHours * 60 * 60) / 60
          );
          loggedMinutes = loggedMinutes > 45 ? 45 : 0;

          if (loggedHours === 0 && loggedMinutes === 0) {
            loggedHours = 0;
            loggedMinutes = 15;
          }

          additionalContent = (
            <Oux>
              <p className="text-uppercase sm_txt_label">Update time</p>
              <div className="select_time_wrp">
                <Formik
                  initialValues={{ hours: loggedHours, minutes: loggedMinutes }}
                >
                  {(formicProps) => {
                    return (
                      <Oux>
                        <div className="btn_group mt-0 btn_group_left btn_group_select wrp_select_time">
                          <Form className="select_time_form">
                            <div className="form_group_hrs">
                              <Field
                                as="select"
                                className="input_modify number_font cstSelect"
                                name="hours"
                                id="hrs1"
                              >
                                {hours.map((heroTime, i) => {
                                  return (
                                    <option value={heroTime.id}>
                                      {heroTime.name}
                                    </option>
                                  );
                                })}
                              </Field>
                            </div>
                            <div className="form_group_mnt">
                              <Field
                                as="select"
                                className="input_modify number_font cstSelect"
                                name="minutes"
                                id="mins"
                              >
                                {minutes.map((heroTime, i) => {
                                  return (
                                    <option value={heroTime.id}>
                                      {heroTime.name}
                                    </option>
                                  );
                                })}
                              </Field>
                            </div>
                          </Form>
                        </div>
                        <div className="btn_group mt-0 btn_group_left btn_group_select">
                          <button
                            data-toggle="modal"
                            data-target="#alert_eight"
                            onClick={() => {
                              // alert(`${formicProps.values.hours} hrs ${formicProps.values.minutes}`)
                              let minutes_worked =
                                parseInt(formicProps.values.minutes) +
                                parseInt(formicProps.values.hours * 60);
                              props.completeJob(booking, minutes_worked);
                              // showConfirmAlert("Complete the Job?", `Please Confirm ${pad(formicProps.values.hours, 2)} hrs ${pad(formicProps.values.minutes, 2)} mins`, () => {
                              //     let minutes_worked = parseInt(formicProps.values.minutes) + parseInt(formicProps.values.hours * 60);
                              //     ;
                              //     props.completeJob(booking.id, minutes_worked);
                              // })
                            }}
                            className="theme_btn theme_primary btn_m125"
                          >
                            {props.state.updateJobLoading &&
                              props.booking.id ===
                              props.state.currentUpdatingBookingId ? (
                              <PulseLoader
                                sizeUnit={"px"}
                                size={5}
                                color={"#ffffff"}
                                loading={props.state.updateJobLoading}
                              />
                            ) : (
                              "COMPLETE"
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setManuallyUpdateHoursOnCompletion(false);
                            }}
                            className="theme_btn theme_outline_primary btn_m125 ml-2"
                          >
                            CANCEL
                          </button>
                        </div>
                        {AddMiscellaneous()}
                      </Oux>
                    );
                  }}
                </Formik>
              </div>
            </Oux>
          );
        } else {
          additionalContent = (
            <Oux>
              <p className="text-uppercase sm_txt_label">timer</p>
              <p className="theme_btn theme_outline_secondary btn_m125 theme_btn_pad">
                {convertSecondsToDisplayFormatInHrMM(jobCompletedTime)}
              </p>
              <div className="btn_group mt-0 btn_group_left btn_group_select">
                <button
                  data-toggle="modal"
                  data-target="#alert_eight"
                  onClick={() => {
                    let minutes_worked = parseInt(jobCompletedTime / 60);
                    props.completeJob(booking, minutes_worked);
                  }}
                  className="theme_btn theme_primary btn_m125"
                >
                  {props.state.updateJobLoading &&
                    props.booking.id === props.state.currentUpdatingBookingId ? (
                    <PulseLoader
                      sizeUnit={"px"}
                      size={5}
                      color={"#ffffff"}
                      loading={props.state.updateJobLoading}
                    />
                  ) : (
                    "COMPLETE"
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsStopped(false);
                  }}
                  className="theme_btn theme_outline_danger btn_m125 ml-2"
                >
                  CANCEL
                </button>
              </div>
              <span className="other_des makeFlex FlexHrCenter FlexVrCenter">
                <p className="fontS13 mb-0 font-semi-bold pull-left">
                  Manually update hours?
                </p>
                <p className="text-danger fontS13 text-right font-semi-bold pull-left ml-2">
                  <a
                    className="a_tag_to_button  text-primary"
                    onClick={() => {
                      setManuallyUpdateHoursOnCompletion(true);
                    }}
                  >
                    Click here
                  </a>
                </p>
              </span>
              {AddMiscellaneous()}
            </Oux>
          );
          if (!isCardHeightUpdated) {
            updateHeight();
            setIsCardHeightUpdated(true);
          }
        }
      } else {
        //timer running
        additionalContent = (
          <Oux>
            <p className="text-uppercase sm_txt_label">timer</p>
            <div className="btn_group mt-0 btn_group_left">
              <a className="theme_btn theme_outline_secondary btn_m125 theme_btn_pad">
                <TimeElapsed
                  startTimerFromZero={jobStarted}
                  setJobCompletedTime={setJobCompletedTime}
                  booking={booking}
                />
              </a>
              <button
                onClick={() => {
                  setIsStopped(true);
                }}
                className="theme_btn theme_danger btn_m125"
              >
                STOP
              </button>
            </div>
          </Oux>
        );
      }
    } else if (status === HeroJobStatus.completed.status) {
    } else if (status === HeroJobStatus.cancelled.status) {
    } else if (status === HeroJobStatus.contested.status) {
    } else if (status === HeroJobStatus.payment_failed.status) {
    } else if (status === HeroJobStatus.closed.status) {
    } else if (status === HeroJobStatus.expired.status) {
    } else if (status === HeroJobStatus.rescheduling.status) {
      if (booking.rescheduled_by_id === booking.provider.id) {
        let rescheduleTime = convertUTCToDifferentTZ(
          booking.rescheduled_at_utc,
          timezone
        );
        additionalContent = (
          <Oux>
            <p className="text-uppercase sm_txt_label">Proposed TIME</p>
            <a className="theme_btn theme_outline_secondary w-100 mb-2">
              <span className="para_clr font-mediam number_font">
                <Moment format="MMM D, hh:mm a">{rescheduleTime}</Moment>
              </span>
            </a>
            <p className="avh_info_dec text-danger">
              Waiting for client confirmation
            </p>
          </Oux>
        );
      } else {
        let rescheduleTime = convertUTCToDifferentTZ(
          booking.rescheduled_at_utc,
          timezone
        );
        additionalContent = (
          <Oux>
            <p className="text-uppercase sm_txt_label">Proposed TIME</p>
            <a className="theme_btn theme_outline_secondary w-100 mb-2">
              <span className="para_clr font-mediam number_font">
                <Moment format="MMM D, hh:mm a">{rescheduleTime}</Moment>
              </span>
            </a>
            <button
              href="#"
              className="theme_btn theme_primary w-100 mb-2"
              onClick={() => {
                props.acceptRescheduleJob(booking.id);
              }}
            >
              {props.state.updateJobLoading &&
                props.booking.id === props.state.currentUpdatingBookingId ? (
                <PulseLoader
                  // css={overrideSpinnerCSS}
                  sizeUnit={"px"}
                  size={5}
                  color={"#ffffff"}
                  loading={props.state.updateJobLoading}
                />
              ) : (
                "Accept"
              )}
            </button>
            <p className="avh_info_dec text-danger">
              You cannot reschedule this time, please accept or cancel.
            </p>
            {/* <p className="avh_info_dec text-danger">You cannot reschedule the time, please accept or cancel.</p> */}
          </Oux>
        );
      }
    }

    if (status === HeroJobStatus.closed.status) {
      const Miscellaneous = () => {
        if (booking.order) {
          const index = booking.order.order_items.findIndex(
            (m) => m.category === "miscellaneous"
          );
          if (index > -1) {
            return (
              <div className="avh_total_list_amnt">
                <h5 className="fontS16 avh_total_cost_font_size_14">
                  Convenience Fee
                  <a
                    href="javascript:void(0)"
                    style={{
                      width: "20px",
                    }}
                    onClick={() => {
                      props.viewMiscellaneousCostClicked(booking);
                    }}
                    data-toggle="modal"
                    data-target="#info_miscellaneous"
                  >
                    <img
                      style={{ width: "12px", marginBottom: "2px" }}
                      className="ml-1"
                      src="/images/icons/info.svg"
                    />
                  </a>
                </h5>
                <h5 className="number_font font-weight-bold avh_total_cost_font_size_14">
                  $
                  {booking.order
                    ? booking.order.order_items[
                      index
                    ].unit_price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })
                    : ""}
                </h5>
              </div>
            );
          } else {
            return null;
          }
        } else {
          return null;
        }
      };

      const viewMiscellaneousCost = () => {
        if (booking.order) {
          const index = booking.order.order_items.findIndex(
            (m) => m.category === "miscellaneous"
          );
          if (index > -1) {
            return (
              <a
                href="javascript:void(0)"
                style={{ width: "20px" }}
                onClick={() => {
                  props.viewMiscellaneousCostClicked(booking);
                }}
                data-toggle="modal"
                data-target="#info_miscellaneous"
              >
                <img
                  src="/images/icons/info.svg"
                  className="toolTipInfoClass"
                />
              </a>
            );
          } else {
            return null;
          }
        } else {
          return null;
        }
      };
      const mainOrder = booking.order.order_items.find(
        (m) => m.category === "main"
      );
      let orderStatus = booking.order.status;
      //
      let titleContent = (
        <div className="card-header ft_Weight_600">{title}</div>
        // <h3 className="font-semi-bold text-primary">{title}</h3>
      );
      // if (orderStatus === TransactionHistoryStatus.accounts_receivable.key) {
      //   titleContent = (
      //     <div className="card-header ft_Weight_600">
      //       {title}
      //       <br />{" "}
      //       <p className="font-bold mt-1" style={{ color: '#ffcc06' }}>
      //         Payment Processed
      //       </p>
      //     </div>
      //     // <h3 className="font-semi-bold text-primary">{title} <br /> <p className="text-danger font-bold mt-1">{TransactionHistoryStatus.payment_failed.title}</p></h3>
      //   );
      // }
       if (orderStatus !== TransactionHistoryStatus.payment_processed.key && orderStatus !== TransactionHistoryStatus.accounts_receivable.key) {
        titleContent = (
          <div className="card-header ft_Weight_600">
            {title}
            <br />{" "}
            <p className="text-danger font-bold mt-1">
              {TransactionHistoryStatus.payment_failed.title}
            </p>
          </div>
          // <h3 className="font-semi-bold text-primary">{title} <br /> <p className="text-danger font-bold mt-1">{TransactionHistoryStatus.payment_failed.title}</p></h3>
        );
      }
      return (
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3">
          <div className="card jobCard avh_card_user_info avh_das_card card_heightEqual">
            {titleContent}
            <div className="card-body">
              {/* <div className="card_body"> */}
              <article className="user_info_art mt-0">
                <div className="avh_total_job">
                  <h5 className="font-semi-bold">
                    Total approved time: <br />{" "}
                    <span className="number_font">
                      {convertDurationToString(duration)}
                    </span>
                  </h5>
                  <div className="avh_total_amnt">
                    <div className="avh_total_list_amnt">
                      <h5 className="fontS16 avh_total_cost_font_size_14">
                        HERO Fee
                      </h5>
                      <h5 className="number_font font-weight-bold avh_total_cost_font_size_14">
                        $
                        {booking.order
                          ? (
                            mainOrder.unit_price * mainOrder.quantity
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })
                          : ""}
                      </h5>
                    </div>
                    {Miscellaneous()}
                    {/* {viewMiscellaneousCost()} */}
                    <div className="avh_total_list_amnt">
                      <h4 className="fontS16">Total Amount Received</h4>
                      <h4 className="number_font font-weight-bold total_amount_received_color fontS16">
                        $
                        {booking.order
                          ? booking.order.total.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })
                          : ""}
                      </h4>
                    </div>
                    {/* <div className="avh_total_list_amnt">
                                            <h5 className=z"fontS18">Received</h5>
                                        </div> */}
                  </div>
                </div>
                <div className="media avh_media align-items-center">
                  <span
                    style={
                      clientProfilePic
                        ? { backgroundColor: "none" }
                        : { backgroundColor: "#333" }
                    }
                    className="img_circle"
                  >
                    {/* {name.charAt(0)} */}
                    <img
                      className="client_profile_pic_bgcolor"
                      src={clientProfilePic}
                      width="100%"
                    />
                  </span>
                  <div className="media-body">
                    <h5 className="font-semi-bold">
                      JOB: <span className="text-primary">#{booking.id}</span>
                    </h5>
                    {booking.client.client_type ? (
                      <h6 className="font-semi-bold mb-2">
                        Client Type:{" "}
                        <span className="text-primary first_letter_caps">
                          {booking.client.client_type}
                        </span>
                      </h6>
                    ) : null}
                    <h6>{booking.client.company_name}</h6>
                    <p className="para_clr mb-1 avh_con_name">{name}</p>
                    <h6>
                      <span className="text-danger text-uppercase">
                        {category}
                      </span>{" "}
                      - <Moment format="MMM D, h:mma">{dateTime}</Moment>
                      {booking.category.toLowerCase() ===
                        BookingType.asap.key.toLowerCase() ? (
                        <img
                          className="toolTipInfoClass pointer_cursor"
                          style={{ width: "12px", marginLeft: "2px" }}
                          data-tip={JobTimeText.asap}
                          data-event="click focus"
                          src="/images/icons/info.svg"
                        />
                      ) : (
                        <img
                          className="toolTipInfoClass pointer_cursor"
                          data-tip={JobTimeText.future}
                          data-event="click focus"
                          src="/images/icons/info.svg"
                          style={{ width: "12px", marginLeft: "2px" }}
                        />
                      )}
                    </h6>
                    <ReactTooltip
                      globalEventOff="click"
                      className="tooltip-custom client_dashboard_custom_tooltip"
                      html={true}
                    />
                    <div className="avh_address_wrp">
                      <p className="para_clr">{address}</p>
                      {booking.address.description &&
                        booking.address.description.length > 0 ? (
                        <a href="javascript:void(0)" className="info_icn">
                          <img
                            style={{ width: "12px" }}
                            className="toolTipInfoClass pointer_cursor"
                            data-tip={`${booking.address.description}`}
                            data-event="click focus"
                            src="/images/icons/info.svg"
                          />
                        </a>
                      ) : null}
                    </div>
                    <ReactTooltip
                      globalEventOff="click"
                      className="tooltip-custom client_dashboard_custom_tooltip"
                      html={true}
                    />
                    <div style={{ clear: "left" }} />
                  </div>
                </div>
                <div className="issues_wrp">
                  <p className="issues_text text-uppercase sm_txt_label">
                    ISSUE(S)
                  </p>
                  <div className="label_link_div">
                    {issues.map((ele) => {
                      return <a className="link_label">{ele}</a>;
                    })}
                  </div>
                </div>
              </article>
              {/* </div> */}
            </div>
          </div>
        </div>
      );
    } else {
      let totalCost = null;
      if (status === HeroJobStatus.completed.status && booking.order) {
        const index = booking.order.order_items.findIndex(
          (m) => m.category === "miscellaneous"
        );
        const mainOrder = booking.order.order_items.find(
          (m) => m.category === "main"
        );
        totalCost = (
          <div style={{ marginTop: "15px" }} className="avh_total_amnt">
            <div className="avh_total_list_amnt mb-2">
              <h5 className="avh_total_cost_font_size_14 total_amount_received_color font-weight-bold font-semi-bold">
                Job time
              </h5>
              <h5 className="number_font font-weight-bold total_amount_received_color avh_total_cost_font_size_14">
                {convertDurationToString(duration)}
              </h5>
            </div>
            <div className="avh_total_list_amnt">
              <h5 className="avh_total_cost_font_size_14">HERO Fee</h5>
              <h5 className="number_font font-weight-bold avh_total_cost_font_size_14">
                $
                {booking.order
                  ? (
                    mainOrder.unit_price * mainOrder.quantity
                  ).toLocaleString(undefined, { minimumFractionDigits: 2 })
                  : ""}
              </h5>
            </div>
            {index > -1 ? (
              <div className="avh_total_list_amnt">
                <h5 className="avh_total_cost_font_size_14">
                  Convenience Fee
                  <a
                    href="javascript:void(0)"
                    className="ml-1 mb-1"
                    onClick={() => {
                      props.viewMiscellaneousCostClicked(booking);
                    }}
                    data-toggle="modal"
                    data-target="#info_miscellaneous"
                  >
                    <img
                      style={{
                        width: "12px",
                      }}
                      src="/images/icons/info.svg"
                    />
                  </a>
                </h5>
                <h5 className="number_font font-weight-bold avh_total_cost_font_size_14">
                  $
                  {booking.order
                    ? booking.order.order_items[
                      index
                    ].unit_price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })
                    : ""}
                </h5>
              </div>
            ) : null}
            <div className="avh_total_list_amnt">
              <h4 className="fontS16">Total Amount</h4>
              <h4 className="number_font font-weight-bold total_amount_received_color fontS16">
                $
                {booking.order
                  ? booking.order.total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })
                  : ""}
              </h4>
            </div>
          </div>
        );
      }
      return (
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3">
          <div className="card jobCard avh_card_user_info avh_das_card">
            <div className="card_heightEqual">
              <div className="card-header ft_Weight_600">{title}</div>
              <div className="card_body">
                {/* <p style={{ fontSize: '12px' }} className="text-uppercase text-completed font-semi-bold link_label_btn text-right">{title}</p> */}
                <article className="user_info_art mt-0">
                  {subtitle && (
                    <a href="javascript:void(0)" className="link_label_btn">
                      {subtitle}
                    </a>
                  )}
                  <h6 className="ml_70 booking_type_on_job_card">{category}</h6>
                  <h4 className="font-semi-bold ml_70">
                    <Moment format="MMM D, h:mma">{dateTime}</Moment>
                    {booking.category.toLowerCase() ===
                      BookingType.asap.key.toLowerCase() ? (
                      <img
                        className="toolTipInfoClass pointer_cursor"
                        data-tip={JobTimeText.asap}
                        data-event="click focus"
                        src="/images/icons/info.svg"
                      />
                    ) : (
                      <img
                        className="toolTipInfoClass pointer_cursor"
                        data-tip={JobTimeText.future}
                        data-event="click focus"
                        src="/images/icons/info.svg"
                      />
                    )}
                  </h4>
                  <ReactTooltip
                    globalEventOff="click"
                    className="tooltip-custom client_dashboard_custom_tooltip"
                    html={true}
                  />
                  {console.log(booking, "bookinginfo")}
                  <div className="media avh_media">
                    <span
                      style={
                        clientProfilePic
                          ? { backgroundColor: "none" }
                          : { backgroundColor: "#333" }
                      }
                      className="img_circle"
                    >
                      <img
                        className="client_profile_pic_bgcolor"
                        src={clientProfilePic}
                        width="100%"
                      />
                    </span>
                    <div className="media-body">
                      <h6 className="font-semi-bold mb-2">
                        JOB: <span className="text-primary">#{booking.id}</span>
                      </h6>
                      {booking.client.client_type ? (
                        <h6 className="font-semi-bold mb-2">
                          Client Type:{" "}
                          <span className="text-primary first_letter_caps">
                            {booking.client.client_type}
                          </span>
                        </h6>
                      ) : null}
                      <h6>{booking.client.company_name}</h6>
                      <h6>{name}</h6>
                      <div className="avh_address_wrp">
                        <p className="para_clr">{address}</p>
                        {booking.address.description &&
                          booking.address.description.length > 0 ? (
                          <a href="javascript:void(0)" className="info_icn">
                            <img
                              style={{ width: "12px" }}
                              className="toolTipInfoClass pointer_cursor"
                              data-tip={`${booking.address.description}`}
                              data-event="click focus"
                              src="/images/icons/info.svg"
                            />
                          </a>
                        ) : null}
                      </div>
                      <ReactTooltip
                        globalEventOff="click"
                        className="tooltip-custom client_dashboard_custom_tooltip"
                        html={true}
                      />
                      <div style={{ clear: "left" }} />
                    </div>
                  </div>
                  <ReactTooltip
                    globalEventOff="click"
                    className="tooltip-custom client_dashboard_custom_tooltip"
                    html={true}
                  />

                  <p className="text-uppercase sm_txt_label">DESCRIPTION</p>
                  <p className="avh_info_dec job_description">{desc}</p>

                  <div style={{ clear: "left" }}>{totalCost}</div>

                  <div className="issues_wrp">
                    <p className="issues_text text-uppercase sm_txt_label">
                      ISSUE(S)
                    </p>
                    <div className="label_link_div">
                      {issues.map((ele) => {
                        return <a className="link_label text-primary">{ele}</a>;
                      })}
                    </div>
                  </div>
                  {additionalContent}
                </article>
              </div>
            </div>
            <div className="card-footer">
              {isCancelBookingAllowed && (
                <button
                  data-toggle="modal"
                  data-target="#alert_seven"
                  className="a_tag_to_button text-danger pull-right font-semi-bold text-uppercase cancel_booking_link"
                  onClick={() => props.openCancelPopup(booking)}
                >
                  Cancel booking
                </button>
              )}
              {call_allowed && (
                <a
                  href={`tel://${phone}`}
                  className="a_tag_to_button text-danger pull-left font-semi-bold text-uppercase"
                >
                  Call
                </a>
              )}
            </div>

            {actionContent}
          </div>
        </div>
      );
    }
  }
};