import React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import {
  routes,
  themeBlackColor,
  HeroProfilePicPath,
} from "../../utility/constants/constants";
import * as actions from "../../redux/actions/index";
import Avatar from "react-avatar";
import RingLoader from "react-spinners/RingLoader";
import { css } from "@emotion/core";
import "./Favorites.css";
import CancelConfrimation from "../../components/AlertComponents/cancelConfirmation";
import { showConfirmAlert } from "../../utility/sweetAlerts/sweetAlerts";
import storage from "../../utility/storage";

class Favorites extends React.Component {
  state = {
    deleteButtonId: null,
  };

  componentDidMount() {
    this.props.getUserFavoriteHerosList();
  }

  navigateToBookingFlow = () => {
    this.props.history.push(routes.DASHBOARD);
  };

  deleteUserFavouriteHero = (provider_id) => {
    this.setState({ deleteButtonId: provider_id });
    this.props.deleteUserFavouriteHero(provider_id);
  };

  render() {
    console.log(document.referrer);
    const overrideSpinnerCSS = css`
      margin: 0 auto;
    `;

    return (
      <section className="home_hero avh_pro_sec">
        <div className="container">
          <div className="sub_head_tlt">
            {/* <div className="row align-items-center">
              <div className="col-lg-12"> */}
            <div className="mainTitle">
              <h2 className="ft_Weight_600 mb-3 ">MY HEROES</h2>
            </div>
            {/* </div>
            </div> */}
          </div>
        </div>
        <div class="container-fluid avh_pt15">
          {/* </div> */}
          {/* <div className="container-fluid"> */}
          <div className="row">
            <div className="col-sm-12">
              {/* <h1 className="mt-5 mb-3 text-primary font-semi-bold">Your Favorite AV HEROS</h1> */}
              <div className="avh_photo_list">
                {this.props.userFavoriteHerosList &&
                this.props.userFavoriteHerosList.length > 0 ? (
                  this.props.userFavoriteHerosList.map((hero, index) => {
                    let profilePhotoSrc =
                      hero.photo_urls && Object.keys(hero.photo_urls).length > 0
                        ? hero.photo_urls.small
                        : hero.social_photo_url
                        ? hero.social_photo_url
                        : null;
                    let profilePicName =
                      hero.short_name.charAt(0).toUpperCase() +
                      " " +
                      hero.short_name.charAt(hero.short_name.length - 1);
                    return (
                      <div
                        key={hero.id}
                        className="fav_avhero_card"
                        style={{ cursor: "default" }}
                      >
                        <figure className="fav_thumb">
                          {profilePhotoSrc ? (
                            <img src={profilePhotoSrc} />
                          ) : (
                            <img src={HeroProfilePicPath.FLYING} />
                          )}
                        </figure>
                        <article className="fav_avhero_art">
                          <h3>{hero.short_name}</h3>
                          <h5>{hero.code}</h5>
                          <h5>{`${hero.city}, ${hero.state}`}</h5>
                          <div className="fav_outline_btn">
                            {hero.services && hero.services.length > 0
                              ? hero.services.map((service, index) => {
                                  return (
                                    <a
                                      href="javascript:void(0)"
                                      style={{ cursor: "default" }}
                                      className="theme_btn theme_outline_primary"
                                    >
                                      {service.name}
                                    </a>
                                  );
                                })
                              : null}
                          </div>
                        </article>
                        <button
                          onClick={() =>
                            showConfirmAlert(
                              "Remove Favorite?",
                              "Are you sure you want to delete " +
                                hero.short_name +
                                " from your favorites?",
                              () => {
                                this.deleteUserFavouriteHero(hero.id);
                              }
                            )
                          }
                          disabled={
                            this.props.isLoading &&
                            hero.id === this.state.deleteButtonId
                              ? true
                              : false
                          }
                          className="theme_btn theme_danger btn_w170 delete_favourite"
                        >
                          {this.props.isLoading &&
                          hero.id === this.state.deleteButtonId
                            ? "Deleting...."
                            : "unfavorite"}
                        </button>
                      </div>
                    );
                  })
                ) : this.props.isLoading ? (
                  <RingLoader
                    css={overrideSpinnerCSS}
                    sizeUnit={"px"}
                    size={50}
                    color={themeBlackColor}
                    loading={this.props.isLoading}
                  />
                ) : (
                  <div className="container no_jobs_txt">
                    <article className="art_hero_text">
                      <span className="contact_us_fly_icon fly_icon mb-2">
                        {/* <img src={HeroProfilePicPath.FLYING_PNG} alt="Icon" /> */}
                      </span>
                      <h1 className="red_text">No Favorites Yet!</h1>
                      <p className="about-us-hero__title red_text">
                        Start adding favorites by reviewing your past bookings
                      </p>
                    </article>
                  </div>
                )}
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
  userFavoriteHerosList: state.clientOrHeroReducer.userFavoriteHerosList,
  isLoading: state.clientOrHeroReducer.isLoading,
});

const mapStateToDispatch = (dispatch) => ({
  getUserFavoriteHerosList: () => dispatch(actions.getUserFavoriteHerosList()),
  deleteUserFavouriteHero: (provider_id) =>
    dispatch(actions.deleteUserFavoriteHero(provider_id)),
});

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(withRouter(Favorites));
