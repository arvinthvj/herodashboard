import React, { Component, useState } from 'react';
import Aux from '../Oux/Oux';
import {
  routes,
  roles,
  assessment_status,
  background_check,
  ClientFilterSections,
  SocialLinks,
  HeroProfilePicPath,
  ClientProfilePicPath,
} from '../../utility/constants/constants';
import { withRouter, NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
import storage from '../../utility/storage';
import './Layout.css';
import Avatar from 'react-avatar';
import $ from 'jquery';
import Oux from '../Oux/Oux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Snackbar from '../../components/UI/Snackbar/Snackbar';
import { WPLink, WP_URL } from '../../config';
const Header = props => {
  let isDropDownClicked = false;
  console.log(props);
  //default when user is not logged in

  let pathname = props.history.location.pathname;

  let customerURL = props.token
    ? WPLink.customer + '?token=' + props.token
    : WPLink.customer + '?token=';
  let becomeAVHERO = props.token
    ? WPLink.becomeAnAVHERO + '?token=' + props.token
    : WPLink.becomeAnAVHERO + '?token=';
  let brandPillars = props.token
    ? WPLink.brandPillars + '?token=' + props.token
    : WPLink.brandPillars + '?token=';
  let howitWorks = props.token
    ? WPLink.howItWorks + '?token=' + props.token
    : WPLink.howItWorks + '?token=';
  let news = props.token
    ? WPLink.news + '?token=' + props.token
    : WPLink.news + '?token=';
  let services = props.token
    ? WPLink.services + '?token=' + props.token
    : WPLink.services + '?token=';
  let business = props.token
    ? WPLink.business + '?token=' + props.token
    : WPLink.business + '?token=';
  let residential = props.token
    ? WPLink.residential + '?token=' + props.token
    : WPLink.residential + '?token=';

  let miscItems = (
    <Oux>
      {/* <li className="nav-item">
        <ul className="profile_dropdown">
          <li className="dropdown">
            <a
              className="dropdown-toggle nav-link user_menu_dropdown pointer_cursor"
              data-toggle="dropdown"
              aria-haspopup="true"
              role="button" 
              aria-expanded="false"
            >
              ABOUT{" "}
            </a>
            <ul className="dropdown-menu dropdown-menu-right left_sub_menu">
              <li role="presentation" className="list_item">
                <a className="menuitem" href={customerURL}>
                  {" "}
                  ABOUT – FOR CUSTOMERS
                </a>
              </li>
              <div className="dropdown-divider m-0"></div>
              <li role="presentation" className="list_item">
                <a className="menuitem" href={becomeAVHERO}>
                  {" "}
                  ABOUT – FOR TECHNICIANS
                </a>
              </li>
              <div className="dropdown-divider m-0"></div>
              <li role="presentation" className="list_item">
                <a className="menuitem" href={brandPillars}>
                  {" "}
                  ABOUT – WHY AV HERO?
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </li> */}
      {/* {!props.user ? (
        <Oux>
          <li
            className={
              pathname.includes(routes.HOW_IT_WORKS)
                ? "nav-item active"
                : "nav-item"
            }
          > */}
      {/* <a className="nav-link" href={howitWorks}>
              {" "}
              HOW IT WORKS{" "}
            </a> */}
      {/* </li> */}
      {/* <li className={pathname.includes(routes.COVERAGE) ? "nav-item active" : "nav-item"}>
                            <NavLink className="nav-link" to={routes.COVERAGE}> COVERAGE </NavLink>
                        </li> */}
      {/* </Oux>
      ) : null} */}
      {/* <li className="nav-item">
        <a className="nav-link" href={news}>
          NEWS{" "}
        </a>
      </li> */}
      {/* </ul> */}
    </Oux>
  );

  let headerTabsContent = (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light cst_navbar">
        <a className="navbar-brand pointer_cursor" href={customerURL}>
          <img
            src="/images/background/avhero-logo-yellow.svg"
            alt="Logo"
            width="100%"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navigation-toggler">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </span>
        </button>
        <div className="navbar-collapse collapse" id="navbarNavDropdown">
          {/* <ul className="navbar-nav justify-content-start avh_text_uppercase"> */}
          {/* {miscItems} */}
          {/* </ul> */}
          {[
            routes.ABOUT_BRAND_PILLARS,
            routes.CONTACT,
            routes.ABOUT_CLIENT,
            routes.ABOUT_TECHNICIANS,
            routes.HOW_IT_WORKS,
            routes.COVERAGE,
            routes.HELP,
          ].includes(pathname) && (
              <ul className="navbar-nav need_hero_btn">
                <li className="nav-item">
                  {' '}
                  <NavLink
                    className="nav-link menu_danger_btn text-uppercase -closed headerBtn font-weight-bold font-italic"
                    to={routes.REGISTER}
                  >
                    {' '}
                    I need a hero!{' '}
                  </NavLink>{' '}
                </li>
              </ul>
            )}
          <ul className="navbar-nav justify-content-end">
            {props.user ? (
              <>
                <li
                  className={`${[routes.DASHBOARD].includes(pathname)
                    ? "nav-item active"
                    : "nav-item"
                    }`}
                >
                  {' '}
                  <NavLink
                    className="nav-link"
                    to={`${routes.DASHBOARD}?filter=${props.bookingFilter
                      ? props.bookingFilter
                      : ClientFilterSections.active.key
                      }`}
                  >
                    Dashboard{' '}
                  </NavLink>
                </li>
                <li
                  className={`${[routes.FAVORITES].includes(pathname)
                    ? "nav-item active"
                    : "nav-item"
                    }`}
                >
                  {' '}
                  <NavLink className="nav-link" to={routes.FAVORITES}>
                    {' '}
                    MY HEROES
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className={'nav-item'}>
                  {' '}
                  <a href={howitWorks} className="nav-link">
                    {' '}
                    HOW IT WORKS
                  </a>
                </li>
                <li className={'nav-item'}>
                  {' '}
                  <a className="nav-link" href={services}>
                    {' '}
                    SERVICES
                  </a>
                </li>
                <li className={'nav-item'}>
                  {' '}
                  <a className="nav-link" href={business}>
                    {' '}
                    BUSINESS
                  </a>
                </li>
                <li className={'nav-item'}>
                  {' '}
                  <a className="nav-link" href={residential}>
                    {' '}
                    RESIDENTIAL
                  </a>
                </li>
              </>
            )}
            {/* <li className="nav-item">
              <ul className="profile_dropdown">
                <li className="dropdown">
                  <a
                    className="dropdown-toggle nav-link user_menu_dropdown pointer_cursor"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    role="button"
                    aria-expanded="false"
                  >
                    ABOUT{" "}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-right">
                    <li role="presentation" className="list_item">
                      <a className="menuitem" href={customerURL}>
                        {" "}
                        ABOUT – FOR CUSTOMERS
                      </a>
                    </li>
                    <div className="dropdown-divider m-0"></div>
                    <li role="presentation" className="list_item">
                      <a className="menuitem" href={becomeAVHERO}>
                        {" "}
                        ABOUT – FOR TECHNICIANS
                      </a>
                    </li>
                    <div className="dropdown-divider m-0"></div>
                    <li role="presentation" className="list_item">
                      <a className="menuitem" href={brandPillars}>
                        {" "}
                        ABOUT – WHY AV HERO?
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={news}>
                NEWS{" "}
              </a>
            </li> */}
            <li className="nav-item">
              <NavLink
                to={routes.LOGIN}
                className="nav-link nav_link_outline headerBtn"
              >
                SIGN IN
              </NavLink>
            </li>
            {
              <li className="nav-item">
                {
                  props.history.location.state &&
                    props.history.location.state.signUpAsHero ? <div className="blank_dv"></div> :
                    <NavLink
                      to={{
                        pathname: routes.REGISTER,
                        state: {
                          signUpAsHero: true,
                          signUpAsUser: false,
                        },
                      }}
                      className="nav-link nav_link_bg headerBtn"
                    >
                      BECOME AN AV HERO
                    </NavLink>
                }
              </li>
            }
            {props.user ? (
              <li className="nav-item">
                {' '}
                <NavLink
                  className="nav-link nav_link_bg headerBtn font-weight-bold font-italic"
                  to={routes.REGISTER}
                >
                  {' '}
                  I need a hero!{' '}
                </NavLink>{' '}
              </li>
            ) : null}
            {/* {props.user ? (
              <li className="nav-item menuItemHasChildren">
                <ul className="profile_dropdown">
                  <li className="dropdown">
                    <a
                      href="#"
                      className="dropdown-toggle nav-link user_menu_dropdown"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      role="button"
                      aria-expanded="false"
                    >
                      <span className="user_circle">
                        <img src="images/thumbnails/avatar2.png" alt="User" />
                      </span>
                      <span className="user_pro_txt">John Day</span>
                    </a>

                    <ul className="dropdown-menu dropdown-menu-right">
                      <li role="presentation" className="list_item">
                        <a
                          role="menuitem"
                          tabindex="-1"
                          href="javascript:void (0)"
                        >
                          Manage Account
                        </a>
                      </li>
                      <div className="dropdown-divider m-0"></div>
                      <li role="presentation" className="list_item">
                        <a
                          role="menuitem"
                          tabindex="-1"
                          onClick={props.onLogout}
                          href="javascript:voidI(0)"
                        >
                          Log Out
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            ) : null} */}
          </ul>
        </div>
      </nav>
    </header>
  );

  if (props.user) {
    let profilePhotoSrc =
      props.user.photo_urls && Object.keys(props.user.photo_urls).length > 0
        ? props.user.photo_urls.small
        : props.user.social_photo_url
          ? props.user.social_photo_url
          : null;
    let isPhoneVerified = storage.get("isPhoneVerified", null);

    let isDisabled =
      props.user.role === roles.service_provider &&
      (props.user.assessment_status.toLowerCase() ===
        assessment_status.SUBMITTED.toLowerCase() ||
        props.user.assessment_status.toLowerCase() ===
        assessment_status.FAILED.toLowerCase() ||
        (props.user.background_check &&
          (props.user.background_check.toLowerCase() ===
            background_check.FAILED.toLowerCase() ||
            props.user.background_check.toLowerCase() ===
            background_check.PENDING.toLowerCase())));

    // let isDisabled = props.user.role === roles.service_provider &&
    //     ((props.user.assessment_status.toLowerCase() === assessment_status.SUBMITTED.toLowerCase() || props.user.assessment_status.toLowerCase() === assessment_status.FAILED.toLowerCase()) ||
    //         (!props.user.background_check || props.user.background_check.toLowerCase() === background_check.FAILED.toLowerCase() ||
    //             props.user.background_check.toLowerCase() === background_check.PENDING.toLowerCase()));

    let navigationMenu = null;
    let rightNavDropdownMenu = null;
    let needAHeroBtn = ![
      routes.SELECT_ISSUES_AND_TIME,
      routes.LOCATION_AND_PAYMENT_DETAIL,
      routes.REVIEW_AND_CONFIRM,
      routes.BOOK,
    ].includes(props.history.location.pathname) && (
        <ul className="navbar-nav need_hero_btn">
          <li className="nav-item">
            {" "}
            {/* <NavLink
            className="nav-link menu_danger_btn text-uppercase"
            to={routes.SELECT_ISSUES_AND_TIME}
          >
            {" "}
            I need a hero!{" "}
          </NavLink>{" "} */}
          </li>
        </ul>
      );
    if (
      props.user.role === roles.service_provider &&
      (props.isPhoneVerified || isPhoneVerified)
    ) {
      //navigation menu items when user is logged in as hero but to check whether the user is veified or not & passed the assessment
      if (
        props.user.assessment_status === assessment_status.APPROVED &&
        props.user.background_check &&
        props.user.background_check.toLowerCase() ===
        background_check.APPROVED &&
        !isDisabled
      ) {
        navigationMenu = (
          <ul className="">
            {/* <li
              className={
                pathname.includes(routes.DASHBOARD)
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <NavLink
                className="nav-link"
                to={`${routes.DASHBOARD}?filter=${
                  props.bookingFilter
                    ? props.bookingFilter
                    : ClientFilterSections.active.key
                }`}
              >
                Dashboard{" "}
              </NavLink>
            </li>
            {miscItems} */}
          </ul>
        );
        rightNavDropdownMenu = (
          <Oux>
            <li role="presentation" className="list_item">
              <a
                style={{ color: 'rgb(235 35 41)' }}
                role="menuitem"
                tabIndex="-1"
              >
                HERO code:{' '}
                <span style={{ fontWeight: 'bold' }}>{props.user.code}</span>
                <button
                  onClick={() => props.history.push(routes.BUSINESS_CARD)}
                  type="button"
                  className="btn dropdown_copy_btn theme_btn btn-sm theme_outline_primary ml-2"
                >
                  {/* <img className="normal_icon" src="/custom_images/icn_share_blue.svg" />
                                    <img className="hover_icon" src="/custom_images/icn_share_white.svg" /> */}
                  Share
                </button>
              </a>
            </li>
            <div className="dropdown-divider m-0"></div>
            <li role="presentation" className="list_item">
              <a
                role="menuitem"
                onClick={() => props.history.push(routes.EDIT_PROFILE)}
                tabIndex="-1"
                href="javascript:void (0)"
              >
                Manage Account
              </a>
            </li>
            <div className="dropdown-divider m-0"></div>
            <li role="presentation" className="list_item">
              <a
                onClick={props.onLogout}
                href="javascript:voidI(0)"
                role="menuitem"
                tabIndex="-1"
              >
                Sign Out
              </a>
            </li>
          </Oux>
        );
      } else {
        rightNavDropdownMenu = (
          <li role="presentation" className="list_item">
            <a
              onClick={props.onLogout}
              href="javascript:voidI(0)"
              role="menuitem"
              tabIndex="-1"
            >
              Sign Out
            </a>
          </li>
        );
      }
    } else if (
      props.user.role === roles.client &&
      (props.isPhoneVerified || isPhoneVerified)
    ) {
      //navigation menu items when user is logged in as client but to check whether the user is veified or not
      navigationMenu = (
        <Oux>
          <ul className="">
            {/* <li
              className={
                pathname.includes(routes.DASHBOARD)
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <NavLink
                className="nav-link"
                to={`${routes.DASHBOARD}?filter=${
                  props.bookingFilter
                    ? props.bookingFilter
                    : ClientFilterSections.active.key
                }`}
              >
                Dashboard{" "}
              </NavLink>
            </li>
            <li
              className={
                pathname.includes(routes.FAVORITES)
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <NavLink className="nav-link" to={routes.FAVORITES}>
                {" "}
                MY HEROES
              </NavLink>
            </li>
            {miscItems} */}
          </ul>
          {needAHeroBtn}
        </Oux>
      );
      rightNavDropdownMenu = (
        <Oux>
          <li role="presentation" className="list_item">
            <a
              role="menuitem"
              onClick={() => props.history.push(routes.EDIT_PROFILE)}
              tabIndex="-1"
              href="javascript:void (0)"
            >
              Manage Account
            </a>
          </li>
          <div className="dropdown-divider m-0"></div>
          <li role="presentation" className="list_item">
            <a
              onClick={props.onLogout}
              href="javascript:voidI(0)"
              role="menuitem"
              tabIndex="-1"
            >
              Sign Out
            </a>
          </li>
        </Oux>
      );
    } else if (props.user && !props.isPhoneVerified && !isPhoneVerified) {
      rightNavDropdownMenu = (
        <li role="presentation" className="list_item">
          <a
            onClick={props.onLogout}
            href="javascript:voidI(0)"
            role="menuitem"
            tabIndex="-1"
          >
            Sign Out
          </a>
        </li>
      );
    }

    let rightMenuClass =
      (props.user.role === roles.service_provider &&
        props.user.assessment_status === assessment_status.APPROVED &&
        (props.isPhoneVerified || isPhoneVerified) &&
        props.user.background_check &&
        props.user.background_check.toLowerCase() ===
        background_check.APPROVED) ||
        (props.user.role === roles.client &&
          (props.isPhoneVerified || isPhoneVerified))
        ? "navbar-nav justify-content-end"
        : "navbar-nav justify-content-end left_navbar_onboarding";

    headerTabsContent = (
      <Oux>
        <header style={isDisabled ? { zIndex: '3' } : null}>
          <nav className="navbar navbar-expand-lg navbar-light cst_navbar">
            <a className="navbar-brand pointer_cursor" href={customerURL}>
              <img src="/images/thumbnails/avhero-logo-yellow.svg" alt="Logo" />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="fa fa-bars"></i>
            </button>
            <div className="navbar-collapse collapse" id="navbarNavDropdown">
              {navigationMenu}
              <ul className={rightMenuClass}>
                {props.user ? (
                  <>
                    <li
                      className={`${[routes.DASHBOARD].includes(pathname)
                        ? "nav-item active"
                        : "nav-item"
                        }`}
                    >
                      {' '}
                      <NavLink
                        className="nav-link"
                        to={`${routes.DASHBOARD}?filter=${props.bookingFilter
                          ? props.bookingFilter
                          : ClientFilterSections.active.key
                          }`}
                      >
                        Dashboard{' '}
                      </NavLink>
                    </li>
                    {props.user && props.user.role === roles.client ? (
                      <li
                        className={`${[routes.FAVORITES].includes(pathname)
                          ? "nav-item active"
                          : "nav-item"
                          }`}
                      >
                        {' '}
                        <NavLink className="nav-link" to={routes.FAVORITES}>
                          {' '}
                          MY HEROES
                        </NavLink>
                      </li>
                    ) : null}
                  </>
                ) : null}
                {/* <li className="nav-item">
                  <ul className="profile_dropdown">
                    <li className="dropdown">
                      <a
                        className="dropdown-toggle nav-link user_menu_dropdown pointer_cursor"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        role="button"
                        aria-expanded="false"
                      >
                        ABOUT{" "}
                      </a>
                      <ul className="dropdown-menu dropdown-menu-right">
                        <li role="presentation" className="list_item">
                          <a className="menuitem" href={customerURL}>
                            {" "}
                            ABOUT – FOR CUSTOMERS
                          </a>
                        </li>
                        <div className="dropdown-divider m-0"></div>
                        <li role="presentation" className="list_item">
                          <a className="menuitem" href={becomeAVHERO}>
                            {" "}
                            ABOUT – FOR TECHNICIANS
                          </a>
                        </li>
                        <div className="dropdown-divider m-0"></div>
                        <li role="presentation" className="list_item">
                          <a className="menuitem" href={brandPillars}>
                            {" "}
                            ABOUT – WHY AV HERO?
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href={news}>
                    NEWS{" "}
                  </a>
                </li> */}
                {props.user && props.user.role === roles.client ? (
                  <li className="nav-item">
                    {' '}
                    <NavLink
                      className="nav-link nav_link_bg headerBtn font-weight-bold font-italic"
                      to={routes.SELECT_ISSUES_AND_TIME}
                    >
                      {' '}
                      I need a hero!{' '}
                    </NavLink>{' '}
                  </li>
                ) : null}
                <li className="nav-item">
                  <ul className="profile_dropdown">
                    <li className="dropdown">
                      <a
                        id="my_account_dropdown_btn"
                        href="javascript:void(0)"
                        className="dropdown-toggle nav-link user_menu_dropdown"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        role="button"
                        aria-expanded="false"
                      >
                        <span
                          id="my_account_dropdown_btn"
                          className="user_circle"
                        >
                          {profilePhotoSrc ? (
                            <img
                              id="my_account_dropdown_btn"
                              src={profilePhotoSrc}
                              alt="User"
                            />
                          ) : (
                            <img
                              id="my_account_dropdown_btn"
                              className="client_profile_pic_bgcolor"
                              src={
                                props.user.role === roles.service_provider
                                  ? HeroProfilePicPath.FLYING
                                  : ClientProfilePicPath.FLYING
                              }
                              alt="User"
                            />
                          )}
                        </span>
                        <span
                          id="my_account_dropdown_btn"
                          className="user_pro_txt"
                        >
                          {props.user.first_name} {props.user.last_name}
                        </span>
                      </a>
                      <ul
                        id="my_account_dropdown"
                        className="dropdown-menu dropdown-menu-right"
                      >
                        {rightNavDropdownMenu}
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        {isDisabled &&
          props.user.address &&
          Object.keys(props.user.address).length > 0 &&
          props.user.assessment_status.toLowerCase() !==
          assessment_status.REQUESTED.toLowerCase() ? (
          <div
            className="account_not_active_header sticky_inactive_account theme_danger"
            id="in_active_account_header"
          >
            <p className="content_inactive_account">
              HERO Account Not Yet Activated -{' '}
              <a
                href="javascript:void(0)"
                onClick={() => {
                  props.getUserProfile();
                  props.history.push(routes.HOME);
                }}
                style={{
                  color: '#fff',
                  textDecoration: 'underline',
                  display: 'inline-block',
                }}
              >
                {' '}
                Check Account Status
              </a>
            </p>
          </div>
        ) : null}
        {/* {props.user.role === roles.service_provider &&
        props.user.stripe_requirements &&
        !(
          isDisabled &&
          props.user.address &&
          Object.keys(props.user.address).length > 0 &&
          props.user.assessment_status.toLowerCase() !==
            assessment_status.REQUESTED.toLowerCase()
          ) &&
          (routes.DASHBOARD.includes(props.history.location.pathname) ||
            props.history.location.pathname.includes(routes.PROFILE)) ? (
          <div
            className="account_not_active_header sticky_inactive_account stripe_activation_banner theme_danger"
            id="in_active_account_header"
          >
            <p className="content_inactive_account inactive_stripe_text">
              Your account needs to be verified to activate payouts.{' '}
              <a
                href={props.stripeConnectURL}
                style={{ color: '#000', display: 'inline-block' }}
              >
                {' '}
                Verify Now{' '}
              </a>
            </p>
          </div>
        ) : null} */}
      </Oux>
    );
  }

  return headerTabsContent;
};

const Footer = props => {
  let contact = props.token
    ? WPLink.contact + '?token=' + props.token
    : WPLink.contact + '?token=';
  let help = props.token
    ? WPLink.help + '?token=' + props.token
    : WPLink.help + '?token=';
  let howitWorks = props.token
    ? WPLink.howItWorks + '?token=' + props.token
    : WPLink.howItWorks + '?token=';
  let news = props.token
    ? WPLink.news + '?token=' + props.token
    : WPLink.news + '?token=';
  let services = props.token
    ? WPLink.services + '?token=' + props.token
    : WPLink.services + '?token=';
  let business = props.token
    ? WPLink.business + '?token=' + props.token
    : WPLink.business + '?token=';
  let residential = props.token
    ? WPLink.residential + '?token=' + props.token
    : WPLink.residential + '?token=';
  let partners = props.token
    ? WPLink.partners + '?token=' + props.token
    : WPLink.partners + '?token=';
  let store = props.token
    ? WPLink.store + '?token=' + props.token
    : WPLink.store + '?token=';
  let faq = props.token
    ? WPLink.faq + '?token=' + props.token
    : WPLink.faq + '?token=';

  let privacy = props.token
    ? WPLink.privacy + '?token=' + props.token
    : WPLink.privacy + '?token=';

  let termsOfUse = props.token
    ? WPLink.termsOfUse + '?token=' + props.token
    : WPLink.termsOfUse + '?token=';
  return (
    <footer className={props.className}>
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-lg-5">
            <div className="footerLogoWrapper">
              <a href="#">
                <svg
                  width="341"
                  height="68"
                  viewBox="0 0 341 68"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M57.6 67.2L53.088 55.488H27.552L23.04 67.2H0L29.376 0H51.648L69.4397 40.7L87.1357 0H109.408L81.0076 67.1625L80.9918 67.2H57.6ZM46.848 39.168L40.32 22.272L33.792 39.168H46.848Z"
                    fill="#FECB2F"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M341 0H116.5L88 67H341V0ZM289.964 54.8218C294.066 56.9635 298.691 58.0344 303.84 58.0344C308.989 58.0344 313.614 56.9635 317.716 54.8218C321.817 52.68 325.029 49.7181 327.353 45.9359C329.677 42.1081 330.839 37.8019 330.839 33.0172C330.839 28.2325 329.677 23.949 327.353 20.1668C325.029 16.3391 321.817 13.3543 317.716 11.2126C313.614 9.07086 308.989 8 303.84 8C298.691 8 294.066 9.07086 289.964 11.2126C285.863 13.3543 282.651 16.3391 280.327 20.1668C278.003 23.949 276.841 28.2325 276.841 33.0172C276.841 37.8019 278.003 42.1081 280.327 45.9359C282.651 49.7181 285.863 52.68 289.964 54.8218ZM309.24 43.5435C307.645 44.5005 305.845 44.9789 303.84 44.9789C301.835 44.9789 300.012 44.5005 298.372 43.5435C296.777 42.541 295.501 41.1512 294.544 39.374C293.587 37.5513 293.109 35.4323 293.109 33.0172C293.109 30.602 293.587 28.5059 294.544 26.7287C295.501 24.906 296.777 23.5161 298.372 22.5592C300.012 21.5567 301.835 21.0554 303.84 21.0554C305.845 21.0554 307.645 21.5567 309.24 22.5592C310.88 23.5161 312.179 24.906 313.136 26.7287C314.093 28.5059 314.571 30.602 314.571 33.0172C314.571 35.4323 314.093 37.5513 313.136 39.374C312.179 41.1512 310.88 42.541 309.24 43.5435ZM174.06 56.9407V9.09365H157.928V26.0452H143.027V9.09365H126.896V56.9407H143.027V39.3056H157.928V56.9407H174.06ZM221.614 56.9407V44.7739H197.69V38.4854H217.922V26.8654H197.69V21.2605H220.725V9.09365H181.832V56.9407H221.614ZM248.329 44.9106H243.955V56.9407H227.824V9.09365H250.858C255.279 9.09365 259.129 9.82274 262.41 11.2809C265.691 12.7391 268.22 14.8353 269.997 17.5694C271.774 20.3035 272.663 23.4933 272.663 27.1388C272.663 30.5565 271.888 33.5412 270.339 36.0931C268.79 38.6449 266.557 40.6727 263.64 42.1765L273.688 56.9407H256.463L248.329 44.9106ZM256.395 27.1388C256.395 25.3616 255.848 23.9946 254.755 23.0376C253.661 22.0351 252.02 21.5339 249.833 21.5339H243.955V32.7438H249.833C252.02 32.7438 253.661 32.2653 254.755 31.3084C255.848 30.3058 256.395 28.916 256.395 27.1388Z"
                    fill="#FECB2F"
                  ></path>
                </svg>
              </a>
            </div>
            <div className="copyTxtWrapper">
              <div className="avh_copy_txt">
                ©{' '}
                <span className="number_font">{new Date().getFullYear()}</span>{' '}
                AV HERO. All rights reserved
              </div>
              <a href={privacy}>Privacy Policy</a>{' '}
              <span className="sepratorLink">|</span>{' '}
              <a href={termsOfUse}>Terms Of Use</a>
            </div>
          </div>
          <div className="col-md-8 col-lg-7">
            <div className="row">
              <div className="col-sm-4 col-md-4">
                <div className="footer_list_group footerListBtns">
                  <a href={business} className="footer_link">
                    {' '}
                    BUSINESS
                  </a>
                  <a href={residential} className="footer_link">
                    RESIDENTIAL
                  </a>
                  <a href={partners} className="footer_link">
                    PARTNERS
                  </a>
                  {props.user ? (
                    <>
                      <a href={howitWorks} className="footer_link">
                        HOW IT WORKS
                      </a>
                    </>
                  ) : null}
                  <a href={services} className="footer_link">
                    SERVICES
                  </a>
                </div>
              </div>
              <div className="col-sm-3 col-md-3">
                <div className="footer_list_group">
                  <a href={news} className="footer_link">
                    {' '}
                    NEWS
                  </a>
                  <a href={store} className="footer_link">
                    STORE
                  </a>
                  <a href={faq} className="footer_link">
                    FAQ
                  </a>
                  <a href={contact} className="footer_link">
                    CONTACT
                  </a>
                </div>
              </div>
              <div className="col-sm-5 col-md-5">
                <div className="footer_list_group footerListBtns">
                  {props.user && props.user.role === roles.client ? (
                    <NavLink
                      className="footer_link linkOutLineYellow headerBtn font-weight-bold"
                      to={routes.SELECT_ISSUES_AND_TIME}
                    >
                      {' '}
                      I NEED A HERO{' '}
                    </NavLink>
                  ) : null}
                  {!props.user ? (
                    <>
                      <NavLink
                        className="footer_link linkOutLineYellow headerBtn font-weight-bold"
                        to={routes.SELECT_ISSUES_AND_TIME}
                      >
                        {' '}
                        I NEED A HERO{' '}
                      </NavLink>
                      <NavLink
                        to={{
                          pathname: routes.REGISTER,
                          state: {
                            signUpAsHero: true,
                            signUpAsUser: false,
                          },
                        }}
                        className="footer_link linkOutLineYellow"
                      >
                        BECOME AN AV HERO
                      </NavLink>
                    </>
                  ) : null}
                  {!props.user ? (
                    <NavLink
                      to={routes.LOGIN}
                      className="footer_link linkOutLineYellow"
                    >
                      SIGN IN
                    </NavLink>
                  ) : null}
                  <div className="social_links">
                    <a href={SocialLinks.fb}>
                      <img
                        src="/images/icons/icn_white_fb.svg"
                        alt="Facebook"
                      />{' '}
                    </a>
                    <a href={SocialLinks.linkedin}>
                      <img
                        src="/images/icons/icn_white_linkedin.svg"
                        alt="Linkedin"
                      />{' '}
                    </a>
                    <a href={SocialLinks.twitter}>
                      <img
                        src="/images/icons/icn_white_twitter.svg"
                        alt="Twitter"
                      />{' '}
                    </a>
                    <a href={SocialLinks.youtube}>
                      <img
                        src="/images/icons/icn_youtube_white.svg"
                        alt="Youtube"
                      />{' '}
                    </a>
                    <a href={SocialLinks.instagram}>
                      <img
                        src="/images/icons/icn_instagram.svg"
                        className="icn_instagram"
                        alt="Instagram"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-sm-12">
            <div className="footer_list_group">
              <div className="avh_copy_txt footer_link">
                {" "}
                ©{" "}
                <span className="number_font">
                  {new Date().getFullYear()}
                </span>{" "}
                AV HERO
              </div>
              <a href={contact} className="footer_link">
                {" "}
                Contact Us
              </a>
              {props.user ? (
                <Oux>
                  <a href={help} className="footer_link">
                    Help
                  </a>
                  <a href={howitWorks} className="footer_link">
                    How It Works
                  </a>
                </Oux>
              ) : (
                <a href={help} className="footer_link">
                  Help
                </a>
              )}
              <a
                href={routes.TERMS_OF_USE}
                target="_blank"
                className="normal_terms_and_privacy footer_link"
              >
                Terms of Use
              </a>
              <a
                href={routes.PRIVACY_POLICY}
                target="_blank"
                className="normal_terms_and_privacy footer_link"
              >
                Privacy Policy
              </a>
              <a
                href="/custom_docs/UserAgreement/AV_Hero_Terms_of_Use.pdf"
                target="_blank"
                className="mobile_terms_and_privacy footer_link"
              >
                Terms of Use
              </a>
              <a
                href="/custom_docs/PrivacyPolicy/AV_Hero_Privacy_Policy.pdf"
                target="_blank"
                className="mobile_terms_and_privacy footer_link"
              >
                Privacy Policy
              </a>
              <div className="social_links footer_link">
                <a href={SocialLinks.fb} target="_blank">
                  <img src="/images/icons/icn_white_fb.svg" alt="Facebook" />{" "}
                </a>
                <a href={SocialLinks.linkedin} target="_blank">
                  <img
                    src="/images/icons/icn_white_linkedin.svg"
                    alt="Linkedin"
                  />{" "}
                </a>
                <a href={SocialLinks.instagram} target="_blank">
                  <img
                    src="/images/icons/icn_instagram.svg"
                    className="icn_instagram"
                    alt="Twitter"
                  />{" "}
                </a>
                <a href={SocialLinks.youtube} target="_blank">
                  <img
                    src="/images/icons/icn_youtube_white.svg"
                    className="icn_you_tube"
                    alt="Youtube"
                  />{" "}
                </a>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

class Layout extends Component {
  render() {
    let footerClass = 'home_footer';
    let footer = <Footer className={footerClass} {...this.props} />;
    let header = <Header {...this.props} />;
    let isDisabled = false
    let isPayoutVerificationBannerEnabled = false
    if (
      [routes.PRIVACY_POLICY, routes.TERMS_OF_USE].includes(
        this.props.history.location.pathname,
      )
    ) {
      header = null;
      footer = null;
    }
    if (this.props.user) {
      //   isDisabled =
      //   this.props.user.role === roles.service_provider &&
      //   (this.props.user.assessment_status.toLowerCase() ===
      //     assessment_status.SUBMITTED.toLowerCase() ||
      //     this.props.user.assessment_status.toLowerCase() ===
      //       assessment_status.FAILED.toLowerCase() ||
      //     (this.props.user.background_check &&
      //       (this.props.user.background_check.toLowerCase() ===
      //         background_check.FAILED.toLowerCase() ||
      //         this.props.user.background_check.toLowerCase() ===
      //           background_check.PENDING.toLowerCase())));
      // isPayoutVerificationBannerEnabled =
      //   this.props.user.role === roles.service_provider &&
      //   this.props.user.stripe_requirements &&
      //   !(
      //     isDisabled &&
      //     this.props.user.address &&
      //     Object.keys(this.props.user.address).length > 0 &&
      //     this.props.user.assessment_status.toLowerCase() !==
      //       assessment_status.REQUESTED.toLowerCase()
      //   ) &&
      //   (routes.DASHBOARD.includes(this.props.history.location.pathname) ||
      //     this.props.history.location.pathname.includes(routes.PROFILE));
      if (
        [
          routes.SELECT_ISSUES_AND_TIME,
          routes.LOCATION_AND_PAYMENT_DETAIL,
          routes.REVIEW_AND_CONFIRM,
        ].includes(this.props.history.location.pathname)
      ) {
        return (
          <div className="limiter">
            <div className="container-login100">
              {header}
              <div
                className={
                  !isPayoutVerificationBannerEnabled
                    ? 'content_wrapper'
                    : 'content_wrapper verification_banner_enabled'
                }
              >
                {this.props.children}
              </div>
              {footer}
            </div>
          </div>
        );
      } else if (
        [routes.VERIFY_OTP, routes.ADDITIONAL_INFORMATION].includes(
          this.props.history.location.pathname,
        )
      ) {
        return (
          <div id="wrap">
            <div className="limiter">
              <div className="container-login100">
                <Aux>
                  {header}
                  <div
                    className={
                      !isPayoutVerificationBannerEnabled
                        ? 'content_wrapper'
                        : 'content_wrapper verification_banner_enabled'
                    }
                  >
                    {this.props.children}
                  </div>
                  {footer}
                </Aux>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <Aux>
            <div id="wrap">
              <div className={"limiter"}>
                <div className={"container-login100"}>
                  <Aux>
                    {header}
                    <div
                      className={
                        !header ? 'w-100' :
                          !isPayoutVerificationBannerEnabled
                            ? 'content_wrapper'
                            : 'content_wrapper verification_banner_enabled'
                      }
                    >
                      {this.props.children}
                    </div>
                    {footer}
                  </Aux>
                </div>
              </div>
            </div>
          </Aux>
        );
      }
    } else {
      return (
        <div className={"limiter"}>
          <div className={"container-login100"}>
            <Aux>
              {header}
              <div
                className={
                  !header ? 'w-100' :
                    !isPayoutVerificationBannerEnabled
                      ? 'content_wrapper'
                      : 'content_wrapper verification_banner_enabled'
                }
              >
                {this.props.children}
              </div>
              {footer}
            </Aux>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    user: state.authReducer.user,
    token: state.authReducer.token,
    isPhoneVerified: state.authReducer.isPhoneVerified,
    bookingFilter: state.clientOrHeroReducer.bookingFilter,
    stripeConnectURL: state.clientOrHeroReducer.stripeConnectURL,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actions.logout),
    getUserProfile: () => dispatch(actions.getUserProfile()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout));
