import { store } from 'react-notifications-component';
import storage from '../utility/storage';
import { useRef } from 'react';
import { useEffect } from 'react';
import $ from "jquery";
import { TypesOfIssues, BookingType, ClientFilterSections, HeroFilterSections } from './constants/constants';
import { decode, encode } from 'base64-arraybuffer';
import ReactGA from 'react-ga';

const { detect } = require('detect-browser');
var moment = require('moment-timezone');

export const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export const toFloatWithDecimal = (number) => {
    return parseFloat(number).toFixed(2);
}

export const manupulatingTime = (time) => {
    const manipulatedTime = {};
    const T = time.split(':');
    manipulatedTime['hour'] = T[0];
    manipulatedTime['minute'] = T[1];
    return manipulatedTime;
}
// Replace AM and PM
export const replaceAMPM = (time) => {
    if (time.includes('AM')) {
        return time.replace('AM', '');
    } else if (time.includes('PM')) {
        return time.replace('PM', '');
    } else {
        return time;
    }
}

export const closeCompaignUI = (enable) => {
    storage.set("close_campaign_ui", enable);
}

export const isCompaignUIClosed = () => {
    return storage.get("close_campaign_ui", false);
}

//Convert 24-hour time-of-day string to 12-hour time with AM/PM 
export const timeconvert = (time) => {
    return moment(time).format('hh:mm A');
}

//Convert 12-hour time-of-day string to 24-hour time with AM/PM 
export const timeconvertFrom12To24Format = (time) => {
    return moment(time).format('HH:mm');
}

export const tConvert = (time) => {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
}

// Calendar logic
export const getStartTimeAndEndTime = (startTime, endTime) => {

    const startTimeArray = startTime.split(':');
    const startTimeHour = parseInt(startTimeArray[0]);
    const startTimeMinute = parseInt(startTimeArray[1]);

    const endTimeArray = endTime.split(':');
    const endTimeHour = parseInt(endTimeArray[0]);
    const endTimeMinute = parseInt(endTimeArray[1]);
    return { startTimeHour, startTimeMinute, endTimeHour, endTimeMinute }
}

export const daysInThisMonth = (currentDate) => {
    var now = currentDate;
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

export const differenceBetweenTwoDatesInHours = (start, end) => {
    var seconds = (end.getTime() - start.getTime()) / 1000;
    return (seconds / 60) / 60;
}

export const differenceBetweenTwoDatesInMinutes = (start, end) => {
    var seconds = (end.getTime() - start.getTime()) / 1000;
    return (seconds / 60);
}

export const differenceBetweenTwoDatesInSeconds = (start, end) => {
    var seconds = (end.getTime() - start.getTime()) / 1000;
    return seconds;
}

export const timeElapsedFromStartTime = (startTime, currentTime) => {
    let seconds = differenceBetweenTwoDatesInSeconds(startTime, currentTime);
    let minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds - (minutes * 60));
    return `${pad(minutes, 2)} : ${pad(seconds, 2)}`;
}

export const convertSecondsToDisplayFormat = (seconds) => {
    let minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds - (minutes * 60));
    return `${pad(minutes, 2)} : ${pad(seconds, 2)}`;
}

export const convertSecondsToDisplayFormatInHrMM = (seconds) => {
    let hours = parseInt((seconds / 60) / 60);
    let minutes = parseInt((seconds - (hours * 60 * 60)) / 60);
    return `${pad(hours, 2)} Hrs : ${pad(minutes, 2)} mins`;
}

// providers Attributes Time Logic

export const EndTimeValidation = (startTime) => {
    const arr = startTime.split(':');
    let hour = parseInt(arr[0]);
    let minute = parseInt(arr[1]);

    if ((minute + 15) !== 60) {

        minute = minute + 15;
        return hour.toString().concat(":" + minute.toString())
    } else {

        hour = hour + 1
        return hour.toString().concat(":00");
    }
}

// for production removing console logs
export const removeConsoleLog = () => {
    function emptyfunc() { }
    console.log = emptyfunc;
    console.warn = emptyfunc;
    console.error = emptyfunc;
}

export const addDateTime = (date, month, year, hours, minutes) => {
    var mont = parseInt(month) + 1
    var x = year + ',' + mont + ',' + date + ' ' + hours + ':' + minutes;
    var dt = new Date(x);
    return dt
}

