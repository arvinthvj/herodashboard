import React, { Component } from "react";
import ClientProfileMenu from "../../components/Profile/ClientProfileForm/ClientProfileMenu";
import { Route, Redirect, Switch } from "react-router-dom";
import EditProfile from "../../components/Profile/EditProfile/EditProfile";
import ChangePassword from "../../components/Profile/ChangePassword/ChangePassword";
import BankCardDetails from "../../components/Profile/ClientProfileForm/BankCardDetails/BankCardDetails";
import FavouriteHero from "../../components/Profile/ClientProfileForm/FavouriteHero/FavouriteHero";
import { routes, assessment_status } from "../../utility/constants/constants";
import { connect } from "react-redux";
import * as actions from "../../redux/actions/index";
import getDetailAddress from "../../utility/getDetailAddress";
import { toastMsg, resetOrientation } from "../../utility/utility";
import Oux from "../../hoc/Oux/Oux";
import { injectStripe } from "react-stripe-elements";
import storage from "../../utility/storage";
import imageCompression from "browser-image-compression";
import { decode, encode } from "base64-arraybuffer";
import TransactionHistory from "../../components/Profile/ClientProfileForm/TransactionHistory/TransactionHistory";
const cloneDeep = require("clone-deep");

class ClientProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: null,
      address_attributes: null,
      file: null,
      image: null,
      isLoading: false,
      cardError: "",
    };
    this.handleAddressSelect = this.handleAddressSelect.bind(this);
    this.addCreditCard = this.addCreditCard.bind(this);
    this.onImageUpload = this.onImageUpload.bind(this);
  }

  componentWillMount() {
    let currentUrl = `${this.props.history.location.pathname}`;
    if (currentUrl === routes.PROFILE) {
      this.props.history.push(routes.EDIT_PROFILE);
    }
  }

  componentDidUpdate = (PrevProps, PrevState) => {
    if (PrevProps.bookingData !== this.props.bookingData) {
      this.setState({
        isLoading: false,
      });
    }

    if (PrevProps.isCardLoading && !this.props.isCardLoading) {
      this.setState({
        isLoading: false,
      });
    }
  };

  componentDidMount() {
    this.props.getUserProfile();
  }

  componentWillUnmount = () => {
    this.props.resetObjects();
  };

  resetAddressAttributesState = () => {
    this.setState({ address_attributes: null });
  };

  async addCreditCard(values) {
    let cardDetails = cloneDeep(values);
    this.setState({
      isLoading: true,
    });
    if (cardDetails.card.length === 0) {
      let { token } = await this.props.stripe.createToken({ name: "Name" });

      if (!token) {
        this.setState({
          cardError: "Please add Card Details.",
          isLoading: false,
        });
      } else {
        this.props.addCard(token.id, cardDetails);
      }
    }
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

  async onImageUpload(e) {
    let reader = new FileReader();
    let file = e && e.target ? e.target.files[0] : e[0];
    let type = file.type;
    let extension = file.name.split(".").pop().toLowerCase();
    const orientation = await imageCompression.getExifOrientation(file);
    if (["image/png", "image/jpeg", "image/jpg"].includes(type)) {
      reader.onloadend = () => {
        resetOrientation(reader.result, orientation, this, extension);
        //

        console.log(reader.result);
        this.setState({
          // image: reader.result,
          file: file,
        });

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
    return (
      <section className="home_hero">
        <div className="container">
          <div className="sub_head_tlt">
            <div className="mainTitle">
              <h2 className="ft_Weight_600">MANAGE ACCOUNT</h2>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className={profileClassName}>
            <ClientProfileMenu
              history={this.props.history}
              isPhoneVerified={this.props.isPhoneVerified || isPhoneVerified}
            />
            <div
              style={
                this.props.isPhoneVerified || isPhoneVerified
                  ? null
                  : { borderLeft: "none" }
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
                        onImageUpload={this.onImageUpload}
                        profileImage={this.state.image}
                        sendOTP={this.props.sendOTP}
                        setProfileImageStateNull={this.setProfileImageStateNull}
                        resetAddressAttributesState={
                          this.resetAddressAttributesState
                        }
                        address_attributes={this.state.address_attributes}
                        handleAddressSelect={this.handleAddressSelect}
                        isloading={this.props.isloading}
                        isLoading={this.props.isLoading}
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
                            user={this.props.user}
                            history={this.props.history}
                            changePassword={this.props.changePassword}
                            isLoading={this.props.isLoading}
                            role={this.props.user.role}
                          />
                        </Route>
                        <Route exact path={routes.BANK_DETAILS}>
                          <BankCardDetails
                            setState={this}
                            role={this.props.user.role}
                            state={this.state}
                            addCreditCard={this.addCreditCard}
                          />
                        </Route>
                        <Route exact path={routes.PAYMENTS}>
                          <TransactionHistory
                            isLoading={this.props.isTransactionHistoryLoading}
                            clientOrders={this.props.clientOrders}
                            getClientOrders={this.props.getClientOrders}
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
                    {/* <Route path={routes.CLIENT_FAVOURITE_HERO}>
                                        <FavouriteHero role={this.props.user.role} />
                                    </Route> */}
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
  bookingData: state.clientOrHeroReducer.bookingData,
  isPhoneVerified: state.authReducer.isPhoneVerified,
  clientOrders: state.clientOrHeroReducer.clientOrders,
  isloading: state.clientOrHeroReducer.isloading,
  isTransactionHistoryLoading: state.clientOrHeroReducer.isLoading,
  isCardLoading: state.clientOrHeroReducer.isCardLoading,
});

const mapStateToDispatch = (dispatch) => ({
  editProfile: (id, credentials) =>
    dispatch(actions.editProfile(id, credentials)),
  changePassword: (credentials) =>
    dispatch(actions.changePassword(credentials)),
  profilePhotoUpload: (credentials, image) =>
    dispatch(actions.profilePhotoUpload(credentials, image)),
  getUserProfile: () => dispatch(actions.getUserProfile()),
  addCard: (token, bookingData) =>
    dispatch(actions.addCard(token, bookingData)),
  sendOTP: (credentials) => dispatch(actions.send_otp(credentials)),
  resetObjects: () => actions.resetObjects(),
  getClientOrders: () => dispatch(actions.getClientOrders()),
});

export default injectStripe(
  connect(mapStateToProps, mapStateToDispatch)(ClientProfile)
);
