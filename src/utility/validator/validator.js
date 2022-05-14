
import { EMAIL_REGEXP, URL_REGEXP, PhNoPattern } from '../constants/constants';
// import { services, styles } from '../constants/constants';
import { DiffrenceInYear } from '../diffrenceBtweenDates';
import store from '../../redux/store/store';
import moment from 'moment';
import { UserRoles } from '../constants/constants';

export function loginValidator(values) {
    const errors = {};
    errors['user'] = {};
    console.log("In validate" + values);

    if (values['user']) {
        if (!values['user']['email']) {
            errors['user']['email'] = 'This field is required.';
        } else if (!EMAIL_REGEXP.test(values['user']['email'])) {
            errors['user']['email'] = 'Email must be valid';
        }

        if (!values['user']['password']) {
            errors['user']['password'] = 'This field is required.';
        }

        console.log("errors" + errors.email);

    } else {
        errors['user']['email'] = 'This field is required.';
    }
    console.log(errors);
    return errors;
};


export function signupValidator(values) {
    let errors = {};
    errors['user'] = {};
    console.log("In validate" + values);
    if (values['user']) {
        if (!values['user']['first_name']) {
            errors['user']['first_name'] = 'This field is required.'
        }
        else if (values['user']['first_name'].length < 3) {
            errors['user']['first_name'] = 'First name is too short.'
        }

        if (!values['user']['last_name']) {
            errors['user']['last_name'] = 'This field is required.'
        } else if (values['user']['last_name'].length < 3) {
            errors['user']['last_name'] = 'Last name is too short.'
        }
        if (!values['user']['email']) {
            errors['user']['email'] = 'This field is required.';
        } else if (!EMAIL_REGEXP.test(values['user']['email'])) {
            errors['user']['email'] = 'Email must be valid';
        }
        console.log("In validate if");

        if (!values['user']['password']) {
            errors['user']['password'] = 'This field is required.';
        } else if (values['user']['password'].length < 6) {
            errors['user']['password'] = 'password is too short.';
        }

        if (!values['user']['confirm_password']) {
            errors['user']['confirm_password'] = 'Confirm Password is required';
        } else if (values['user']['confirm_password'] !== values['user']['password']) {
            errors['user']['confirm_password'] = 'Passwords do not match!';
        }

        if(!values['user']['termsAndPolicy']) {
            errors['user']['termsAndPolicy'] = ' '
        }
        if(!values['recaptcha']){
            errors['recaptcha'] = 'Please Verify reCaptcha';
        }
        // if (!values['user']['dob']) {
        //     errors.dob = "this field is required."
        // } else {

        //     const currentDate = new Date();
        //     let date = new Date(values['user']['dob']);
        //     const years = DiffrenceInYear(currentDate, date);
        //     if (years < 13) {
        //         errors['user']['dob'] = "You need to be at least 13 years old to sign up."
        //     }

        // }
        // else if (values['password'].length < PASSWORD_MIN_LEN) {
        //     errors['password'] = `Password length should be at lease ${PASSWORD_MIN_LEN} symbols`;
        // }
        console.log("errors" + errors.email);

    } else {
        errors['user']['email'] = 'This field is required.';
    }
    console.log(errors);
    return errors;
};

export function forgotPasswordValidator(values) {
    const errors = {};
    errors['user'] = {};
    console.log("In validate" + values);

    if (values['user']) {
        if (!values['user']['email']) {
            errors['user']['email'] = 'Enter a valid email';
        } else if (!EMAIL_REGEXP.test(values['user']['email'])) {
            errors['user']['email'] = 'Email must be valid';
        }
        console.log("errors" + errors.email);

    } else {
        errors['user']['email'] = 'Enter a valid email';
    }
    console.log(errors);
    return errors;
};

export function resetPasswordValidator(values) {
    let errors = {};
    errors['user'] = {};
    console.log("In validate" + values);
    if (values['user']) {
        console.log("In validate if");

        if (!values['user']['password']) {
            errors['user']['password'] = 'This field is required.';
        } else if (values['user']['password'].length < 6) {
            errors['user']['password'] = 'password is too short.';
        }

        if (!values['user']['password_confirmation']) {
            errors['user']['password_confirmation'] = 'Confirm Password is required';
        } else if (values['user']['password_confirmation'] !== values['user']['password']) {
            errors['user']['password_confirmation'] = 'Passwords do not match!';
        }

        // if (!values['user']['dob']) {
        //     errors.dob = "this field is required."
        // } else {

        //     const currentDate = new Date();
        //     let date = new Date(values['user']['dob']);
        //     const years = DiffrenceInYear(currentDate, date);
        //     if (years < 13) {
        //         errors['user']['dob'] = "You need to be at least 13 years old to sign up."
        //     }

        // }
        // else if (values['password'].length < PASSWORD_MIN_LEN) {
        //     errors['password'] = `Password length should be at lease ${PASSWORD_MIN_LEN} symbols`;
        // }
        console.log("errors" + errors.email);

    } else {
        errors['user']['password'] = 'This field is required.';
        errors['user']['password_confirmation'] = 'This field is required.';

    }
    console.log(errors);
    return errors;
};

