import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import ReactTooltip from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import { GOOGLE_PLACES_API_KEY } from "../../config";
const AnyReactComponent = ({ text }) => {
  return (
    <div className="cst_tooltip">
      <ReactTooltip className="tooltip-custom" html={true} />
      <span data-tip={`${text}`} className="has-tooltip pointer_cursor">
        <i
          className="fa fa-map-marker"
          style={{ fontSize: "40px", color: "#9b2c59" }}
        ></i>
      </span>
    </div>
  );
};
const SimpleGoogleMapReact = () => {
  const bookingObject = useSelector(
    (state) => state.clientOrHeroReducer.bookingData
  );

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "90vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={GOOGLE_PLACES_API_KEY()}
        defaultCenter={
          bookingObject.address_attributes.formatted_address
            ? {
                lat: bookingObject.address_attributes.latitude,
                lng: bookingObject.address_attributes.longitude,
              }
            : { lat: 0, lng: 0 }
        }
        defaultZoom={11}
      >
        <AnyReactComponent
          text={bookingObject.address_attributes.formatted_address}
        />
      </GoogleMapReact>
    </div>
  );
};

export default SimpleGoogleMapReact;
