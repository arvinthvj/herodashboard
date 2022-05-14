import React from 'react';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import NumberFormat from 'react-number-format';

export const PhoneNumberField = ({ name, value, onChange, className, placeholder, disabled, formatNumber }) => {

    return (
        <NumberFormat
            value={value}
            disabled={disabled}
            onChange={val => {

                onChange(name, val.target.value);
            }}
            // value={value}
            format={formatNumber && formatNumber !== '' ? formatNumber : "(###) ###-####"}
            className={className}
            placeholder={placeholder}
            mask="_"
        // style={(touched && error) ? { borderColor: '#f04d53', borderLeft: '3px solid #f04d53' } : null}
        />)

    // return (
    //     <PhoneInput
    //         placeholder="Enter phone number"
    //         value={value}
    //         onChange={val => { onChange(name, val) }} />
    // )

}