import React from 'react';

const CancelConfrimation = (props) => {
    return (
        <div data-backdrop="static" data-keyboard="false" className="modal fade bd-example-modal-sm avh_modal" id="alert_four" tabindex="-1" role="dialog" aria-labelledby="alert_four" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm avh_modal_sm400" role="document">
                <div className="modal-content text-center">
                    <div className="modal-body">
                        <figure className="mt-2 avh_thumb">
                            <img src="images/thumbnails/icn_sad.png" alt="Thumbnail" />
                        </figure>
                        <article className="alert_box">
                            <h4>Are you sure you want to cancel the booking?</h4>
                        </article>
                        <div className="avh_seprator avh_sep_300"></div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="theme_btn theme_primary btn_primary_shad">CONFIRM</button>
                        <button type="button" className="theme_btn theme_outline_primary" data-dismiss="modal">CANCEL</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CancelConfrimation;