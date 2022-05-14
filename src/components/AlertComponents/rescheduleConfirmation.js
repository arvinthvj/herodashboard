import React from 'react';

const RescheduleConfirmation = () => {
    return (
        <div className="modal fade bd-example-modal-sm avh_modal" id="alert_two" tabindex="-1" role="dialog" aria-labelledby="alert_two" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm avh_modal_sm400" role="document">
                <div className="modal-content text-center">
                    <div className="modal-body">
                        <figure className="mt-2 avh_thumb">
                            <img src="images/thumbnails/icn_thumb.png" alt="Thumbnail" />
                        </figure>
                        <article className="alert_box">
                            <h4>Your job is rescheduled and we are moving into scheduling</h4>
                        </article>
                        <div className="avh_seprator avh_sep_300"></div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="theme_btn theme_teal mb-1">GO TO MY BOOKINGS</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RescheduleConfirmation;