export const addSecondsToDate = (date, seconds) => {
    var month = parseInt(date.getMonth()) + 1
    var x = date.getFullYear() + ',' + month + ',' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + seconds;
    var dt = new Date(x);

    return dt
}

// while sending it to server
//keeping date and time intact just changing the timezone and returning the UTC
export const convertDateToDifferentTZ = (date, timezone) => {
    // console.log(date, timezone);
    var now = moment(date);

    now.tz(timezone, true);
    // console.log(date, timezone, now.toISOString());
    // console.log(now.format());
    // console.log(now.toISOString());
    return now.toISOString();
}

export const getDateOfSpecificTimeZone = (timezone) => {
    var timezone_offset = moment.tz(timezone).utcOffset()

    var d = new Date();

    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    var nd = new Date(utc + (60000 * timezone_offset));

    return nd
}


export const convertDateToDifferentTZSansUTC = (date, timezone) => {
    var now = moment(date);
    now.tz(timezone, true);
    // console.log(now.format());
    // console.log(now.toISOString());
    return now.toDate();
}

//displaying on the front end
//Converting UTC to specific timezone

export const convertUTCToDifferentTZ = (date, timezone) => {
    var d = new Date(date);
    var utc_offset = d.getTimezoneOffset();
    // console.log("utc_offset:" + utc_offset);
    d.setMinutes(d.getMinutes() + utc_offset);
    // console.log("utc:" + d);

    var timezone_offset = moment(date).tz(timezone).utcOffset()
    // var isDst = moment(date).tz(timezone).isDST();

    d.setMinutes(d.getMinutes() + timezone_offset);
    // console.log("updated date" + d);
    return d;
}

///////// Service provider listing availability section - Hours computation logic 

export const getHoursBetween = (startDate, endDate) => {
    let diff = endDate.getHours() - startDate.getHours();
    var diffDates = [];
    for (var i = 0; i < diff; i++) {
        let date = new Date(startDate);
        date.setHours(startDate.getHours() + i);
        diffDates.push(date);
    }
    return diffDates;
};

export const getDateKey = date => {
    return (
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
};

export const computeHoursForAvailability = (availabilities, timezone) => {
    var availableDates = [];
    var datesAvailabilityMapping = {};
    for (var index in availabilities) {
        let dates = availabilities[index];
        let startDate = convertUTCToDifferentTZ(dates["start_time"], timezone);
        let endDate = convertUTCToDifferentTZ(dates["end_time"], timezone);

        let dateKey = getDateKey(startDate);
        availableDates.push(dateKey);
        let computedHours = getHoursBetween(startDate, endDate);
        if (datesAvailabilityMapping[dateKey]) {
            let hours = datesAvailabilityMapping[dateKey];
            hours = hours.concat(computedHours);
            datesAvailabilityMapping[dateKey] = hours;
        } else {
            datesAvailabilityMapping[dateKey] = computedHours;
        }
    }

    availableDates = availableDates.filter((ele, index) => {
        return availableDates.indexOf(ele) === index;
    });

    return { availableDates, datesAvailabilityMapping };
};

export const pad = (num, size) => {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}


export const getFormattedTime = (date) => {
    let hrs = pad(date.getHours(), 2)
    let minutes = date.getMinutes() === 0 ? "00" : pad(date.getMinutes(), 2);
    return hrs + ":" + minutes;
}

//////////////////////////////////////////////////////////////////////////////////////
//May 04, 2019
export const dateToString = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', "Aug", "Sep", "Oct", "Nov", "Dec"]
    var mm = date.getMonth();
    var dt = date.getDate();
    var year = date.getFullYear();
    return months[mm] + " " + dt + ", " + year;
}


export const dateTimeToString = (date) => {
    const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', "Aug", "Sep", "Oct", "Nov", "Dec"]
    var mm = date.getMonth();
    var dt = date.getDate();
    var hr = date.getHours();
    var min = date.getMinutes();
    // const time = tConvert(hr.toString() + ":" + min.toString());
    const time = timeconvert(date);
    return months[mm] + " " + dt + ", " + time;
}

export const roundOff = (date) => {
    var offset = 15;
    var tempDate = new Date(date);
    var minutes = date.getMinutes();
    var newMin = minutes + (offset - (minutes % offset));
    tempDate.setMinutes(newMin);
    tempDate.setSeconds(0);
    return tempDate;
}

