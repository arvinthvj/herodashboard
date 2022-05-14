import axios from "axios";

export const BASE_URL = () => {
  let url;
  if (process.env.REACT_APP_ENV === "development") {
    url = "https://stage-api.avhero.com";
  }
  if (process.env.REACT_APP_ENV === "staging") {
    url = "https://stage-api.avhero.com";
  }
  if (process.env.REACT_APP_ENV === "production") {
    console.log("production if");
    url = "https://api.avhero.com";
  }
  return url;
};

export const WP_URL = () => {
  let url;
  if (process.env.REACT_APP_ENV === "development") {
    url = "https://stage.avhero.com/";
  }
  if (process.env.REACT_APP_ENV === "staging") {
    url = "https://stage.avhero.com/";
  }
  if (process.env.REACT_APP_ENV === "production") {
    console.log("production if");
    url = "https://avhero.com/";
  }
  return url;
};

export const WPLink = {
  howItWorks: `${WP_URL()}how-it-works/`,
  becomeAnAVHERO: `${WP_URL()}become-an-av-hero/`,
  customer: `${WP_URL()}`,
  brandPillars: `${WP_URL()}`,
  news: `${WP_URL()}news/`,
  contact: `${WP_URL()}contact/`,
  help: `${WP_URL()}faq/`,
  services: `${WP_URL()}services/`,
  business: `${WP_URL()}business/`,
  residential: `${WP_URL()}residential/`,
  partners: `${WP_URL()}partners/`,
  store: `https://avswag.com/collections/av-hero`,
  faq: `${WP_URL()}faq/`,
  privacy: `${WP_URL()}privacy-policy/`,
  termsOfUse: `${WP_URL()}terms-of-use`
};

export const GATrackingID = () => {
  if (process.env.REACT_APP_ENV === "development") {
    return "UA-164072168-1";
  } else if (process.env.REACT_APP_ENV === "staging") {
    return "UA-164072168-1";
  } else {
    //production
    return "UA-164072168-2";
  }
};

export const FBPixelID = "607750386739491";

export const FB_LOGIN_APP_ID = () => {
  if (process.env.REACT_APP_ENV === "development") {
    return "1528244560650667";
  } else if (process.env.REACT_APP_ENV === "staging") {
    return "1528244560650667";
  } else {
    return "2190184271288014";
  }
};

export const PlaidPublicKey = () => {
  if (process.env.REACT_APP_ENV === "development") {
    return "409375647842f113d5b3aa1ae7f387";
  } else if (process.env.REACT_APP_ENV === "staging") {
    return "409375647842f113d5b3aa1ae7f387";
  } else {
    return "409375647842f113d5b3aa1ae7f387";
  }
};

export const GOOGLE_LOGIN_CLIENT_ID = () => {
  if (process.env.REACT_APP_ENV === "development") {
    return "581842886969-utifn0c0nc1a713fajt32m2hqqc997gr.apps.googleusercontent.com";
  } else if (process.env.REACT_APP_ENV === "staging") {
    return "581842886969-utifn0c0nc1a713fajt32m2hqqc997gr.apps.googleusercontent.com";
  } else {
    return "333944307809-543o2s31ov8g63tau5mkck7vbai9mcta.apps.googleusercontent.com";
  }
};

export const GOOGLE_PLACES_API_KEY = () => {
  if (process.env.REACT_APP_ENV === "development") {
    return "AIzaSyBSs9U0xvxP4ZhnFXEg9o34RheAtQVuw-g";
  } else if (process.env.REACT_APP_ENV === "staging") {
    return "AIzaSyBSs9U0xvxP4ZhnFXEg9o34RheAtQVuw-g";
  } else {
    return "AIzaSyAdDiGn4kxeHPUVn94LLpB0P8QzwQHt3ro";
  }
};

export const API_VERSION = "/api/v1";

const instance = axios.create({
  baseURL: BASE_URL(),
});

export const StripeKey = () => {
  if (process.env.REACT_APP_ENV === "development") {
    return "pk_test_G6s1hxywRZxgN20uapm0WT5o00KcHxtzyf";
  } else if (process.env.REACT_APP_ENV === "staging") {
    return "pk_test_G6s1hxywRZxgN20uapm0WT5o00KcHxtzyf";
  } else {
    return "pk_live_cRPjgDUK3nUSilMBivAGX8Jz00nONiEb0i";
  }
};

export default instance;
