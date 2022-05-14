import React, { Component } from "react";
import HeroProfileForm from "../../components/Profile/HeroProfileForm/HeroProfileMenu";
import EditProfile from "../../components/Profile/EditProfile/EditProfile";
import ChangePassword from "../../components/Profile/ChangePassword/ChangePassword";
import Account from "../../components/Profile/HeroProfileForm/Account/Account";
import {
  routes,
  assessment_status,
  roles,
  background_check,
} from "../../utility/constants/constants";
import { Route, Redirect, Switch } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../redux/actions/index";
import getDetailAddress from "../../utility/getDetailAddress";
import { toastMsg, resetOrientation } from "../../utility/utility";
import { linkBankAccount } from "../../api/bookingAPI";
import qs from "query-string";
import storage from "../../utility/storage";
import { decode, encode } from "base64-arraybuffer";
import Oux from "../../hoc/Oux/Oux";
import imageCompression from "browser-image-compression";
import Payouts from "../../components/Profile/HeroProfileForm/Payouts/Payouts";
import BusinessCard from "../../components/Profile/HeroProfileForm/BusinessCard/BusinessCard";

class HeroProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address_attributes: null,
      file: null,
      image: null,
      isLoading: false,
    };
    this.handleAddressSelect = this.handleAddressSelect.bind(this);
    this.handleOnSuccess = this.handleOnSuccess.bind(this);
    this.handleOnExit = this.handleOnExit.bind(this);
    this.onImageUpload = this.onImageUpload.bind(this);
  }

  componentDidMount() {
    let currentUrl = `${this.props.history.location.pathname}`;
    if (currentUrl === routes.PROFILE) {
      this.props.history.push(routes.EDIT_PROFILE);
    }
    if (this.props.user && this.props.user.address_attributes) {
      this.setState({
        address_attributes: this.props.user.address_attributes,
      });
    }
    this.props.getHeroProfile();
  }

  async handleAddressSelect(address, onChange, name) {
    const addressFields = await getDetailAddress(address);
    this.setState({
      address_attributes: addressFields,
    });
    if (onChange && name) {
      onChange(name, addressFields.street_address);
      onChange("address_attributes[city]", this.state.address_attributes.city);
      onChange(
        "address_attributes[state]",
        this.state.address_attributes.state
      );
      onChange("address_attributes[zip]", this.state.address_attributes.zip);
      onChange(
        "address_attributes[latitude]",
        this.state.address_attributes.latitude
      );
      onChange(
        "address_attributes[longitude]",
        this.state.address_attributes.longitude
      );
    }
  }

  resetAddressAttributesState = () => {
    this.setState({ address_attributes: null });
  };

  async onImageUpload(e) {
    let reader = new FileReader();
    let file = e && e.target ? e.target.files[0] : e[0];
    let type = file.type;
    let extension = file.name.split(".").pop().toLowerCase();

    const orientation = await imageCompression.getExifOrientation(file);
    if (["image/png", "image/jpeg", "image/jpg"].includes(type)) {
      reader.onloadend = () => {
        resetOrientation(reader.result, orientation, this, extension);

        console.log(reader.result);
        this.setState({
          // image: reader.result,
          file: file,
        });

        // image = reader.result.split(',');
        // if (reader && reader.result) {
        //     this.props.profilePhotoUpload(extension, decode(image[1]))
        // }
        // else {
        //     this.props.profilePhotoUpload(extension)
        // }
      };
      reader.readAsDataURL(file);
    } else {
      toastMsg("Please upload a valid image file!", true);
    }
  }

  handleOnSuccess(token, metadata) {
    console.log(token);
    console.log(metadata);
    this.setState({
      isLoading: true,
    });

    linkBankAccount({
      tos_accepted: true,
      token: token,
      account_id: metadata.account_id,
    }).then((response) => {
      console.log(response);
      if (response.data.error || response.data.code) {
        //error
      } else {
        let user = this.props.user;
        user.account = response.data.account;
        this.props.editProfile(user.id, { user: { ...user } });
      }
      this.setState({
        isLoading: false,
      });
      let search = qs.parse(this.props.history.location.search);
      if (search.tab === "account") {
        this.props.history.goBack();
      }
    });
  }
  handleOnExit() {
    console.log("exit");
  }

  setProfileImageStateNull = () => {
    this.setState({ image: null });
  };

  render() {
    let isPhoneVerified = storage.get("isPhoneVerified", null);
    let profileClassName = "vertical_tabs_cont";
    if (
      this.props.user.assessment_status === assessment_status.FAILED ||
      this.props.user.assessment_status === assessment_status.SUBMITTED
    ) {
      profileClassName = "vertical_tabs_cont hero_not_activated_profile";
    }
    let disableLeftMenu =
      this.props.user.role === roles.service_provider &&
      this.props.isPhoneVerified &&
      isPhoneVerified &&
      (this.props.user.assessment_status.toLowerCase() ===
        assessment_status.SUBMITTED.toLowerCase() ||
        this.props.user.assessment_status.toLowerCase() ===
        assessment_status.FAILED.toLowerCase() ||
        this.props.user.background_check.toLowerCase() ===
        background_check.FAILED.toLowerCase() ||
        this.props.user.background_check.toLowerCase() ===
        background_check.PENDING.toLowerCase());
    return (
      <section className="home_hero">
        <div className="container">
          <div className="sub_head_tlt">
            <div className="mainTitle">
              {this.props.user.assessment_status.toLowerCase() ===
                assessment_status.SUBMITTED.toLowerCase() ? null : (
                <h2 className="ft_Weight_600">MANAGE ACCOUNT</h2>
              )}
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div
            className={profileClassName}
            style={disableLeftMenu ? { paddingTop: "15px" } : null}
          >
            <HeroProfileForm
              isPhoneVerified={this.props.isPhoneVerified || isPhoneVerified}
              user={this.props.user}
            />
            <div
              style={
                (this.props.isPhoneVerified || isPhoneVerified) &&
                  !disableLeftMenu
                  ? null
                  : { borderLeft: "none", paddingTop: "10px" }
              }
              className="vertical_tabs_colR vertical_tabs_col "
            >
              <div className="tab_list_block">
                <div
                  className="tab-content mt-72 v_tabs_content input_pro_edit_tabs"
                  id="v-pills-tabContent"
                >
                  <Switch>
                    <Route exact path={routes.EDIT_PROFILE}>
                      <EditProfile
                        profilePhotoPath={this.props.profilePhotoPath}
                        file={this.state.file}
                        isloading={this.props.isloading}
                        onImageUpload={this.onImageUpload}
                        profileImage={this.state.image}
                        sendOTP={this.props.sendOTP}
                        setProfileImageStateNull={this.setProfileImageStateNull}
                        resetAddressAttributesState={
                          this.resetAddressAttributesState
                        }
                        address_attributes={this.state.address_attributes}
                        handleAddressSelect={this.handleAddressSelect}
                        isLoading={this.props.isLoading}
                        isPhoneVerified={
                          this.props.isPhoneVerified || isPhoneVerified
                        }
                        phoneFieldError={this.state.phoneFieldError}
                        validatePhoneField={this.validatePhoneField}
                        editProfile={this.props.editProfile}
                        user={this.props.user}
                        id={this.props.user.id}
                        role={this.props.user.role}
                      />
                    </Route>
                    {isPhoneVerified || this.props.isPhoneVerified ? (
                      <Switch>
                        <Route exact path={routes.CHANGE_PASSWORD}>
                          <ChangePassword
                            history={this.props.history}
                            user={this.props.user}
                            changePassword={this.props.changePassword}
                            isLoading={this.props.isLoading}
                            role={this.props.user.role}
                          />
                        </Route>
                        <Route exact path={routes.BANK_DETAILS}>
                          <Account
                            role={this.props.user.role}
                            handleOnExit={this.handleOnExit}
                            isLoading={this.state.isLoading}
                            user={this.props.user}
                            handleOnSuccess={this.handleOnSuccess}
                          />
                        </Route>
                        <Route exact path={routes.PAYOUTS}>
                          <Payouts
                            payouts={this.props.payouts}
                            getPayouts={this.props.getPayouts}
                            isLoading={this.props.isTransactionHistoryLoading}
                            user={this.props.user}
                          />
                        </Route>
                        <Route exact path={routes.BUSINESS_CARD}>
                          <BusinessCard
                            history={this.props.history}
                            user={this.props.user}
                          />
                        </Route>
                        <Route
                          path="*"
                          render={(props) => (
                            <Redirect to={routes.EDIT_PROFILE} />
                          )}
                        />
                      </Switch>
                    ) : (
                      <Redirect to={routes.EDIT_PROFILE} />
                    )}
                    <Route
                      path="*"
                      render={(props) => <Redirect to={routes.EDIT_PROFILE} />}
                    />
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.authReducer.user,
  isLoading: state.authReducer.isloading,
  profilePhotoPath: state.authReducer.photo_path,
  isPhoneVerified: state.authReducer.isPhoneVerified,
  payouts: state.clientOrHeroReducer.payouts,
  isloading: state.clientOrHeroReducer.isloading,
  isTransactionHistoryLoading: state.clientOrHeroReducer.isLoading,
});

const mapStateToDispatch = (dispatch) => ({
  editProfile: (id, credentials) =>
    dispatch(actions.editProfile(id, credentials)),
  changePassword: (credentials) =>
    dispatch(actions.changePassword(credentials)),
  profilePhotoUpload: (credentials, image) =>
    dispatch(actions.profilePhotoUpload(credentials, image)),
  getHeroProfile: () => dispatch(actions.getUserProfile()),
  sendOTP: (credentials) => dispatch(actions.send_otp(credentials)),
  getPayouts: () => dispatch(actions.getPayouts()),
});

export default connect(mapStateToProps, mapStateToDispatch)(HeroProfile);
