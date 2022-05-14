import React, { useState, useEffect } from 'react';
import {
    convertDurationToString, convertUTCToDifferentTZ,
    convertDateToDifferentTZ, differenceBetweenTwoDatesInHours, timeElapsedFromStartTime,
    differenceBetweenTwoDatesInSeconds, convertSecondsToDisplayFormat, convertSecondsToDisplayFormatInHrMM, pad,
    toFloatWithDecimal, ConvertStringToUpperCase, getDateOfSpecificTimeZone
} from '../../utility/utility';
import Oux from '../../hoc/Oux/Oux';

const TimeElapsed = (props) => {
    let { setJobCompletedTime, booking, startTimerFromZero } = props;

    let startTime = convertUTCToDifferentTZ(booking.started_at_utc, booking.address.timezone);
    let currentDate = getDateOfSpecificTimeZone(booking.address.timezone);
    let currentTimeInBookingTZ = convertUTCToDifferentTZ(convertDateToDifferentTZ(currentDate, booking.address.timezone), booking.address.timezone);
    let seconds = differenceBetweenTwoDatesInSeconds(startTime, currentTimeInBookingTZ);
    seconds = seconds < 0 ? 0 : seconds;
    if (startTimerFromZero) {
        // this is when the timer starts as soon as the job is started.
        seconds = 0
    }
    let [timeElapsed, settimeElapsed] = useState(convertSecondsToDisplayFormat(seconds))




    useEffect(() => {
        const timer = setInterval(() => {
            let seconds = 0;
            if (startTimerFromZero) {
                seconds = seconds + 1;
            } else {
                let currentDate = getDateOfSpecificTimeZone(booking.address.timezone);
                let currentTimeInBookingTZ = convertUTCToDifferentTZ(convertDateToDifferentTZ(currentDate, booking.address.timezone), booking.address.timezone);
                seconds = differenceBetweenTwoDatesInSeconds(startTime, currentTimeInBookingTZ);
                seconds = seconds < 0 ? 0 : seconds;
            }
            setJobCompletedTime(seconds);
            settimeElapsed(convertSecondsToDisplayFormat(seconds))
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []); // Pass in empty array to run effect only once!

    return (
        <Oux>{timeElapsed}</Oux>
    );
}

export default TimeElapsed;