export const isAllDay = (startTime, endTime) => {
    let startOfTheDay = startTime.getHours() === 0 && startTime.getMinutes() === 0;
    let endOfTheDay = endTime.getHours() === 23 && endTime.getMinutes() === 59;
    return startOfTheDay && endOfTheDay;
}


//toast
export const toastMsg = (msg, error = false, autoClose = 2000) => {
    if (error) {
        store.addNotification({
            title: "Error",
            message: msg,
            type: "danger",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: autoClose,
                //   onScreen: true,
                showIcon: true
            }
        });
    } else {
        store.addNotification({
            title: "Success",
            message: msg,
            type: "warning",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: autoClose,
                //   onScreen: true,
                showIcon: true
            }
        });
    }
}

export const toastInfo = (msg, autoClose = 2000) => {
    store.addNotification({
        title: "Info!",
        message: msg,
        type: "info",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
            duration: autoClose,
            //   onScreen: true,
            showIcon: true
        }
    });
}

export function useOuterClickNotifier(onOuterClick, innerRef) {
    useEffect(
        () => {
            // only add listener, if the element exists
            if (innerRef.current) {
                document.addEventListener("click", handleClick);
            }

            // unmount previous first in case inputs have changed
            return () => document.removeEventListener("click", handleClick);

            function handleClick(e) {
                innerRef.current && !innerRef.current.contains(e.target) && onOuterClick(e);
            }
        },
        [onOuterClick, innerRef] // invoke again, if inputs have changed
    );
}

export const convertTZToJobCardTime = (tzDateString) => {
    var date = new Date(tzDateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', "Aug", "Sep", "Oct", "Nov", "Dec"]
    var mm = date.getMonth();
    var dt = date.getDate();
    var hr = (date.getHours());
    var min = date.getMinutes();
    // var hours = (hours+24-2)%24; d

    var mid = 'AM';

    if (hr === 0) { //At 00 hours we need to show 12 am
        hr = 12;
    } else if (hr === 12) {
        mid = 'PM';
    } else if (hr > 12) {
        hr = hr % 12;
        mid = 'PM';
    }
    return `${months[mm]} ${pad(dt, 2)}, ${pad(hr, 2)}:${pad(min, 2)} ${mid}`
}

export const convertDurationToString = (duration) => {

    let hours = parseInt(duration / 60);
    let minutes = parseInt(duration - (hours * 60));
    if (minutes > 0) {
        return `${pad(hours, 2)} hours ${pad(minutes, 2)} mins`;
    } else {
        return `${pad(hours, 2)} hours`;
    }

}

export const getFormatedNumber = (number) => {
    let format = '';
    for (var i = 0; i < number.length; i++) {

        if (i === 0 && number.charAt(i) === '0') {
        } else if (/\d/.test(number.charAt(i))) {
            format = format + '#';
        } else {
            format = format + ' ';
        }
    }
    return format;
}

export const dateFormat = (date, formatType) => {
    let year = date.getFullYear()
    let month = (1 + date.getMonth()).toString()
    month = month.length > 1 ? month : '0' + month
    let day = date.getDate().toString()
    day = day.length > 1 ? day : '0' + day
    console.log(month + '/' + day + '/' + year)
    if (formatType === 'YYYY-MM-DD') {
        return year + '-' + month + '-' + day
    }
    if (formatType === 'MMYYYY') {
        return month + year
    }
    else {
        return month + '/' + day + '/' + year
    }
}

export const closeModel = () => {
    $("[data-dismiss=modal]").trigger({ type: "click" });
}


// String Contains alphabet
export const hasLetter = (myString) => {
    return (myString.match(/[a-z]/i));
}

// captalise first letter in string

export const capitalizeFirstLetter = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const ConvertStringToUpperCase = (string) => {

    if (string === BookingType.asap.key) {
        return string.toUpperCase();
    } else {
        return capitalizeFirstLetter(string);
    }
}

export const resetOrientation = (srcBase64, srcOrientation, props, extension) => {
    var img = new Image();

    let base64 = null;
    img.onload = function () {
        var width = img.width,
            height = img.height,
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext("2d");

        // set proper canvas dimensions before transform & export
        if (4 < srcOrientation && srcOrientation < 9) {
            canvas.width = height;
            canvas.height = width;
        } else {
            canvas.width = width;
            canvas.height = height;
        }

        // transform context before drawing image
        switch (srcOrientation) {
            case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
            case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
            case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
            case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
            case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
            case 7: ctx.transform(0, -1, -1, 0, height, width); break;
            case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
            default: break;
        }

        // draw image
        ctx.drawImage(img, 0, 0);

        // export base64
        // callback(canvas.toDataURL());

        base64 = canvas.toDataURL();
        //  
        props.setState({
            image: base64
        })
        let image = base64.split(',');
        props.props.profilePhotoUpload(extension, decode(image[1]));
        console.log(base64);
        return base64;
    };

    img.src = srcBase64;
    //  
}

export const resetOrientationUsingHooks = (srcBase64, srcOrientation, setBase64) => {
    var img = new Image();

    let base64 = null;
    img.onload = function () {
        var width = img.width,
            height = img.height,
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext("2d");

        // set proper canvas dimensions before transform & export
        if (4 < srcOrientation && srcOrientation < 9) {
            canvas.width = height;
            canvas.height = width;
        } else {
            canvas.width = width;
            canvas.height = height;
        }

        // transform context before drawing image
        switch (srcOrientation) {
            case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
            case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
            case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
            case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
            case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
            case 7: ctx.transform(0, -1, -1, 0, height, width); break;
            case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
            default: break;
        }

        // draw image
        ctx.drawImage(img, 0, 0);

        // export base64
        // callback(canvas.toDataURL());

        base64 = canvas.toDataURL();
        //  

        setBase64(base64);

        console.log(base64);
        return base64;
    };

    img.src = srcBase64;
    //  
}

export const clientFilterKey = key => {
    for (var filterKey in ClientFilterSections) {
        let object = ClientFilterSections[filterKey];
        if (object.key === key) {
            return object.api_filter;

        }
    }
}

export const clientFilterFromAPIFilterKey = api_filter => {
    for (var filterKey in ClientFilterSections) {
        let object = ClientFilterSections[filterKey];
        if (object.api_filter === api_filter) {
            return object;
        }
    }
}

export const heroFilterKey = key => {

    for (var filterKey in HeroFilterSections) {
        let object = HeroFilterSections[filterKey];
        if (object.key === key) {
            return object.api_filter;
        }
    }
}


export const heroFilterFromAPIFilterKey = api_filter => {
    for (var filterKey in HeroFilterSections) {
        let object = HeroFilterSections[filterKey];
        if (object.api_filter === api_filter) {
            return object;
        }
    }
}


export const isSafari = () => {
    const browser = detect();
    // return /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    if (browser) {
        // alert(browser.name)
        if (browser.name === "ios") {
            return true;
        }
    }
    return false;
}


