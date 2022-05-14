import React, { useState } from 'react';
import * as actions from '../../redux/actions/index';
import ImageLoader from 'react-imageloader';
import { useDispatch, useSelector } from "react-redux";
import Oux from '../../hoc/Oux/Oux';

const ViewMiscellaneousCost = (props) => {

    const [viewImage, setViewImage] = useState(false)

    const bookingObject = useSelector(state => state.clientOrHeroReducer.updateBookingObject);
    const dispatch = useDispatch();
    const index = bookingObject.order.order_items.findIndex(m => m.category === 'miscellaneous');
    const Image = bookingObject.order.order_items[index].photo_urls.small ? bookingObject.order.order_items[index].photo_urls.small : null;
    const closePopUp = () => {
        dispatch(actions.closePopUp());
    }

    const openImageView = () => {
        if (Image) {
            setViewImage(!viewImage)
        }
    }

    function preloader() {
        return <img style={{ width: '50%', height: '50%' }} src="/images/gif/giphy.gif" />;
    }

    let modalBodyContent = (
        <Oux>
            <article className="alert_box text-center">
                <h3>Convenience Fee</h3>
                <h4>{bookingObject.client.company_name ? bookingObject.client.company_name : ""}</h4>
                <h5>{bookingObject.point_of_contact}</h5>
                {/* <p><span className="number_font">{bookingObject.address.formatted_address}</span></p> */}

            </article>
            <form className="avh_alert_form">
                <span className="label_modify"><span className="mr-1 font-semi-bold title">Price: </span><span className="description">${bookingObject.order.order_items[index].unit_price}</span></span>
                <div className="clearfix"></div>
                <span className="label_modify"><span style={{ width: '100px' }} className="mr-1 font-semi-bold title">Description: </span> <span className="description">{bookingObject.order.order_items[index].description ? bookingObject.order.order_items[index].description : <span className="text-primary img-thumbnail">N/A</span>}</span></span>
                <div className="clearfix"></div>
                <span className="label_modify"><span className="mr-1 font-semi-bold d-block float-left title">Uploaded image: </span><span className="description">
                    <a onClick={openImageView} href="javascript:void(0)" className="img-thumbnail">
                        {Image ?
                            <ImageLoader
                                style={{ width: '100%', height: '100%', cursor: 'pointer' }}
                                src={Image}
                                imgProps={{ width: '100%' }}
                                wrapper={React.createFactory('div')}
                                preloader={preloader}>
                                Image load failed!
                                    </ImageLoader>
                            : 'N/A'} </a>
                </span>
                </span>
                <div className="clearfix"></div>
            </form>
            <div className="avh_seprator avh_sep_xl"></div>
        </Oux>
    )

    if (viewImage) {
        modalBodyContent = (
            <Oux>
                <article className="alert_box text-center">
                    <div className="mb-1">
                        <h3 style={{ float: 'left' }}>Uploaded Image</h3>
                        <img onClick={openImageView} src="/images/icons/icn_close_black.png" style={{ float: 'right', cursor: 'pointer' }} />
                    </div>
                    <a target="_blank" href={bookingObject.order.order_items[index].photo_urls.original ? bookingObject.order.order_items[index].photo_urls.original : "#"}><img width="90%" src={bookingObject.order.order_items[index].photo_urls.original ? bookingObject.order.order_items[index].photo_urls.original : Image} /></a>
                </article>
                <div className="avh_seprator avh_sep_xl"></div>
            </Oux>
        )
    }

    return (
        <div data-backdrop="static" data-keyboard="false" className="modal fade bd-example-modal-sm avh_modal info_miscellaneous" id="info_miscellaneous" tabindex="-1" role="dialog" aria-labelledby="info_miscellaneous" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm avh_modal_sm400" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        {modalBodyContent}
                    </div>
                    <div className="modal-footer">
                        <button onClick={closePopUp} data-dismiss="modal" type="button" className="theme_btn theme_primary btn_primary_shad">OK</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewMiscellaneousCost;