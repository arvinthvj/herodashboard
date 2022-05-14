import * as Yup from 'yup';
import { convertTZToJobCardTime, hasLetter, convertUTCToDifferentTZ } from '../../utility';
import { PhNoPattern, EMAIL_REGEXP, roles, TypesOfIssues } from '../../constants/constants'
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const validateLoginForm =
    Yup.object().shape({
        email: Yup.string().email('Please Enter a Valid Email').required('This field is required').nullable(),
        password: Yup.string().min(6, "6 char long").required("This field is required").nullable(),
    })

export const validateRegisterHeroForm =
    Yup.object().shape({
        email: Yup.string().email('Please Enter a Valid Email').required('This field is required').nullable(),
        password: Yup.string().min(6, "Minimum 6 char").required("This field is required").nullable(),
        first_name: Yup.string().required('This field is required').nullable(),
        last_name: Yup.string().required('This field is required').nullable(),
        // phone: Yup.string().required('This field is required').nullable(),
        register_checkbox: Yup.bool()
            .test(
                'register_checkbox',
                'You must agree to AV HERO’s Terms of Use & Privacy Policy in order to proceed',
                value => value === true
            ).required('You must agree to AV HERO’s Terms of Use & Privacy Policy in order to proceed')
    })

export const validateRegisterClientForm =
    Yup.object().shape({
        email: Yup.string().email('Please Enter a Valid Email').required('This field is required').nullable(),
        password: Yup.string().min(6, "Minimum 6 char").required("This field is required").nullable(),
        first_name: Yup.string().required('This field is required').nullable(),
        last_name: Yup.string().required('This field is required').nullable(),
        company_name: Yup.string().nullable(),
        // phone: Yup.string().required('This field is required').nullable(),
        register_checkbox: Yup.bool()
            .test(
                'register_checkbox',
                'You must agree to AV HERO’s Terms of Use & Privacy Policy in order to proceed',
                value => value === true
            ).required('You must agree to AV HERO’s Terms of Use & Privacy Policy in order to proceed')
    })

/* Field Level Validation Starts Here */

export const validate_email_field = (value) => {
    let error;
    if (!value || value === '') {
        error = "This field is required"
    }
    else if (!EMAIL_REGEXP.test(value)) {
        error = "Please enter a valid email"
    }
    return error
}

export const validate_otp_code = (value) => {
    let error;
    if (!value || value === '') {
        error = "This field is required"
    }
    else if (value.match(/[a-zA-Z]/) || value.match(/\W|_/g)) {
        error = "OTP can have numbers only"
    }
    else if (value.toString().length < 5 || value.toString().length > 5) {
        error = "Please enter a valid 5 digit OTP sent to your phone"
    }
    return error
}

export const validate_mobile_number = (value) => {
    let error;

    if (!value || value === '') {
        error = "This field is required"
    }
    return error
}

export const validate_company_name = (value) => {
    let error;
    if (!value || value === '') {
        error = "This field is required"
    }
    return error
}

export const validate_custom_phone_number_field = (value) => {
    let error = null;
    if (!value || value === '') {
        error = "This field is required"
    }
    else {
        let parsedPhoneNumber = null
        if (value.includes('+')) {
            parsedPhoneNumber = parsePhoneNumberFromString(value)
        }
        else {
            parsedPhoneNumber = parsePhoneNumberFromString("+" + value)
        }
        if (parsedPhoneNumber) {
            console.log(parsedPhoneNumber.nationalNumber.length, "length")
            if (parsedPhoneNumber.nationalNumber.length !== 10) {
                error = "Please enter a valid mobile number"
            }
        }
        else {
            error = "Please enter a valid mobile number"
        }
    }
    return error
}