export const personalDetailForm = (values) => {
    let errors = {};

    if (!values.first_name) {
        errors.first_name = "this field is required"
    }
    if (!values.last_name) {
        errors.last_name = 'this field is required'
    }

    // if (!values.email) {
    //     errors.email = 'this field is required'
    // } else if (!EMAIL_REGEXP.test(values.email)) {
    //     errors.email = 'Email must be valid';
    // }
    if (!values.gender) {
        errors.gender = 'please select a gender'
    }
    // if (!values.phone) {
    //     errors.phone = 'this field is required.'
    // }
    // else if (!PhNoPattern.test(values.phone)) {
    //     errors.phone = 'please match the format'
    // }


    if (!values.dob) {
        errors.dob = "this field is required."
    } else {
        const currentDate = new Date();
        let date = new Date(values.dob);
        const years = DiffrenceInYear(currentDate, date);
        if (years < 13) {
            errors.dob = "You need to be at least 13 years old to continue."
        }
    }
    return errors;
}

export const addressForm = (values) => {

    let errors = {}
    if (values.zip) {

        if (!values.zip) {
            errors.zip = 'this field is required.'
        }
    }


    return errors;
}

export const selectServiceForm = (values) => {
    //   
    let errors = {}

    return errors;
}

export const priceAndTimeSlot = (values) => {
    let errors = {};

    if (!values.price) {
        errors.price = ' '
    } else if (values.price <= 0) {
        values.price = '';
    } else {
        values.price = parseInt(values.price)
    }


    if (!values.min_booking_minutes) {
        errors.min_booking_minutes = ' '
    }

    return errors;
}

export function urlValidator(values) {
    let errors = {};
    if (!values['url'] || values['url'].length == 0) {
        errors['message'] = 'URL is required';
    } else if (!URL_REGEXP.test(values['url'])) {
        errors['message'] = 'URL must be valid';
    }

    return errors
}

export const serviceProfileEditValidator = (values, props) => {
    let errors = {};
    errors['user'] = {};
    if (!values.first_name) {
        errors.first_name = "this field is required"
    }
    if (!values.last_name) {
        errors.last_name = 'this field is required'
    }

    if (!values.email) {
        errors.email = 'this field is required'
    } else if (!EMAIL_REGEXP.test(values.email)) {
        errors.email = 'Email must be valid';
    }
    if (!values.gender) {
        errors.gender = 'please select a gender'
    }
    // if (!values.phone  && props.initialValues.role === UserRoles.service_provider) {
    //     errors.phone = 'this field is required.'
    // } else if (!PhNoPattern.test(values.phone)  && props.initialValues.role === UserRoles.service_provider) {
    //     errors.phone = 'please match the format'
    // }        
    if (!values.dob) {
        errors.dob = "this field is required"
    } else if (props.initialValues.role === UserRoles.service_provider) {
        let year = moment().diff(values.dob, 'years', false);
        if (year < 14) {
            errors.dob = "You need to be at least 13 years old to sign up."
        }
    }
    // if (!values.about_me && props.initialValues.role === UserRoles.service_provider) {
    //     errors.about_me = "this field is required"
    // }

    return errors
}

export const orderContactInformation = (values) => {

    let errors = {};
    ;
    return errors;
}

export const changePasswordFormValidator = (values) => {
    let errors = {};
    if (!values.current_password) {
        errors.current_password = 'This field is required.';
    }
    if (!values.password) {
        errors.password = 'This field is required.';
    } else if (values.password.length < 6) {
        errors.password = 'password is too short.';
    }

    if (!values.password_confirmation) {
        errors.password_confirmation = 'Confirm Password is required';
    } else if (values.password_confirmation !== values.password) {
        errors.password_confirmation = 'Passwords do not match!';
    }
    return errors
}

export const referFormValidation = (values) => {
    let errors = {};
    if (!values.email) {
        errors.email = 'This field is required.';
    }
    return errors
}