export function triggerPageEvent() {
    if (window) {
        setTimeout(() => {
            // console.log("window.location.pathname:"+window.location.origin + window.location.pathname);
            ReactGA.ga('send', 'pageview', window.location.origin + window.location.pathname);
            // ReactGA.pageview(window.location.pathname + window.location.search)
        }, 0.0);
    }
}

export const removeDublicateValuesInAddress = (address) => {
    let SplittedAddress = address.split(",");
    let SteetAddress = "";

    var uniqueArray = [];

    // Loop through array values
    for (let i = 0; i < SplittedAddress.length; i++) {
        if (uniqueArray.indexOf(SplittedAddress[i].trim()) === -1) {
            uniqueArray.push(SplittedAddress[i].trim());
        }
    }

    uniqueArray.forEach((s, i) => {
        if (i === uniqueArray.length - 1) {
            SteetAddress = SteetAddress + s;
        } else {
            SteetAddress = SteetAddress + s + ', ';
        }
    });

    return SteetAddress;

}

// export const removeDublicateValuesInAddress = (address, city, state, zip) => {
//     let SplittedAddress = address.split(",");
//     let SteetAddress = "";

//     SplittedAddress.map((spld, i) => {
//         if (spld.trim() === city.trim() || spld.trim() === state.trim() || spld.trim() === zip.trim()) {
//             SplittedAddress.splice(i, 1);
//         }
//     })

//     SplittedAddress.forEach((s, i) => {
//         if (i === SplittedAddress.length - 1) {
//             SteetAddress = SteetAddress + s;
//         } else {
//             SteetAddress = SteetAddress + s + ',';
//         }
//     });
// }