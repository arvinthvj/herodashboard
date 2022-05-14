import React, { useState, useRef, useEffect } from 'react';
import { hours, minutes } from '../../utility/constants/constants';
import { useDispatch, useSelector } from "react-redux";
import { contestBookingValidator } from '../../utility/validator/FormValidation/FormValidation';
import * as actions from '../../redux/actions/index';
import { convertSecondsToDisplayFormatInHrMM } from '../../utility/utility';
import PulseLoader from "react-spinners/PulseLoader";
import { Form, Formik, Field, ErrorMessage } from 'formik';
const cloneDeep = require('clone-deep');

const ContestJob = (props) => {

    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    const [isLoading, setIsLoading] = useState(false);
    const bookingObject = useSelector(state => state.clientOrHeroReducer.updateBookingObject);
    const bookingList = useSelector(state => state.clientOrHeroReducer.bookingList);
    const prevBookingList = usePrevious(bookingList);
    const dispatch = useDispatch();
    let jobCompletedTime = convertSecondsToDisplayFormatInHrMM((bookingObject.minutes_worked * 60))


    const didMountRef = useRef(false)
    useEffect(() => {
        if (didMountRef.current) {

            if ((bookingList !== prevBookingList)) {

                setIsLoading(false);
            }
        } else didMountRef.current = true
    })

    const closePopUp = () => {
        dispatch(actions.closePopUp());
    }

    const contestBooking = (values) => {
        setIsLoading(true);
        let contestTime = cloneDeep(values);

        let minutes = contestTime.minutes ? contestTime.minutes : 0;
        let hours = contestTime.hours ? contestTime.hours : 0;
        contestTime['minutes'] = parseInt(minutes) + (parseInt(hours) * 60)
        delete contestTime.hours;
        dispatch(actions.contestBooking(bookingObject.id, contestTime));
    }

    let hrs = parseInt(bookingObject.minutes_worked / 60);
    let mins = bookingObject.minutes_worked - (parseInt(bookingObject.minutes_worked / 60) * 60);
    const MiscellaneousIndex = bookingObject.order.order_items.findIndex(m => m.category === 'miscellaneous');

    return (
        <div data-backdrop="static" data-keyboard="false" className="modal fade bd-example-modal-sm avh_modal" id="alert_six" tabindex="-1" role="dialog" aria-labelledby="alert_six" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm avh_modal_sm400" role="document">
                <Formik
                    // initialValues={{ hours: hrs, minutes: mins }}
                    // unit_price: bookingObject.order.order_items[MiscellaneousIndex].unit_price
                    initialValues={{
                        hours: hrs, minutes: mins,
                        customer_unit_price: MiscellaneousIndex < 0 ? 0 : bookingObject.order.order_items[MiscellaneousIndex].unit_price,
                        notes: ''
                    }}
                    validate={contestBookingValidator}
                    onSubmit={contestBooking}
                >
                    {(formicProps) => {
                        return (
                            <Form className="modal-content">
                                <div className="modal-body">
                                    <article className="alert_box text-center">
                                        <h3>I want to contest this job</h3>
                                    </article>
                                    <div className="avh_alert_form">
                                        <div className="form-group">
                                            <h6 className="font-semi-bold mb-2">JOB: <span className="text-primary">#{bookingObject.id}</span></h6>
                                            <h8 className="font-semi-bold">{bookingObject.provider.short_name} worked for {jobCompletedTime} </h8>
                                        </div>
                                        <ErrorMessage name="hours" render={msg => <span className="error_message">{msg}</span>} />
                                        <p className="label_modify">Adjust Time:</p>
                                        <div className="btn_group mt-0 btn_group_left btn_group_select">

                                            <div className="select_time_form">
                                                <div className="form_group_mnt">
                                                    <Field as="select" className="input_modify number_font cstSelect" name="hours" id="hrs1" >
                                                        {hours.map((heroTime, i) => {
                                                            return <option value={heroTime.id}>{heroTime.name}</option>
                                                        })}
                                                    </Field>
                                                </div>
                                            </div>
                                            <div className="select_time_form">
                                                <div className="form_group_mnt">
                                                    <Field as="select" className="input_modify number_font cstSelect" name="minutes" id="mins" >
                                                        {minutes.map((heroTime, i) => {
                                                            return <option value={heroTime.id}>{heroTime.name}</option>
                                                        })}
                                                    </Field>
                                                </div>
                                            </div>
                                        </div>
                                        {MiscellaneousIndex >= 0
                                            ?
                                            <div className="form-group">
                                                <label for="Price" className="label_modify">Adjust Convenience Fee:</label>
                                                <Field type="number" min={1} max={100} autocomplete={"off"} style={{ width: '50%' }} className="input_modify conveniceFeeInputField" id="Price" name="customer_unit_price" />
                                                <ErrorMessage name="customer_unit_price" render={msg => <span className="error_message">{msg}</span>} />
                                            </div>
                                            : null}

                                        <div className="form-group">
                                            <Field as="textarea" className="input_modify textarea_modify" name="notes" id="Reason" placeholder="Reason" rows="4" />
                                            <ErrorMessage name="notes" render={msg => <span className="error_message">{msg}</span>} />
                                        </div>
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
                                            : "CONFIRM"}</button>
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

export default ContestJob;