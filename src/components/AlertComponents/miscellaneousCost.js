import React, { useState, useRef, useEffect } from 'react';
import * as actions from '../../redux/actions/index';
import PulseLoader from "react-spinners/PulseLoader";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeFirstLetter, toastMsg } from '../../utility/utility';
import { miscellaneousCostValidation } from '../../utility/validator/FormValidation/FormValidation';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import { decode, encode } from 'base64-arraybuffer';
import imageCompression from 'browser-image-compression';
import ImageLoader from 'react-imageloader';
import { resetOrientationUsingHooks } from '../../utility/utility';
const cloneDeep = require('clone-deep');

const MiscellaneousCost = (props) => {

    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    const [isLoading, setIsLoading] = useState(false);
    const [extension, setExtension] = useState(null);
    const [base64, setBase64] = useState(null);
    const bookingObject = useSelector(state => state.clientOrHeroReducer.updateBookingObject);
    const user = useSelector(state => state.authReducer.user);
    const bookingList = useSelector(state => state.clientOrHeroReducer.bookingList);
    const prevBookingList = usePrevious(bookingList);
    const dispatch = useDispatch();
    const didMountRef = useRef(false)

    const MiscellaneousIndex = bookingObject.order.order_items.findIndex(m => m.category === 'miscellaneous');
    const isEdit = (MiscellaneousIndex > -1) ? true : false;
    useEffect(() => {
        if (didMountRef.current) {

            if ((bookingList !== prevBookingList)) {

                setIsLoading(false);
            }
        } else didMountRef.current = true
    })

    const addMiscellaneousCost = (values) => {
        setIsLoading(true);
        let orderItem = cloneDeep(values);

        if (base64) {
            const image = base64.split(',');
            const arrayBuffer = decode(image[1]);
            if (isEdit) {
                dispatch(actions.addMiscellaneousCostWithImage(bookingObject.id,
                    orderItem,
                    arrayBuffer,
                    extension,
                    bookingObject.order.order_items[MiscellaneousIndex].id
                ))
            } else {
                dispatch(actions.addMiscellaneousCostWithImage(bookingObject.id, orderItem, arrayBuffer, extension))
            }
        } else {
            if (isEdit) {
                dispatch(actions.updateMiscellaneousCost(
                    bookingObject.id,
                    orderItem,
                    bookingObject.order.order_items[MiscellaneousIndex].id
                ))
            } else {
                dispatch(actions.addMiscellaneousCost(bookingObject.id, orderItem))
            }
        }

    }

    const closePopUp = () => {
        dispatch(actions.closePopUp());
    }

    const onFileChange = async (e) => {

        let reader = new FileReader();
        let file = e.target.files[0];
        let type = file.type
        if (["image/png", "image/jpeg", "image/jpg"].includes(type)) {
            const orientation = await imageCompression.getExifOrientation(file);

            reader.onloadend = () => {
                resetOrientationUsingHooks(reader.result, orientation, setBase64);
                // setBase64(reader.result);
                setExtension(file.name.split('.').pop().toLowerCase());
            }
            reader.readAsDataURL(file)
        }
        else {
            toastMsg("Please upload a valid image file!", true)
            e.target.value = ""
        }
    }


    function preloader() {
        return <img style={{ width: '50%', height: '50%' }} src="/images/gif/giphy.gif" />;
    }

    return (
        <div data-backdrop="static" data-keyboard="false" className="modal fade bd-example-modal-sm avh_modal" id="alert_miscellaneous" tabindex="-1" role="dialog" aria-labelledby="alert_miscellaneous" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm avh_modal_sm400" role="document">
                <Formik
                    enableReinitialize={true}
                    initialValues={
                        {
                            order_item: {
                                unit_price: MiscellaneousIndex > -1 ? bookingObject.order.order_items[MiscellaneousIndex].unit_price : '',
                                description: MiscellaneousIndex > -1 ? bookingObject.order.order_items[MiscellaneousIndex].description : ''
                            }
                        }}
                    validate={miscellaneousCostValidation}
                    onSubmit={addMiscellaneousCost}
                >
                    {(formikProps) => {
                        const errors = formikProps.errors
                        const touched = formikProps.touched

                        return (
                            <Form className="modal-content">
                                <div className="modal-body">
                                    <article className="alert_box text-center">
                                        <h3>{isEdit ? 'Update Convenience Fee?' : 'Add Convenience Fee?'}</h3>
                                        <h6 className="font-semi-bold mb-2">JOB: <span className="text-primary">#{bookingObject.id}</span></h6>
                                        <h4>{capitalizeFirstLetter(bookingObject.client.company_name)}</h4>
                                        <h4>{bookingObject.point_of_contact}</h4>
                                    </article>
                                    <form className="avh_alert_form">
                                        <div className="form-group">
                                            <label for="Price" className="label_modify">Amount</label>
                                            <Field type="number" min={1} max={100} autocomplete={"off"} className="input_modify conveniceFeeInputField" id="Price" name="order_item[unit_price]" />
                                            <ErrorMessage name="order_item[unit_price]" render={msg => <span className="error_message">{msg}</span>} />
                                        </div>
                                        <div className="form-group">
                                            <label for="description" className="label_modify">Details</label>
                                            <Field as="textarea" rows="4" className="input_modify textarea_modify" id="description" name="order_item[description]" />
                                        </div>
                                        {
                                            base64 ?
                                                <span className="label_modify"><span className="mr-1 font-semi-bold d-block float-left title">Uploaded image: </span><span className="description">
                                                    {
                                                        <ImageLoader
                                                            style={{ width: '70%', height: '70%', cursor: 'pointer' }}
                                                            src={base64}
                                                            imgProps={{ width: '70%' }}
                                                            wrapper={React.createFactory('div')}
                                                            preloader={preloader}>
                                                            Image load failed!
                                                        </ImageLoader>
                                                    }
                                                </span>
                                                </span>
                                                :
                                                isEdit && bookingObject.order.order_items[MiscellaneousIndex].photo_urls.small ?
                                                    <span className="label_modify"><span className="mr-1 font-semi-bold d-block float-left title">Uploaded image: </span><span className="description">
                                                        {
                                                            <ImageLoader
                                                                style={{ width: '100%', height: '100%', cursor: 'pointer' }}
                                                                src={bookingObject.order.order_items[MiscellaneousIndex].photo_urls.small}
                                                                imgProps={{ width: '100%' }}
                                                                wrapper={React.createFactory('div')}
                                                                preloader={preloader}>
                                                                Image load failed!
                                                            </ImageLoader>
                                                        }
                                                    </span>
                                                    </span>
                                                    : null}
                                        <div className="form-group">
                                            <label for="upooad_invoice" className="label_modify">Upload image</label>
                                            <input type="file" className="input_modify" id="upooad_invoice" onChange={onFileChange} />
                                        </div>
                                    </form>
                                    <div className="avh_seprator avh_sep_xl"></div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" disabled={isLoading} className="theme_btn theme_primary btn_primary_shad">
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

export default MiscellaneousCost;