export const SelectIssuesAndTimeValidation = (values, services, b) => {
    const errors = {};
    // const SelectedIssues = [];
    var curretnDate = new Date();
    // const othersIndex = services.findIndex(service => service.name === TypesOfIssues.OTHER);

    //  
    if (values) {
        let issuesIndex = values.services.findIndex(issue => issue);

        // if (issuesIndex > -1) {

        //     values.services.forEach((service, i) => {
        //         if (service) {
        //             SelectedIssues.push(i);
        //         }
        //     })
        // }
        //  
        if (issuesIndex === -1 && (!values.asap && !values.scheduled_at)) {
            errors.services = 'Please select at least one service and date.';
        }
        //  else if (SelectedIssues.indexOf(services[othersIndex].id) > -1) {
        //     //  
        //     values.services.map((service, i) => {
        //         if (i !== services[othersIndex].id) {
        //             values.services[i] = false;
        //         }
        //     })
        // } 
        else {
            if (issuesIndex === -1) {
                //  
                errors.services = 'Please select at least one service.'
            } else {
                services.map(service => {
                    if ((service.name === TypesOfIssues.OTHER) && (values.services[`${service.id}`]) && (!values.description)) {
                        errors.description = 'This field is required.'
                    }
                })
            }
            //  
            if (!values.asap && !values.scheduled_at) {
                errors.scheduled_at = "Please select ASAP or request a FUTURE time."
            }
        }

        if(!values.description) {
            errors.description = "Please provide details..."   
        }

        if (!values.asap) {
            curretnDate.setHours(curretnDate.getHours() + 2);
            if (values.scheduled_at && values.scheduled_at < curretnDate) {
                errors.scheduled_at = `Future booking can only be created two hours from current time. Please create ASAP booking.`
                // ${convertTZToJobCardTime(curretnDate)}
            }
        }
        // else {
        //     if (values.scheduled_at && values.scheduled_at < curretnDate) {
        //         errors.scheduled_at = "Selected Time must be greater than current time."
        //     }
        // }

    } else {
        errors.description = "Please provide details...";
        errors.services = 'Please select at least one service';
    }
    //  
    return errors;
}

export const LocationAndPaymentDetailsValidation = (values, props) => {
    const errors = {};
    //  

    if (values) {
        if (!values.address) {
            errors.address = 'Address is required.'
        }
        if (!values.phone) {
            errors.phone = 'Contact is required.'
        }
        if (!values.point_of_contact) {
            errors.point_of_contact = 'Point of contact is required.'
        }
        // if (!values.card) {
        //     errors.card = "Please add Card Details."
        // }
    } else {
        // errors.card = "Please add Card Details."
        errors.point_of_contact = 'Point of contact is required.'
        errors.phone = 'Contact is required.'
        errors.address = 'Address is required.'
    }
    //  
    return errors;
}

export const ReviewAndConfirmValidation = (values) => {
    const errors = {};
    if (values) {

        if (values.preferred_provider_id && values.preferred_provider_id.length > 1) {
            values.preferred_provider_id.splice(0, 1);
        }
    }
    return errors;
}

export const rescheduleDateTimeValidation = (values, user, bookingObject) => {
    const errors = {};
    if (values) {
        var curretnDate = new Date();
        curretnDate.setHours(curretnDate.getHours() + 2);
        const bookingDateAndTime = convertUTCToDifferentTZ(bookingObject.rescheduled_at_utc ? bookingObject.rescheduled_at_utc : bookingObject.scheduled_at_utc, bookingObject.address.timezone)

        if (!values.rescheduled_at) {
            errors.rescheduled_at = 'Reschedule date is required.'
        } else if (values.rescheduled_at.getTime() === bookingDateAndTime.getTime()) {
            errors.rescheduled_at = 'Please select different date or time.'
        } else if (values.rescheduled_at < curretnDate) {
            errors.scheduled_at = `Future booking can only be created two hours from current time. Please create ASAP booking.`
            // ${convertTZToJobCardTime(curretnDate)}
        }


        if (user.role === roles.client) {
            if (!values.phone) {
                errors.phone = 'Contact number is required.'
            }
            if (!values.point_of_contact) {
                errors.point_of_contact = 'Point of contact is required.'
            }
        }
        // if (!values.card) {
        //     errors.card = "Please add Card Details."
        // }
    } else {
        // errors.card = "Please add Card Details."
        errors.rescheduled_at = 'Reschedule date is required.'
        if (user.role === roles.client) {
            errors.point_of_contact = 'Point of contact is required.'
            errors.phone = 'Contact number is required.'
        }
    }
    return errors;
}

