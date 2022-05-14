import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { bookingCancelClicked } from '../../api/bookingAPI';
import { CancelBookingValidation } from '../../utility/validator/FormValidation/FormValidation';
import * as actions from '../../redux/actions/index';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import $ from "jquery";
import PulseLoader from "react-spinners/PulseLoader";
import { roles } from '../../utility/constants/constants';
const cloneDeep = require('clone-deep');

const Tbdpopup = (props) => {

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
    const settings = useSelector(state => state.configReducer.settings);
    const user = useSelector(state => state.authReducer.user);
    const dispatch = useDispatch();

    const didMountRef = useRef(false)
    useEffect(() => {
        if (didMountRef.current) {

            if ((bookingList !== prevBookingList)) {

                setIsLoading(false);
            }
        } else didMountRef.current = true
    })

    let ReasonList = [];

    const closePopUp = () => {
        dispatch(actions.closePopUp());
    }

    if (user.role === roles.service_provider) {
        ReasonList = cloneDeep(settings.cancellation_reasons.hero);
    } else {
        ReasonList = cloneDeep(settings.cancellation_reasons.client);
    }

    const bookingCancelClicked = (values) => {
        setIsLoading(true);
        dispatch(actions.bookingCancelClicked(bookingObject.id, values))
    }

    const reasons = () => {
        return ReasonList.map((reason, i) => {
            return (<label className="avh_rado_container" key={i}>{reason}
                <Field type="radio" name="reason" value={reason} key={i} />
                <span className="avh_rado_checkmark"></span>
            </label>)
        })
    }

    return (
        <div data-backdrop="static" data-keyboard="false" className="modal fade bd-example-modal-sm avh_modal" id="alert_seven" tabindex="-1" role="dialog" aria-labelledby="alert_seven" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm avh_modal_sm400" role="document">

               

                 <Formik
                    initialValues={{ reason: '', description: '' }}
                    validate={CancelBookingValidation}
                    onSubmit={bookingCancelClicked}
                >
                    {(formicProps) => (
                        <Form className="modal-content">
                            <div className="modal-body">
                                <article className="alert_box text-center">
                                    <h3>Please Contact customer to establish arrival time
                                    </h3>
                                </article>
                                
                                <div className="avh_seprator avh_sep_xl"></div>
                            </div>
                            <div className="modal-footer">
                               
                                <button type="button" onClick={closePopUp} className="theme_btn theme_outline_primary modal_btns_w" data-dismiss="modal">CANCEL</button>
                            </div>
                        </Form>
                    )}
                </Formik> 
            </div>
        </div>
    )

}

export default Tbdpopup;