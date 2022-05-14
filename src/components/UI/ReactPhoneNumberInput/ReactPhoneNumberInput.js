import React from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useState } from 'react'
import './ReactPhoneNumberInput.css'
import { errorStyle, PhNoPattern } from '../../../utility/constants/constants'

const ReactPhoneNumberInput = props => {
    // const [phoneNumber, setPhoneNumber] = useState('')

    console.log(props.phoneValue)

    const onChangePhoneNumber = (phone, data, event) => {
        if (Object.keys(data).length > 0) {
            // setPhoneNumber("+" + data.dialCode + phone)
            phone = phone.replace(/[^0-9]+/g, '').slice(data.dialCode.length)
            // Order matters - setFiledtouched should be called before setFieldValue. For every SetField Validation will be called
            if (!props.touched) {
                props.setFieldTouched('phone', true)
            }
            props.setFieldValue('country_code', data.countryCode.toUpperCase());
            props.setFieldValue('phone', data.dialCode + phone);
        }
    }

    return (
        <PhoneInput
            country={'us'}
            value={props.phoneValue}
            inputProps={{
                className: props.className,
                onBlur: props.blurHandler,
                style: props.errors.phone && props.touched ? errorStyle : null,
                disabled: props.disabled
            }}
            enableSearch={true}
            countryCodeEditable={true}
            buttonClass={props.dropDownClassName ? props.dropDownClassName : "default_flag_dropdown"}
            onChange={(value, data, event) => onChangePhoneNumber(value, data, event)}
        />
    )
}

export default ReactPhoneNumberInput