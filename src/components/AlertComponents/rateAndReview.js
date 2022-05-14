import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as actions from '../../redux/actions/index';
import { reviewAndRateValidation } from '../../utility/validator/FormValidation/FormValidation';
import StarRatingComponent from 'react-star-rating-component';
import PulseLoader from "react-spinners/PulseLoader";
import { HeroProfilePicPath } from '../../utility/constants/constants';
import ReactTooltip from 'react-tooltip';

const RateAndReview = () => {

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
    // const bookingObject = useSelector(state => state.clientOrHeroReducer.updateBookingObject);

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

    const onStarClick = (val, setVal) => {
        setVal("review[rating]", val);
    }

    const addRateAndReview = (value) => {
        setIsLoading(true);
        value.favourite = value.favourite ? 'true' : ''
        dispatch(actions.addRateAndReview(bookingObject.id, value))
    }

    return (
        <div data-backdrop="static" data-keyboard="false" className="modal fade bd-example-modal-lg avh_modal" id="review_booking" tabindex="-1" role="dialog" aria-labelledby="review_booking" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg avh_modal_sm400" role="document">
                <div className="modal-content border-0">
                    <Formik
                        enableReinitialize={true}
                        initialValues={{ review: { comment: '', rating: '' }, favourite: false }}
                        validate={reviewAndRateValidation}
                        onSubmit={addRateAndReview}
                    >
                        {(formicProps) => {

                            return (
                                <Form className="card rating_card">
                                    <div className="card-header">
                                        <div className="media align-items-center">
                                            <img className="mr-3" src={"images/icons/icn_edit.svg"} alt="Generic placeholder image" />
                                            <div className="media-body">
                                                <h4 className="mt-0 mb-0">Rate & Review Your HERO</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="media align-items-center">
                                            <span className="avh_avtar mr-3">
                                                <img className="avh_avtar_img" src={bookingObject.provider.photo_urls.small ? bookingObject.provider.photo_urls.small : HeroProfilePicPath.FLYING} alt="Generic placeholder image" />
                                            </span>
                                            <div className="media-body">
                                                <h5 className="mt-0 font-semi-bold">{bookingObject.provider.short_name}</h5>
                                                <p className="review_info_list"><span className="avh_val">{bookingObject.address.formatted_address}</span> </p>
                                            </div>
                                        </div>
                                        <form className="rating_form">
                                            <ErrorMessage name="review[rating]" render={msg => <span className="error_message">{msg}</span>} />
                                            <div className="rating_list form-group" style={{ marginTop: '0px' }}>
                                                <StarRatingComponent
                                                    name="review[rating]"
                                                    starCount={5}
                                                    className={"Rating"}
                                                    starColor={"#FECB2F"}
                                                    // editing={false}
                                                    // value={rating}
                                                    onStarClick={(val) => onStarClick(val, formicProps.setFieldValue)}
                                                />
                                                {/* <a href="javascript:void(0)"><i className="fa fa-star-o"></i> </a>
                                    <a href="javascript:void(0)"><i className="fa fa-star-o"></i> </a>
                                    <a href="javascript:void(0)"><i className="fa fa-star-o"></i> </a>
                                    <a href="javascript:void(0)"><i className="fa fa-star-o"></i> </a>
                                    <a href="javascript:void(0)"><i className="fa fa-star-o"></i> </a> */}
                                            </div>
                                            <div className="form-group">
                                                <Field type="text" name="review[comment]" className="input_modify input_border_btm" placeholder="Describe your experience" />
                                            </div>

                                            <div class="form-group">
                                                <ReactTooltip
                                                    watchWindow={true}
                                                    globalEventOff="click"
                                                    data-multiline={true}
                                                    wrapper="span"
                                                    className="tooltip-custom"
                                                    html={true}
                                                />
                                                <span class="para_fav font-semi-bold">
                                                    <Field className='red-heart-checkbox' id='red-check1' name="favourite" type='checkbox' />
                                                    <label for='red-check1'>Would you like to favorite the HERO?</label> <img className="toolTipInfoClass pointer_cursor" data-tip={"Favorite a HERO to easily request them for future jobs."}
                                                        data-event='click focus' src="/images/icons/info.svg" /></span>
                                            </div>
                                            {/* <div className="label_flex makeFlex FlexHrCenter FlexVrCenter">
                                    <span className="avh_label">Would you like to favorite the HERO?</span>
                                    <div className="cta_btns_block">
                                        <a href="javascript:void(0)" className="theme_btn theme_outline_primary">Yes</a>
                                        <a href="javascript:void(0)" className="theme_btn theme_outline_primary">No</a>
                                    </div>
                                </div> */}
                                        </form>

                                    </div>
                                    <div className="card-footer text-muted text-right">
                                        <button className="theme_btn theme_primary">
                                            {isLoading ?
                                                <PulseLoader
                                                    sizeUnit={"px"}
                                                    size={5}
                                                    color={'white'}
                                                    loading={isLoading} />
                                                : "CONFIRM"}
                                        </button>
                                        <button onClick={closePopUp} className="theme_btn theme_outline_primary" data-dismiss="modal">Cancel</button>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default RateAndReview;