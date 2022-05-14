import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import {
  ClientFilterSections,
  ClientJobStatus,
  routes,
  BookingType,
  themeBlackColor,
  HeroProfilePicPath,
  JobTimeText,
  TransactionHistoryStatus,
  roles,
} from "../../utility/constants/constants";
import {
  convertDurationToString,
  convertUTCToDifferentTZ,
  convertSecondsToDisplayFormatInHrMM,
  toFloatWithDecimal,
  convertDateToDifferentTZ,
  differenceBetweenTwoDatesInMinutes,
  pad,
  getDateOfSpecificTimeZone,
  clientFilterKey,
} from "../../utility/utility";
import Oux from "../../hoc/Oux/Oux";
import { loadJquery } from "../../styles/js/custom";
import CancelResonJobOrBooking from "../../components/AlertComponents/cancelResonJobOrBooking";
import RescheduleBookingOrJob from "../../components/AlertComponents/rescheduleBookingOrJob";
import ContestBooking from "../../components/AlertComponents/contestJob";
import "@emotion/core";
import RingLoader from "react-spinners/RingLoader";
import PulseLoader from "react-spinners/PulseLoader";
import "./ClientDashboard.scss";
import * as actions from "../../redux/actions/index";
import Moment from "react-moment";
import RateAndReview from "../../components/AlertComponents/rateAndReview";
import { showConfirmAlert } from "../../utility/sweetAlerts/sweetAlerts";
import ReactTooltip from "react-tooltip";
import TimeElapsed from "../../components/TimeElapsed/TimeElapsed";
import ViewMiscellaneousCost from "../../components/AlertComponents/viewMiscellaneousCost";
import storage from "../../utility/storage";
import CustomToolTip from "../../components/UI/CustomToolTip/CustomToolTip";

const queryString = require("query-string");
const cloneDeep = require("clone-deep");

class ClientDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: ClientFilterSections.active,
      urlFragment: null,
      isLoading: true,
      updateBookingLoading: false,
      repostBookingLoading: false,
      currentUpdatingBookingId: null,
      jobs: [],
      refreshList: false,
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
        updateBookingLoading: false,
        repostBookingLoading: false,
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
        selectedFilter: ClientFilterSections[filter],
        isLoading: true,
      });
      let apiFilter = clientFilterKey(filter);
      this.props.getClientBookingList(apiFilter);
    }
    if (PrevProps.fetchingBookings && !this.props.fetchingBookings) {
      loadJquery();
    }
    if (!PrevState.refreshList && this.state.refreshList) {
      loadJquery();
      this.setState({ refreshList: false });
    }
  };

  componentDidMount = () => {
    let business_card_booking = storage.get("booking_from_business_card", null);
    if (business_card_booking) {
      storage.remove("booking_from_business_card");
    }
    if (this.props.user) {
      if (
        this.props.emailPath &&
        !this.props.emailPath.includes(routes.DASHBOARD)
      ) {
        this.props.history.push(this.props.emailPath);
      } else {
        let { filter } = queryString.parse(this.props.location.search);
        let allowedFilters = Object.keys(ClientFilterSections);
        if (!allowedFilters.includes(filter)) {
          this.props.history.push(
            routes.DASHBOARD + `?filter=${this.state.selectedFilter.key}`
          );
          let apiFilter = clientFilterKey(this.state.selectedFilter.key);
          this.props.getClientBookingList(apiFilter);
        } else {
          if (filter) {
            this.setState({
              selectedFilter: ClientFilterSections[filter],
            });
          }
          if (!this.props.bookingList || this.props.bookingFilter !== filter) {
            let apiFilter = clientFilterKey(
              filter ? filter : this.state.selectedFilter.key
            );
            this.props.getClientBookingList(apiFilter);
            this.setState({
              isLoading: true,
            });
          } else {
            this.setState({
              isLoading: false,
            });
            loadJquery();
          }
        }
      }
    } else {
      this.props.history.push(routes.LOGIN);
    }
  };

  viewMiscellaneousCostClicked = (booking) => {
    this.props.viewMiscellaneousCostClicked(booking);
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
    let apiFilter = clientFilterKey(filter.key);
    this.props.getClientBookingList(apiFilter);
    this.props.fetchBookingMetrics();
    setTimeout(() => {
      loadJquery();
    }, 2000);
  };

  openCancelPopup = (booking) => {
    this.props.openPopUp(booking);
  };

  rescheduleJobClicked = (booking) => {
    this.props.rescheduleJobClicked(booking);
  };

  rateAndReviewClicked = (booking) => {
    this.props.rateAndReviewClicked(booking);
  };

  acceptRescheduleJob = (id) => {
    this.setState({
      updateBookingLoading: true,
      currentUpdatingBookingId: id,
    });
    this.props.acceptRescheduleJob(id);
  };

  repostJob = (id) => {
    this.setState({
      repostBookingLoading: true,
      currentUpdatingBookingId: id,
    });
    this.props.repostJob(id);
  };

  approveCompletion = (id) => {
    const booking = {
      status: ClientJobStatus.approved.status,
    };

    this.setState({
      updateBookingLoading: true,
      currentUpdatingBookingId: id,
    });
    this.props.updateBooking(id, booking);
  };

  openContestPopup = (booking) => {
    this.props.openContestPopup(booking);
  };

  render() {
    let filters = [];
    let jobsContent = [];
    // let title = this.state.selectedFilter.header;
    Object.keys(ClientFilterSections).forEach((key) => {
      if (key === ClientFilterSections.requested.key) {
        if (
          ClientFilterSections.requested.key === this.state.selectedFilter.key
        ) {
          filters.push(
            <li>
              <a
                className="dashboard_filter pointer_cursor active"
                onClick={() =>
                  this.filterClickHandler(ClientFilterSections[key])
                }
              >
                {ClientFilterSections[key].title}
                {this.props.clientNewItemCount > 0 && (
                  <span class="badge badge-warning theme_badge">
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
                onClick={() =>
                  this.filterClickHandler(ClientFilterSections[key])
                }
              >
                {ClientFilterSections[key].title}
                {this.props.clientNewItemCount > 0 && (
                  <span class="badge badge-warning theme_badge">
                    {this.props.clientNewItemCount}
                  </span>
                )}
              </a>{" "}
            </li>
          );
        }
      } else if (key === ClientFilterSections.accepted.key) {
        if (
          ClientFilterSections.accepted.key === this.state.selectedFilter.key
        ) {
          filters.push(
            <li>
              <a
                className="dashboard_filter pointer_cursor active"
                onClick={() =>
                  this.filterClickHandler(ClientFilterSections[key])
                }
              >
                {ClientFilterSections[key].title}
                {this.props.heroAcceptedCount > 0 && (
                  <span class="badge badge-warning theme_badge">
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
                onClick={() =>
                  this.filterClickHandler(ClientFilterSections[key])
                }
              >
                {ClientFilterSections[key].title}
                {this.props.heroAcceptedCount > 0 && (
                  <span class="badge badge-warning theme_badge">
                    {this.props.heroAcceptedCount}
                  </span>
                )}
              </a>{" "}
            </li>
          );
        }
      } else if (key === ClientFilterSections.active.key) {
        if (
          ClientFilterSections.active.key === this.state.selectedFilter.key
        ) {
          filters.push(
            <li>
              <a
                className="dashboard_filter pointer_cursor active"
                onClick={() =>
                  this.filterClickHandler(ClientFilterSections[key])
                }
              >
                {ClientFilterSections[key].title}
                {this.props.heroOngoingCount > 0 && (
                  <span class="badge badge-warning theme_badge">
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
                onClick={() =>
                  this.filterClickHandler(ClientFilterSections[key])
                }
              >
                {ClientFilterSections[key].title}
                {this.props.heroOngoingCount > 0 && (
                  <span class="badge badge-warning theme_badge">
                    {this.props.heroOngoingCount}
                  </span>
                )}
              </a>{" "}
            </li>
          );
        }
      } else if (key === ClientFilterSections.closed.key) {
        let count = 0
        if(this.props.bookingList && this.props.bookingList.length > 0 && this.props.user && this.props.user.role === roles.client){
          count = this.props.bookingList.filter(booking=>!booking.review && booking.status === ClientFilterSections.closed.api_filter).length
        }
        if (
          ClientFilterSections.closed.key === this.state.selectedFilter.key
        ) {
          filters.push(
            <li>
              <a
                className="dashboard_filter pointer_cursor active"
                onClick={() =>
                  this.filterClickHandler(ClientFilterSections[key])
                }
              >
                {ClientFilterSections[key].title}
                {this.props.clientClosedCount > 0 && (
                  <span class="badge badge-warning theme_badge">
                    {this.props.clientClosedCount}
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
                onClick={() =>
                  this.filterClickHandler(ClientFilterSections[key])
                }
              >
                {ClientFilterSections[key].title}
                {this.props.clientClosedCount > 0 && (
                  <span class="badge badge-warning theme_badge">
                    {this.props.clientClosedCount}
                  </span>
                )}
              </a>{" "}
            </li>
          );
        }
      } else if (key === ClientFilterSections.active.key) {
        if (ClientFilterSections.active.key === this.state.selectedFilter.key) {
          filters.push(
            <li>
              <a
                className="dashboard_filter pointer_cursor active"
                onClick={() =>
                  this.filterClickHandler(ClientFilterSections[key])
                }
              >
                {ClientFilterSections[key].title}
                {this.props.clientActiveItemCount > 0 && (
                  <span class="badge badge-warning theme_badge">
                    {this.props.clientActiveItemCount}
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
                onClick={() =>
                  this.filterClickHandler(ClientFilterSections[key])
                }
              >
                {ClientFilterSections[key].title}
                {this.props.clientActiveItemCount > 0 && (
                  <span class="badge badge-warning theme_badge">
                    {this.props.clientActiveItemCount}
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
              className="dashboard_filter pointer_cursor active"
              onClick={() => this.filterClickHandler(ClientFilterSections[key])}
            >
              {ClientFilterSections[key].title}
            </a>{" "}
          </li>
        );
      } else {
        filters.push(
          <li>
            <a
              className="dashboard_filter pointer_cursor"
              onClick={() => this.filterClickHandler(ClientFilterSections[key])}
            >
              {ClientFilterSections[key].title}
            </a>{" "}
          </li>
        );
      }
    });

    if (this.state.selectedFilter.key === ClientFilterSections.active.key) {
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
            this.state.selectedFilter.key === ClientFilterSections.active.key &&
            aDateTime < bDateTime
          ) {
            return 1;
          } else if (
            this.state.selectedFilter.key === ClientFilterSections.active.key &&
            aDateTime > bDateTime
          ) {
            return -1;
          } else {
            return 0;
          }
        });
      }

      if (this.props.bookingList && this.props.bookingList.length > 0) {
        this.props.bookingList.sort((a, b) => {
          if (a.status === ClientJobStatus.contested.status) {
            return 1;
          } else if (b.status === ClientJobStatus.contested.status) {
            return -1;
          } else if (a.status === ClientJobStatus.completed.status) {
            return 1;
          } else if (b.status === ClientJobStatus.completed.status) {
            return -1;
          } else if (a.status === ClientJobStatus.in_progress.status) {
            return 1;
          } else if (b.status === ClientJobStatus.in_progress.status) {
            return -1;
          } else {
            return 0;
          }
        });
      }

      if (this.props.bookingList && this.props.bookingList.length > 0) {
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
    }

    if (this.props.bookingList) {
      this.props.bookingList.map((booking, index) => {
        jobsContent.push(
          <JobCard
            key={index}
            isAcceptBookingLoading={this.props.isAcceptBookingLoading}
            booking={booking}
            onRefreshList={this.onRefreshList}
            rescheduleJobClicked={this.rescheduleJobClicked}
            // openCancelPopup={this.openCancelPopup}
            acceptRescheduleJob={this.acceptRescheduleJob}
            repostJob={this.repostJob}
            viewMiscellaneousCostClicked={this.viewMiscellaneousCostClicked}
            approveCompletion={this.approveCompletion}
            openContestPopup={this.openContestPopup}
            rateAndReviewClicked={this.rateAndReviewClicked}
            state={this.state}
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
              {/* <img
                style={{ width: "30%" }}
                src={HeroProfilePicPath.FLYING_PNG}
              /> */}
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
              <div className="avh_filter_cont">
                <ul>
                  {/* <li className="filter_label">Filter:</li> */}
                  {filters}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {this.props.isCancelPopupTrue ? <CancelResonJobOrBooking /> : null}
        {this.props.isReschedulePopupTrue ? (
          <RescheduleBookingOrJob selectedFilter={this.state.selectedFilter} />
        ) : null}
        {this.props.isContestPopupTrue ? <ContestBooking /> : null}
        {this.props.isRateAndReviewTrue ? <RateAndReview /> : null}
        {this.props.isViewMiscellaneousPopupTrue ? (
          <ViewMiscellaneousCost />
        ) : null}
        <div class="container-fluid">
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
        {/* <div style={{zIndex: '2'}} id="fixed_hero_button">
                    <button onClick={() => this.props.history.push(routes.SELECT_ISSUES_AND_TIME)} className="theme_btn theme_danger">I Need A Hero</button>
                </div> */}
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.authReducer.user,
  bookingList: state.clientOrHeroReducer.bookingList,
  isAcceptBookingLoading: state.clientOrHeroReducer.isAcceptBookingLoading,
  isCancelPopupTrue: state.clientOrHeroReducer.isCancelPopupTrue,
  isReschedulePopupTrue: state.clientOrHeroReducer.isReschedulePopupTrue,
  updateBookingObject: state.clientOrHeroReducer.updateBookingObject,
  isContestPopupTrue: state.clientOrHeroReducer.isContestPopupTrue,
  isRateAndReviewTrue: state.clientOrHeroReducer.isRateAndReviewTrue,
  bookingFilter: state.clientOrHeroReducer.bookingFilter,
  emailPath: state.authReducer.emailPath,
  isViewMiscellaneousPopupTrue:
    state.clientOrHeroReducer.isViewMiscellaneousPopupTrue,
  clientOpenItemCount: state.clientOrHeroReducer.clientOpenItemCount,
  clientNewItemCount: state.clientOrHeroReducer.clientNewItemCount,
  clientActiveItemCount: state.clientOrHeroReducer.clientActiveItemCount,
  fetchingBookings: state.clientOrHeroReducer.fetchingBookings,
  heroOngoingCount: state.clientOrHeroReducer.heroOngoingCount,
  heroAcceptedCount: state.clientOrHeroReducer.heroAcceptedCount,
  clientClosedCount: state.clientOrHeroReducer.clientClosedCount
});

const mapStateToDispatch = (dispatch) => ({
  // bookingCancelClicked: (id, booking) => dispatch(actions.bookingCancelClicked(id, booking)),
  getClientBookingList: (filter) =>
    dispatch(actions.getClientBookingList(filter)),
  rescheduleJobClicked: (booking) =>
    dispatch(actions.rescheduleJobClicked(booking)),
  openContestPopup: (booking) => dispatch(actions.openContestPopup(booking)),
  repostJob: (id) => dispatch(actions.repostJob(id)),
  openPopUp: (booking) => dispatch(actions.openPopUp(booking)),
  acceptRescheduleJob: (id) => dispatch(actions.acceptRescheduleJob(id)),
  rateAndReviewClicked: (booking) =>
    dispatch(actions.rateAndReviewClicked(booking)),
  updateBooking: (id, booking) => dispatch(actions.updateBooking(id, booking)),
  fetchBookingMetrics: () => dispatch(actions.fetchBookingMetrics()),
  viewMiscellaneousCostClicked: (booking) =>
    dispatch(actions.viewMiscellaneousCostClicked(booking)),
});

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(withRouter(ClientDashboard));

const JobCard = (props) => {
  let booking = cloneDeep(props.booking);

  if (booking) {
    // return bookingList.map(props => {
    let status = booking.status;
    let timezone = booking.address.timezone;
    // let dateTime = convertUTCToDifferentTZ(booking.scheduled_at, timezone)
    // if (booking.category === BookingType.asap.key) {
    let dateTime = convertUTCToDifferentTZ(booking.scheduled_at_utc, timezone);
    let category = booking.category;
    let name = booking.point_of_contact
      ? booking.point_of_contact
      : booking.client.short_name;
    let heroName = booking.provider && booking.provider.short_name;
    let code =
      booking.provider && booking.provider.code
        ? booking.provider.code
        : booking.avhero_code;
    let duration = booking.minutes_worked;
    let phone = booking.provider ? booking.provider.phone : null;
    let address = booking.address.street_address;
    let issues = booking.services.map((service) => service.name);
    let desc = booking.description;

    let statusData = ClientJobStatus[status];
    let title = statusData.title;
    let subtitle = statusData.sub_title;
    console.log(booking);

    let isCancelBookingAllowed = statusData.cancellation_allowed;
    let call_allowed = statusData.call_allowed;

    let additionalContent = null;
    let timer = null;

    let titleContent = (
      <Oux>
        <div class="card-header d_inline">
          <span class="ft_Weight_600 jobCardTitle">{title}</span>
          {/* {!booking.review ? (
            <span
              // href="javascript:void(0)"
              onClick={() => props.rateAndReviewClicked(booking)}
              className="ft_Weight_600 jobCardTitle text-primary rate_hero"
              data-toggle="modal"
              data-target="#review_booking"
            >
              RATE YOUR HERO
            </span>
          ) : null} */}
        </div>
        {/* <div class="card-header ft_Weight_600">{title}</div> */}
        {/* <p className="text-right text-uppercase text-completed font-semi-bold">{title}</p> */}
      </Oux>
    );
    let footerContent = (
      <div class="card-footer">
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
    );

    if (status === ClientJobStatus.created.status) {
    } else if (status === ClientJobStatus.assigned.status) {
    } else if (status === ClientJobStatus.on_the_way.status) {
      // subtitle = `HERO is estimated to reach in ${}`
      let arrivingAt = convertUTCToDifferentTZ(
        booking.arriving_at_utc,
        timezone
      );
      let currentDate = getDateOfSpecificTimeZone(timezone);
      let currentDateWithDiffTZ = convertDateToDifferentTZ(
        currentDate,
        timezone
      );
      let currentTimeInBookingTZ = convertUTCToDifferentTZ(
        currentDateWithDiffTZ,
        timezone
      );
      let differenceInMinutes = differenceBetweenTwoDatesInMinutes(
        currentTimeInBookingTZ,
        arrivingAt
      );
      let arrivingin = `${pad(parseInt(differenceInMinutes), 2)} minutes`;
      subtitle = "wedw";

      if (differenceInMinutes <= 0) {
        arrivingin = 0;
        subtitle = `HERO has arrived!`;
      }
    } else if (status === ClientJobStatus.in_progress.status) {
      timer = (
        <div class="card-header ft_Weight_600 text-uppercase">
          {title}
          <span className="number_font pull-right">
            {/* <p className="text-right text-uppercase font-semi-bold pull-left"> */}
            <TimeElapsed
              startTimerFromZero={false}
              setJobCompletedTime={() => { }}
              booking={booking}
            />
            {/* </p> */}
          </span>
        </div>
      );
    } else if (status === ClientJobStatus.completed.status) {
      const TotalCost = () => {
        if (booking.order) {
          const index = booking.order.order_items.findIndex(
            (m) => m.category === "miscellaneous"
          );
          const mainOrder = booking.order.order_items.find(
            (m) => m.category === "main"
          );
          if (index > -1) {
            let heroFee =
              booking.order.total_with_fee -
              booking.order.order_items[index].unit_price;
            return (
              <div className="avh_total_amnt">
                <div className="avh_total_list_amnt">
                  <h5 className="avh_total_cost_font_size_14">HERO Fee</h5>
                  <h5 className="number_font font-weight-bold avh_total_cost_font_size_14">
                    ${booking.order ? toFloatWithDecimal(heroFee) : ""}
                  </h5>
                </div>
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
                          marginBottom: "2px",
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
                <div className="avh_total_list_amnt">
                  <h4 className="fontS16">Total Amount</h4>
                  <h4 className="number_font font-weight-bold total_amount_received_color fontS16">
                    $
                    {booking.order
                      ? booking.order.total_with_fee.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })
                      : ""}
                  </h4>
                </div>
              </div>
            );
          } else {
            return (
              <div className="avh_total_amnt">
                <div className="avh_total_list_amnt">
                  <h5 className="avh_total_cost_font_size_14">HERO Fee</h5>
                  <h5 className="number_font font-weight-bold avh_total_cost_font_size_14">
                    $
                    {booking.order
                      ? booking.order.total_with_fee.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })
                      : ""}
                  </h5>
                </div>
                <div className="avh_total_list_amnt">
                  <h4 className="fontS16">Total Amount</h4>
                  <h4 className="number_font font-weight-bold total_amount_received_color fontS16">
                    $
                    {booking.order
                      ? booking.order.total_with_fee.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })
                      : ""}
                  </h4>
                </div>
              </div>
            );
          }
        } else {
          return null;
        }
      };

      let diffSeconds = booking.minutes_worked * 60;
      let jobCompletedTime = convertSecondsToDisplayFormatInHrMM(diffSeconds);
      let metaDataContent = booking.metadata && booking.metadata.notes && (
        <div class="makeFlex FlexHrCenter FlexVrCenter">
          <h6 className="font-semi-bold">
            {heroName} worked for: <br />
            {jobCompletedTime} &nbsp;
            <span>
              <a
                className="info_icn m-0"
                data-container="body"
                data-toggle="popover"
                data-placement="top"
                data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
              >
                {booking.metadata.notes &&
                  Object.keys(booking.metadata.notes).length > 0 &&
                  booking.metadata.notes.hero &&
                  booking.metadata.notes.hero.length > 0 ? (
                  <img
                    style={{ width: "12px" }}
                    data-tip={booking.metadata.notes.hero}
                    className="pointer_cursor"
                    data-event="click focus"
                    src="/images/icons/info.svg"
                  />
                ) : null}
              </a>
            </span>
            <ReactTooltip
              watchWindow={true}
              globalEventOff="click"
              data-multiline={true}
              wrapper="span"
              className="tooltip-custom client_dashboard_custom_tooltip"
              html={true}
            />
          </h6>
        </div>
      );
      additionalContent = (
        <Oux>
          {metaDataContent}
          {TotalCost()}
          <div className="btn_group mt-0 btn_group_left">
            <button
              className="theme_btn theme_primary text-uppercase mr-2"
              onClick={() => {
                showConfirmAlert("Approve the Job?", "Please Confirm", () => {
                  props.approveCompletion(booking.id);
                });
              }}
            >
              {props.state.updateBookingLoading &&
                props.booking.id === props.state.currentUpdatingBookingId ? (
                <PulseLoader
                  // css={overrideSpinnerCSS}
                  sizeUnit={"px"}
                  size={5}
                  color={"#ffffff"}
                  loading={props.state.updateBookingLoading}
                />
              ) : (
                "Approve"
              )}
            </button>
            <button
              data-toggle="modal"
              data-target="#alert_six"
              className="theme_btn theme_outline_primary text-uppercase"
              onClick={() => props.openContestPopup(booking)}
            >
              CONTEST
            </button>
          </div>
        </Oux>
      );
    } else if (status === ClientJobStatus.cancelled.status) {
      subtitle = null;
      let category = booking.category.toLowerCase();
      let currentDate = getDateOfSpecificTimeZone(timezone);
      let dateTime = convertUTCToDifferentTZ(
        booking.scheduled_at_utc,
        timezone
      );
      if (
        category === BookingType.asap.key.toLowerCase() ||
        dateTime.getTime() > currentDate.getTime()
      ) {
        footerContent = (
          <div className="card-footer">
            <a
              className="a_tag_to_button text-danger pull-left font-semi-bold text-uppercase"
              onClick={() =>
                showConfirmAlert("Repost Job?", "Please Confirm", () => {
                  props.repostJob(booking.id);
                })
              }
            >
              {props.state.repostBookingLoading &&
                props.booking.id === props.state.currentUpdatingBookingId ? (
                <PulseLoader
                  // css={overrideSpinnerCSS}
                  sizeUnit={"px"}
                  size={5}
                  color={"#eb2329"}
                  loading={props.state.repostBookingLoading}
                />
              ) : (
                "Repost JOB"
              )}
            </a>
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
          </div>
        );
      }
    } else if (status === ClientJobStatus.contested.status) {
    } else if (status === ClientJobStatus.payment_failed.status) {
    } else if (status === ClientJobStatus.closed.status) {
      titleContent = (
        <div class="card-header d_inline">
          <span class="ft_Weight_600 jobCardTitle">{title}</span>
          {!booking.review ? (
            <span
              // href="javascript:void(0)"
              onClick={() => props.rateAndReviewClicked(booking)}
              className="ft_Weight_600 jobCardTitle text-primary rate_hero"
              data-toggle="modal"
              data-target="#review_booking"
            >
              RATE YOUR HERO
            </span>
          ) : null}
        </div>
        // <div class="card-header ft_Weight_600">{title}</div>
        // <h3 className="font-semi-bold text-primary">{title}</h3>
      );
      let orderStatus = booking.order.status;
      if (orderStatus === TransactionHistoryStatus.accounts_receivable.key) {
        titleContent = (
          <div className="card-header ft_Weight_600">
            <span className="d_inline">
            {title}
            {!booking.review ? (
            <span
              // href="javascript:void(0)"
              onClick={() => props.rateAndReviewClicked(booking)}
              className="ft_Weight_600 jobCardTitle text-primary rate_hero"
              data-toggle="modal"
              data-target="#review_booking"
            >
              RATE YOUR HERO
            </span>
          ) : null}
          </span>
            {/* <br />{" "} */}
            <p className="font-bold mt-1" style={{ color: '#ffcc06' }}>
              {TransactionHistoryStatus.accounts_receivable.title}
            </p>
          </div>
          // <h3 className="font-semi-bold text-primary">{title} <br /> <p className="text-danger font-bold mt-1">{TransactionHistoryStatus.payment_failed.title}</p></h3>
        );
      }
      else if (orderStatus !== TransactionHistoryStatus.payment_processed.key) {
        titleContent = (
          <div class="card-header ft_Weight_600">
            {title}{" "}
            <div className="text-danger">
              {TransactionHistoryStatus.payment_failed.title}
            </div>
          </div>
          // <h3 className="font-semi-bold text-primary">{title} <br /> <p className="text-danger font-bold mt-1">{TransactionHistoryStatus.payment_failed.title}</p></h3>
        );
      }
    } else if (status === ClientJobStatus.expired.status) {
    } else if (status === ClientJobStatus.rescheduling.status) {
      let rescheduleTime = convertUTCToDifferentTZ(
        booking.rescheduled_at_utc,
        timezone
      );
      footerContent = (
        <div className="card-footer">
          <a
            className="a_tag_to_button text-danger pull-left font-semi-bold text-uppercase"
            onClick={() =>
              showConfirmAlert("Repost Job?", "Please Confirm", () => {
                props.repostJob(booking.id);
              })
            }
          >
            {props.state.repostBookingLoading &&
              props.booking.id === props.state.currentUpdatingBookingId ? (
              <PulseLoader
                // css={overrideSpinnerCSS}
                sizeUnit={"px"}
                size={5}
                color={"#eb2329"}
                loading={props.state.repostBookingLoading}
              />
            ) : (
              "Repost JOB"
            )}
          </a>
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
        </div>
      );
      if (booking.rescheduled_by_id === booking.provider.id) {
        titleContent = (
          <Oux>
            <div class="card-header ft_Weight_600">
              HERO has requested to reschedule
              {/* <p className="text-right text-uppercase text-yellow font-semi-bold mb-0">HERO has requested to reschedule</p> */}
              <div className="text-uppercase text-yellow">
                <Moment format="MMM D, hh:mm a">{rescheduleTime}</Moment>
              </div>
            </div>
          </Oux>
        );
        additionalContent = (
          <Oux>
            <p className="text-uppercase sm_txt_label">Reschedule REQuEST</p>
            <div className="btn_group btn_group_left">
              <a
                href="javascript:void(0)"
                className="theme_btn theme_primary text-uppercase"
                onClick={() => props.acceptRescheduleJob(booking.id)}
              >
                {props.state.updateBookingLoading &&
                  props.booking.id === props.state.currentUpdatingBookingId ? (
                  <PulseLoader
                    // css={overrideSpinnerCSS}
                    sizeUnit={"px"}
                    size={5}
                    color={"#ffffff"}
                    loading={
                      props.isAcceptBookingLoading
                      // props.state.updateBookingLoading
                    }
                  />
                ) : (
                  "Accept"
                )}
              </a>
              <a
                data-toggle="modal"
                data-target="#alert_one"
                className="theme_btn theme_outline_secondary theme_btn_pad"
                onClick={() => props.rescheduleJobClicked(booking)}
              >
                {props.state.updateBookingLoading &&
                  props.booking.id === props.state.currentUpdatingBookingId ? (
                  <PulseLoader
                    // css={overrideSpinnerCSS}
                    sizeUnit={"px"}
                    size={5}
                    color={"#ffffff"}
                    loading={props.state.updateBookingLoading}
                  />
                ) : (
                  "PROPOSE NEW TIME"
                )}
              </a>
            </div>
          </Oux>
        );
      } else if (booking.rescheduled_by_id === booking.client.id) {
        titleContent = (
          <Oux>
            <div class="card-header ft_Weight_600">
              Job is being rescheduled
              <div className="text-uppercase text-yellow">
                <Moment format="MMM D, hh:mm a">{rescheduleTime}</Moment>
              </div>
            </div>
            {/* <p className="text-right text-uppercase text-yellow font-semi-bold mb-0">Job is being rescheduled</p> */}
            {/* <p className="text-right text-uppercase text-completed font-semi-bold">{title}</p> */}
          </Oux>
        );
        additionalContent = (
          <>
            <p className="text-uppercase sm_txt_label">STATUS</p>
            <a href="javascript:void(0)" className="link_label_btn">
              Waiting for HERO's response
            </a>
          </>
        );
      }
    }

    // for closed status the layout is different from the other states, hence the condition
    if (status === ClientJobStatus.closed.status) {
      let totalCost = null;
      if (booking.order) {
        const index = booking.order.order_items.findIndex(
          (m) => m.category === "miscellaneous"
        );
        const mainOrder = booking.order.order_items.find(
          (m) => m.category === "main"
        );
        if (index > -1) {
          let heroFee =
            booking.order.total_with_fee -
            booking.order.order_items[index].unit_price;
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
                  ${booking.order ? toFloatWithDecimal(heroFee) : ""}
                </h5>
              </div>
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
                        marginBottom: "2px",
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
              <div className="avh_total_list_amnt">
                <h4 className="fontS16">Total Amount</h4>
                <h4 className="number_font font-weight-bold total_amount_received_color fontS16">
                  $
                  {booking.order
                    ? booking.order.total_with_fee.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })
                    : ""}
                </h4>
              </div>
            </div>
          );
        } else {
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
                    ? booking.order.total_with_fee.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })
                    : ""}
                </h5>
              </div>
              <div className="avh_total_list_amnt">
                <h4 className="fontS16">Total Amount</h4>
                <h4 className="number_font font-weight-bold total_amount_received_color fontS16">
                  $
                  {booking.order
                    ? booking.order.total_with_fee.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })
                    : ""}
                </h4>
              </div>
            </div>
          );
        }
      }
      return (
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3">
          <div className="card jobCard avh_card_user_info avh_das_card card_heightEqual">
            {titleContent}
            <div className="card-body">
              {/* <div className="card_body"> */}
              {/* {titleContent} */}
              <h6 className="text-uppercase text-completed font-semi-bold hero_completed_title">
                <span className="text_block">
                  {heroName} has completed the job!
                </span>{" "}
                <a href="javascript:void(0)" className="icn_block">
                  <img
                    style={{ height: "20px" }}
                    src="/images/icons/check-circle-outline.png"
                  />
                </a>
              </h6>
              <ReactTooltip
                watchWindow={true}
                globalEventOff="click"
                data-multiline={true}
                wrapper="span"
                className="tooltip-custom client_dashboard_custom_tooltip"
                html={true}
              />
              <article className="user_info_art">
                <h6 style={{ color: "#DB3732", textTransform: "uppercase" }}>
                  {category}
                </h6>
                <h6 className="font-semi-bold mb-2">
                  JOB: <span className="text-primary">#{booking.id}</span>
                </h6>
                <h6 className="font-semi-bold mb-2">
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
                </h6>
                {booking.metadata.notes &&
                  Object.keys(booking.metadata.notes).length > 0 &&
                  booking.metadata.notes.hero &&
                  booking.metadata.notes.hero.length > 0 ? (
                  booking.metadata.notes &&
                    Object.keys(booking.metadata.notes).length > 0 &&
                    booking.metadata.notes.hero &&
                    booking.metadata.notes.hero.length > 0 ? (
                    <h6 className="font-semi-bold mb-2">
                      Notes{" "}
                      <img
                        // style={{ width: "12px" }}
                        data-tip={booking.metadata.notes.hero}
                        className="toolTipInfoClass pointer_cursor"
                        data-event="click focus"
                        src="/images/icons/info.svg"
                      />
                      {/* <ReactTooltip watchWindow={true} globalEventOff='click' data-multiline={true} wrapper="span"  className='tooltip-custom' html={true} /> */}
                    </h6>
                  ) : null
                ) : null}
                {totalCost}
                <div className="card info_inner_box">
                  <div className="card_body">
                    <div class="avh_address_wrp">
                      <p className="para_clr">{address}</p>
                      {booking.address.description &&
                        booking.address.description.length > 0 ? (
                        <a href="javascript:void(0)" class="info_icn">
                          <img
                            style={{ width: "12px" }}
                            className="toolTipInfoClass pointer_cursor"
                            data-tip={`${booking.address.description}`}
                            data-event="click focus"
                            src="/custom_images/note_icon.svg"
                          />
                        </a>
                      ) : null}
                    </div>
                    {/* <h6>{address}
                                                {
                                                    (booking.address.description && booking.address.description.length > 0)
                                                        ? <img className="toolTipInfoClass pointer_cursor" data-tip={`${booking.address.description}`}
                                                            data-event='click focus' src="/images/icons/info.svg" />
                                                        : null
                                                }
                                            </h6> */}
                    <ReactTooltip
                      watchWindow={true}
                      globalEventOff="click"
                      data-multiline={true}
                      wrapper="span"
                      className="tooltip-custom client_dashboard_custom_tooltip"
                      html={true}
                    />
                    <p className="sm_txt_label mb-0">
                      <small>Point of contact</small>
                    </p>
                    <h6>{booking.client.company_name}</h6>
                    <h6 className="mb-3">{name}</h6>
                    <p className="text-uppercase sm_txt_label">DESCRIPTION</p>
                    <p className="avh_info_dec job_description">{desc}</p>
                    <div class="issues_wrp">
                      <p class="issues_text text-uppercase sm_txt_label">
                        ISSUE(S)
                      </p>
                      <div className="label_link_div">
                        {issues.map((ele) => {
                          return (
                            <a href="#" className="link_label">
                              {ele}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              {/* </div> */}
            </div>
            {/* {!booking.review ? (
              <div className="card-footer text-right">
                <a
                  href="javascript:void(0)"
                  onClick={() => props.rateAndReviewClicked(booking)}
                  className="text-primary font-semi-bold cancel_booking_link"
                  data-toggle="modal"
                  data-target="#review_booking"
                >
                  Rate Your HERO
                </a>
              </div>
            ) : null} */}
          </div>
        </div>
      );
    } else {
      let jobAndAVheroCodeContent = (
        <h6 className="font-semi-bold mb-2">
          JOB:&nbsp;
          <span className="text-primary">#{booking.id}</span>
          {code ? (
            <span>
              | &nbsp;HERO Code:&nbsp;{" "}
              <span className="text-primary">{code}</span>
            </span>
          ) : null}
        </h6>
      );
      if (booking.preferred_provider_id) {
        let code = booking.provider
          ? booking.provider.code
          : booking.avhero_code;
        jobAndAVheroCodeContent = (
          <h6 className="font-semi-bold mb-2">
            JOB:&nbsp;
            <span className="text-primary">#{booking.id}</span>&nbsp;
            {code ? (
              <span>
                | &nbsp;HERO Code:&nbsp;{" "}
                <span className="text-primary">{code}</span>
              </span>
            ) : null}
          </h6>
        );
        if (
          status !== ClientJobStatus.created.status &&
          status !== ClientJobStatus.rescheduling.status
        ) {
          if (
            booking.provider &&
            booking.preferred_provider_id !== booking.provider.id
          ) {
            jobAndAVheroCodeContent = (
              <h6 className="font-semi-bold mb-2">
                JOB:&nbsp;
                <span className="text-primary">#{booking.id}</span>
                {code ? (
                  <span>
                    | &nbsp;HERO Code:&nbsp;{" "}
                    <span className="text-primary">{code}</span>
                  </span>
                ) : null}
              </h6>
            );
          }
        }
      } else if (booking.provider && booking.provider.id) {
        let code = booking.provider
          ? booking.provider.code
          : booking.avhero_code;
        jobAndAVheroCodeContent = (
          <h6 className="font-semi-bold mb-2">
            JOB:&nbsp;
            <span className="text-primary">#{booking.id}</span>&nbsp;
            {code ? (
              <span>
                | &nbsp;HERO Code:&nbsp;{" "}
                <span className="text-primary">{code}</span>
              </span>
            ) : null}
          </h6>
        );
        // if (status !== ClientJobStatus.created.status && status !== ClientJobStatus.rescheduling.status) {
        //     if (booking.provider && booking.preferred_provider_id !== booking.provider.id) {
        //         jobAndAVheroCodeContent = (
        //             <h6 className="font-semi-bold mb-2">JOB:&nbsp;
        //                 <span className="text-primary">#{booking.id}</span>
        //             </h6>
        //         )
        //     }
        // }
      } else if (booking.provider && booking.provider.id) {
        let code = booking.provider
          ? booking.provider.code
          : booking.avhero_code;
        jobAndAVheroCodeContent = (
          <h6 className="font-semi-bold mb-2">
            JOB:&nbsp;
            <span className="text-primary">#{booking.id}</span>&nbsp;
            {code ? (
              <span>
                | &nbsp;HERO Code:&nbsp;{" "}
                <span className="text-primary">{code}</span>
              </span>
            ) : null}
          </h6>
        );
        // if (status !== ClientJobStatus.created.status && status !== ClientJobStatus.rescheduling.status) {
        //     if (booking.provider && booking.preferred_provider_id !== booking.provider.id) {
        //         jobAndAVheroCodeContent = (
        //             <h6 className="font-semi-bold mb-2">JOB:&nbsp;
        //                 <span className="text-primary">#{booking.id}</span>
        //             </h6>
        //         )
        //     }
        // }
      }
      return (
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3">
          <div className="card jobCard avh_card_user_info avh_das_card card_heightEqual">
            {status === ClientJobStatus.in_progress.status
              ? timer
              : titleContent}
            <div className="card-body">
              {/* <div className="card_body"> */}
              <article className="user_info_art">
                {subtitle && (
                  <a href="javascript:void(0)" className="link_label_btn">
                    {subtitle}
                  </a>
                )}
                {jobAndAVheroCodeContent}
                <h6 style={{ color: "#DB3732", textTransform: "uppercase" }}>
                  {category}
                </h6>
                {status === ClientJobStatus.cancelled.status ||
                  status === ClientJobStatus.created.status ||
                  status === ClientJobStatus.expired.status ? null : (
                  <h6>
                    AV HERO: <span className="text-primary">{heroName}</span>
                  </h6>
                )}
                <h3 className="font-semi-bold">
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
                </h3>
                <ReactTooltip
                  watchWindow={true}
                  globalEventOff="click"
                  data-multiline={true}
                  wrapper="span"
                  className="tooltip-custom client_dashboard_custom_tooltip"
                  html={true}
                />
                <h6>{booking.client.company_name}</h6>
                <h6>{name}</h6>
                <div class="avh_address_wrp">
                  <p className="para_clr">{address}</p>
                  {booking.address.description &&
                    booking.address.description.length > 0 ? (
                    <a href="javascript:void(0)" class="info_icn">
                      <img
                        style={{ width: "12px" }}
                        className="toolTipInfoClass pointer_cursor"
                        data-tip={`${booking.address.description}`}
                        data-event="click focus"
                        src="/custom_images/note_icon.svg"
                      />
                    </a>
                  ) : null}
                </div>
                <div style={{ clear: "left" }} />
                {additionalContent}
                <p className="text-uppercase sm_txt_label">DESCRIPTION</p>
                <p className="avh_info_dec job_description">{desc}</p>
                <div class="issues_wrp">
                  <p class="issues_text text-uppercase sm_txt_label">
                    ISSUE(S)
                  </p>
                  <div className="label_link_div">
                    {issues.map((ele) => {
                      return (
                        <a href="javascript:void(0)" className="link_label">
                          {ele}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </article>
              {/* </div> */}
            </div>
            {footerContent}
          </div>
        </div>
      );
    }
  }
};