import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const DatePickerField = ({ name, value, dateInputClicked, onChange, disabled, dateFormat, showTimeSelect, timeCaption, timeFormat, timeIntervals, minDate, className, placeholder }) => {

    return (
        <DatePicker
            minDate={minDate}
            dateFormat={dateFormat}
            placeholderText={placeholder}
            showTimeSelect={showTimeSelect}
            onInputClick={() => dateInputClicked ? dateInputClicked(onChange) : null}
            className={className}
            timeCaption={timeCaption}
            timeFormat={timeFormat}
            onChangeRaw={(e) => e.preventDefault()}
            timeIntervals={timeIntervals}
            disabled={disabled}
            selected={(value && new Date(value)) || null}
            onChange={val => {
                onChange(name, val);
            }}
        />
    );
};