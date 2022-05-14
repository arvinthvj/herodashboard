import React from 'react';
import AppRouter from './router/router';
import { removeConsoleLog } from './utility/utility';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import RouteChangeListener from './utility/RouteChangeListener';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import * as actions from './redux/actions';
import Oux from './hoc/Oux/Oux';
import { gaCapturePageView, FBPixelCapturePageView } from './analytics/Analytics';
import { routes, HeroFilterSections } from './utility/constants/constants';
import $ from 'jquery'

const queryString = require('query-string');
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  loadJquery = () => {
    $(document).ready(function () {
      $(document).click(function (event) {
        var clickover = $(event.target);
        var _opened = $(".navbar-collapse").hasClass("navbar-collapse collapse show");
        if (_opened === true && !clickover.hasClass("navbar-toggler")) {
          if (!$(".dropdown").hasClass("dropdown show")) {
            $("button.navbar-toggler").click();
          }
        }
      });
    });
  }

  componentWillMount = () => {
    if (process.env.REACT_APP_ENV === 'production') {
      removeConsoleLog();
    }
    this.loadAnaylticsPageView();
    this.props.addHistory(this.props.history);
  }

  loadAnaylticsPageView = () => {
    FBPixelCapturePageView(); 					// For tracking page view
    gaCapturePageView()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      // const presentRoute = this.props.location.pathname;
      const futureRoute = nextProps.location.pathname;
      if (futureRoute === routes.SELECT_ISSUES_AND_TIME ||
        futureRoute === routes.LOCATION_AND_PAYMENT_DETAIL ||
        futureRoute === routes.REVIEW_AND_CONFIRM) {
        this.props.isBlocking(false);
      }
    }
  }

  componentDidMount = () => {
    this.props.history.listen(() => {
      window.scroll(0, 0);
      this.loadAnaylticsPageView();
    });

    this.loadJquery();

    this.props.fetchConfig()
    setTimeout(() => {
      this.props.fetchConfig()
    }, [4000])
    if (!this.props.user && !this.props.emailPath) {
      let path = this.props.location.pathname
      if (path.includes(routes.DASHBOARD)) {

        let { filter } = queryString.parse(this.props.location.search);
        if (filter) {
          this.props.history.push(routes.LOGIN)
          this.props.setEmailPath(path + "?filter=" + filter)
        }
        else {
          this.props.history.push(routes.LOGIN)
          this.props.setEmailPath(path + "?filter=" + HeroFilterSections.active.key)
        }
      }
      else if (path === routes.BOOK) {
        this.props.history.push(routes.LOGIN)
        this.props.setEmailPath(path)
      }
    }
    if (this.props.user) {
      this.props.getUserProfile();
    }
  }

  componentDidUpdate = () => {
    this.loadJquery();
  }

  render() {
    return (
      <Oux>
        <RouteChangeListener />
        <ReactNotification />
        <AppRouter {...this.props} />
      </Oux>
    );
  }
}


const mapStateToProps = (state) => ({
  user: state.authReducer.user,
  isPhoneVerified: state.authReducer.isPhoneVerified,
  isLoading: state.authReducer.isLoading,
  bookingData: state.clientOrHeroReducer.bookingData,
  bookingCreated: state.clientOrHeroReducer.bookingCreated,
  emailPath: state.authReducer.emailPath
});

const mapStateToDispatch = (dispatch) => {
  return {
    fetchConfig: () => dispatch(actions.config()),
    addHistory: (history) => dispatch(actions.addHistory(history)),
    isBlocking: (value) => dispatch(actions.isBlocking(value)),
    resetPassword: (credentials) => dispatch(actions.resetPassword(credentials)),
    setEmailPath: (path) => dispatch(actions.setEmailPath(path)),
    getUserProfile: () => dispatch(actions.getUserProfile()),
  }
};

export default connect(mapStateToProps, mapStateToDispatch)(withRouter(App));
