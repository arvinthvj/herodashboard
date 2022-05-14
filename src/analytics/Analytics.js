
import ReactGA from 'react-ga';
import { GATrackingID, FBPixelID } from '../config';
import ReactPixel from 'react-facebook-pixel';


export const GAinitialize = () => {
    ReactGA.initialize(GATrackingID());
}

export const FBPixelinitialize = () => {
    const options = {
        autoConfig: true, 	// set pixel's autoConfig
        debug: false, 		// enable logs
    };
    ReactPixel.init(FBPixelID, null, options);
}

export const gaSetUserDetails = ({ id, first_name, last_name = "", email, role }) => {
    ReactGA.set({
        userId: id,
        role: role
        // any data that is relevant to the user session
        // that you would like to track with google analytics
    })
}

export const gaCapturePageView = () => {
    console.log(`The current URL is ${window.location.pathname + window.location.search}`)
    ReactGA.set({ page: window.location.pathname }); // Update the user's current page
    ReactGA.pageview(window.location.pathname + window.location.search);
}

export const FBPixelCapturePageView = () => {
    ReactPixel.pageView(); 					// For tracking page view
}

export const gaCustomEvent = (eventName, action = "", label = "") => {
    //GAReact.event(): Will take an object as a parameter. 
    //Will contain data about events that take place in the app (form submit, button click, etc.) 
    // Will have fields of category, action, label and value.
    ReactGA.event({
        category: eventName,
        action: action,
        label: label
    });
}