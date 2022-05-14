import React, { useState, useRef, useEffect } from 'react';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from "react-redux";
import { DatePickerField } from '../UI/StarRating/DatePicker';
import * as actions from '../../redux/actions/index';
import { rescheduleDateTimeValidation } from '../../utility/validator/FormValidation/FormValidation';
import PulseLoader from "react-spinners/PulseLoader";
import { convertDateToDifferentTZ, convertUTCToDifferentTZ } from '../../utility/utility';
import { PhoneNumberField } from '../UI/StarRating/PhoneNumberField';
import { roles } from '../../utility/constants/constants';
import moment from 'moment';

const cloneDeep = require('clone-deep');

const RescheduleBookingOrJob = (props) => {

    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    const [isLoading, setIsLoading] = useState(false);
    const bookingObject = useSelector(state => state.clientOrHeroReducer.updateBookingObject);
    const user = useSelector(state => state.authReducer.user);
    const bookingList = useSelector(state => state.clientOrHeroReducer.bookingList);
    const prevBookingList = usePrevious(bookingList);
    const [isProvider, serIsProvider] = useState(bookingObject && bookingObject.provider ? bookingObject.provider.id !== bookingObject.rescheduled_by_id : true)
    const dispatch = useDispatch();

    const didMountRef = useRef(false)
    useEffect(() => {
        if (didMountRef.current) {

            if ((bookingList !== prevBookingList)) {

                setIsLoading(false);
            }
        } else didMountRef.current = true
    })

    const rescheduleJob = (values) => {
        setIsLoading(true);
        let booking = cloneDeep(values);
        booking.rescheduled_at = moment(booking.rescheduled_at).format('YYYY-MM-DDTHH:mm::ss[Z]')
        dispatch(actions.rescheduleJob(bookingObject.id, booking, props.selectedFilter))
    }

    const closePopUp = () => {
        dispatch(actions.closePopUp());
    }

    return (
        <div data-backdrop="static" data-keyboard="false" className="modal fade bd-example-modal-sm avh_modal" id="alert_one" tabindex="-1" role="dialog" aria-labelledby="alert_one" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm avh_modal_sm400" role="document">
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        rescheduled_at: bookingObject ?
                            convertUTCToDifferentTZ(bookingObject.rescheduled_at_utc ? bookingObject.rescheduled_at_utc : bookingObject.scheduled_at_utc, bookingObject.address.timezone)
                            : null,
                        point_of_contact: bookingObject ? bookingObject.point_of_contact : '',
                        phone: bookingObject ? bookingObject.phone : ''
                    }}
                    validate={(values) => rescheduleDateTimeValidation(values, user, bookingObject)}
                    onSubmit={rescheduleJob}
                >
                    {(formikProps) => {
                        const errors = formikProps.errors
                        const touched = formikProps.touched
                        let contactName = null
                        if (user.role === roles.service_provider && bookingObject) {
                            if (bookingObject.client.full_name) {
                                contactName = bookingObject.client.full_name
                            }
                            else {
                                contactName = bookingObject.client.short_name
                            }
                        }
                        console.log(bookingObject, "bookingobject")
                        return (
                            <Form className="modal-content">
                                <div className="modal-body">
                                    <article className="alert_box text-center">
                                        <h3>Do you need to change date/time?</h3>
                                        {bookingObject && bookingObject.client.company_name ? <h6 className="font-semi-bold mb-2">Company Name : <span className="text-primary">{bookingObject.client.company_name}</span></h6> : null}
                                        {contactName
                                            ? <h6 className="font-semi-bold mb-2">Contact Name : <span className="text-primary">
                                                {contactName}
                                            </span>
                                            </h6>
                                            : null
                                        }
                                        <h6 className="font-semi-bold mb-2">JOB: <span className="text-primary">#{bookingObject.id}</span></h6>
                                        {/* <p>{bookingObject ? bookingObject.address.formatted_address : ''}</p> */}
                                    </article>
                                    <div className="avh_alert_form">
                                        <div className="form-group">
                                            <label for="select_date" className="label_modify">Select Date & Time</label>
                                            <DatePickerField
                                                name="rescheduled_at"
                                                minDate={new Date()}
                                                dateFormat="MM-dd-yyyy h:mm aa"
                                                showTimeSelect={true}
                                                placeholder="DATE/TIME"
                                                // dateInputClicked={dateInputClicked}
                                                timeCaption="time"
                                                timeFormat="hh:mm aa"
                                                timeIntervals={15}
                                                className={"input_modify"}
                                                // disabled={formikProps.values.asap}
                                                value={formikProps.values.rescheduled_at}
                                                onChange={formikProps.setFieldValue}
                                            />
                                            <br />
                                            <ErrorMessage name="rescheduled_at" render={msg => <span className="error_message">{msg}</span>} />
                                            {/* <input type="date" className="input_modify" id="select_date" value="November 22 2019 , 10:00 AM" /> */}
                                        </div>
                                        {user.role === roles.client ?
                                            <>
                                                <div className="form-group">
                                                    <label for="select_date" className="label_modify">Point of contact</label>
                                                    <Field disabled={isProvider} name="point_of_contact" id="point_cont" type="text" className={isProvider ? "input_modify input_modify_lg disable_class" : errors.point_of_contact && touched.point_of_contact ? "input_modify input_modify_lg error_className" : "input_modify input_modify_lg"} placeholder="Type here" />
                                                    {/* <span className="error_message">{errors.point_of_contact && touched.point_of_contact && errors.point_of_contact}</span> */}
                                                    <ErrorMessage name="point_of_contact" render={msg => <span className="error_message">{msg}</span>} />
                                                    {/* <input type="text" className="input_modify" id="select_date" value="Point of contact" /> */}
                                                </div>
                                                <div className="form-group">
                                                    <label for="select_date" className="label_modify">Contact Number</label>
                                                    <PhoneNumberField
                                                        disabled={isProvider}
                                                        value={formikProps.values.phone}
                                                        onChange={formikProps.setFieldValue}
                                                        className={isProvider ? "input_modify input_modify_lg disable_class" : errors.phone && touched.phone ? "input_modify input_modify_lg error_className" : "input_modify input_modify_lg"}
                                                        name="phone"
                                                        placeholder="Add a number" />
                                                    <ErrorMessage name="phone" render={msg => <span className="error_message">{msg}</span>} />
                                                    {/* <input type="text" className="input_modify" id="select_date" value="Contact Number" /> */}
                                                </div>
                                            </>
                                            : null}
                                    </div>
                                    <div className="avh_seprator avh_sep_xl"></div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="theme_btn theme_primary btn_primary_shad">
                                        {isLoading ?
                                            <PulseLoader
                                                sizeUnit={"px"}
                                                size={5}
                                                color={'white'}
                                                loading={isLoading} />
                                            : "CONFIRM"}
                                    </button>
                                    <button type="button" onClick={closePopUp} className="theme_btn theme_outline_primary " data-dismiss="modal">CANCEL</button>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )
}

export default RescheduleBookingOrJob;