export const contestBookingValidator = (values) => {
    const errors = {};

    if (values) {
        if (!values.hours && !values.minutes) {
            errors.hours = 'Please select time';
        }
        if (!values.notes) {
            errors.notes = 'This field is required.';
        }
        if ((values.customer_unit_price) && values.customer_unit_price > 100) {
            errors.customer_unit_price = 'Convenience Fee can not exceed $100.00';
        } else if ((values.customer_unit_price) && values.customer_unit_price < 1) {
            errors.customer_unit_price = 'Convenience Fee can not less than $1.00';
        }
    } else {
        errors.notes = 'This field is required.';
        errors.hours = 'Please select time';
    }

    return errors;
}

export const miscellaneousCostValidation = (values) => {
    const errors = {};

    if (values) {

        if (!values.order_item.unit_price) {
            errors.order_item = {};
            errors.order_item.unit_price = `This field is required.`
        } else if (values.order_item.unit_price > 100) {
            errors.order_item = {};
            errors.order_item.unit_price = `Convenience Fee cannot exceed $100.00`
        } else if (values.order_item.unit_price < 1) {
            errors.order_item = {};
            errors.order_item.unit_price = `Convenience Fee cannot less than $1.00`
        }
        // else if (hasLetter(values.order_item.unit_price)) {
        //     errors.order_item = {};
        //     errors.order_item.unit_price = `Please add valid amount.`
        // }

        // if (!values.description) {
        //     errors.description = `This field is required.`
        // }

    } else {
        errors.order_item = {};
        errors.order_item.unit_price = `This field is required.`;
        // errors.description = `This field is required.`;
    }

    return errors;
}

export const reviewAndRateValidation = (values) => {
    const errors = {};

    if (values) {

        if (!values.review.rating) {
            errors.review = {};
            errors.review.rating = 'Please rate the Hero.'
        }
    }

    return errors;
}

export const CancelBookingValidation = (values) => {
    const errors = {};

    if (values) {
        if (!values.description) {
            errors.description = 'Please provide additional information'
        }
    } else {
        errors.description = 'Please provide additional information'
    }
    return errors;
}
/* Field Level Validation Ends Here */

// export const validateCreditCardForm =
//     Yup.object().shape({
//         card_number: Yup.string().matches(/^[0-9\s]+$/, "Card number should be in digits only").required("This field is required").nullable(),
//         expiry_date: Yup.string().required("This field is required").nullable(),
//         cvv: Yup.string().matches(/^[0-9\s]+$/, "CVV should be in digits only").required("This field is required").nullable()
//     })

export const validateClientProfileForm =
    Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').nullable(),
        first_name: Yup.string().required('This field is required'),
        last_name: Yup.string().required('This field is required'),
        // phone: Yup.string().required('This field is required'),
        // address_attributes: Yup.string().matches(/^[0-9\s]+$/, "Zip code should be in digits only").nullable()
        address_attributes: Yup.object().shape({
            zip: Yup.string().matches(/^[0-9\s]+$/, "Zip code should be in digits only").min(2, "Invalid zip code").max(6, "Invalid zip code").nullable()
        })
    })
export const validateHeroProfileForm =
    Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').nullable(),
        first_name: Yup.string().required('This field is required'),
        last_name: Yup.string().required('This field is required'),
        // phone: Yup.string().required('This field is required'),
        address_attributes: Yup.object().shape({
            street_address: Yup.string().required('This field is required'),
            zip: Yup.string().matches(/^[0-9\s]+$/, "Zip code should be in digits only").required('This field is required')
                .min(2, "Invalid zip code").max(6, "Invalid zip code").nullable()
        })
    })

export const validateChangePassword =
    Yup.object().shape({
        current_password: Yup.string().min(6, "6 char long").required("This field is required").nullable(),
        password: Yup.string().min(6, "6 char long").required('This field is required').nullable(),
        password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], "Password does not match").required('This field is required').nullable(),
    })

export const validateAdditionalInformationForm =
    Yup.object().shape({
        address_attributes: Yup.object().shape({
            street_address: Yup.string().required('This field is required').nullable(),
            zip: Yup.string().matches(/^[0-9\s]+$/, "Zip code should be in digits only").required('This field is required')
                .test(
                    'zip',
                    'Invalid zip code',
                    val => val && val.length <= 6
                ).nullable(),
            // city: Yup.string().required('This field is required').nullable(),
            // state: Yup.string().required('This field is required').nullable(),
        })
    })

