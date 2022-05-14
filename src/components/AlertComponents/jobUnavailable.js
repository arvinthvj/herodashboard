import React from 'react';

const JobUnavailable = (props) => {

    return (
        <div data-backdrop="static" data-keyboard="false" className="modal fade bd-example-modal-sm avh_modal" id="alert_five" tabindex="-1" role="dialog" aria-labelledby="alert_five" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm avh_modal_sm400" role="document">
                <div className="modal-content text-center">
                    <div className="modal-body">
                        <figure className="mt-2 avh_thumb">
                            <img src="images/thumbnails/icn_sad.png" alt="Thumbnail" />
                        </figure>
                        <article className="alert_box">
                            <h4>At this time, the job has been allocated to a different AVHERO</h4>
                        </article>
                        <div className="avh_seprator avh_sep_300"></div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="theme_btn theme_danger mb-1">GO TO DASHBOARD</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export const JobUnavailable;