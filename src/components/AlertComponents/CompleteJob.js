import React, { useState, useRef, useEffect } from "react";
import {
  hours,
  minutes,
  HeroJobStatus,
} from "../../utility/constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { contestBookingValidator } from "../../utility/validator/FormValidation/FormValidation";
import * as actions from "../../redux/actions/index";
import { convertSecondsToDisplayFormatInHrMM } from "../../utility/utility";
import PulseLoader from "react-spinners/PulseLoader";
import ReactTooltip from "react-tooltip";
import { Form, Formik, Field, ErrorMessage } from "formik";
const cloneDeep = require("clone-deep");

const CompleteJob = (props) => {
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const [isLoading, setIsLoading] = useState(false);
  const bookingObject = useSelector(
    (state) => state.clientOrHeroReducer.updateBookingObject
  );
  const bookingList = useSelector(
    (state) => state.clientOrHeroReducer.bookingList
  );
  const prevBookingList = usePrevious(bookingList);
  const dispatch = useDispatch();
  let jobCompletedTime = convertSecondsToDisplayFormatInHrMM(
    props.minutes_worked * 60
  );

  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      if (bookingList !== prevBookingList) {
        setIsLoading(false);
      }
    } else didMountRef.current = true;
  });

  const closePopUp = () => {
    dispatch(actions.closePopUp());
  };

  const completeBooking = (values) => {
    setIsLoading(true);
    let formValues = cloneDeep(values);
    let bookingRequest = {
      status: HeroJobStatus.completed.status,
      minutes_worked: props.minutes_worked,
      metadata: {
        resolved: !formValues.unresolved === true ? "true" : "false",
        notes: {
          hero: formValues.notes,
        },
      },
    };
    dispatch(actions.updateBooking(bookingObject.id, bookingRequest));
  };

  return (
    <div
      data-backdrop="static"
      data-keyboard="false"
      className="modal fade bd-example-modal-sm avh_modal"
      id="alert_eight"
      tabindex="-1"
      role="dialog"
      aria-labelledby="alert_eight"
      aria-hidden="true"
    >
      <ReactTooltip
        globalEventOff="click"
        className="tooltip-custom"
        html={true}
      />
      <div
        className="modal-dialog modal-dialog-centered modal-sm avh_modal_sm400"
        role="document"
      >
        <Formik
          initialValues={{ notes: "", unresolved: false }}
          // validate={contestBookingValidator}
          onSubmit={completeBooking}
        >
          {(formicProps) => {
            return (
              <Form className="modal-content">
                <div className="modal-body">
                  <article className="alert_box text-center">
                    <h3>Complete the job?</h3>
                  </article>
                  <div className="avh_alert_form">
                    <div className="form-group">
                      {/* <h5 className="font-semi-bold mb-1">Nov <span className="number_font">23, 10:00</span> AM</h5> */}
                      {/* <h6 className="mb-0">Corey Haim</h6> */}
                      <h6 className="font-semi-bold">
                        You have worked for {jobCompletedTime}{" "}
                      </h6>
                    </div>
                    <div className="form-group">
                      <label
                        className="avh_check_container complete_job_checkmark_container"
                        style={{ display: "inline" }}
                      >
                        Is ticket unresolved?
                        <Field
                          checked={formicProps.values.unresolved}
                          name="unresolved"
                          type="checkbox"
                        />
                        <span className="avh_check_checkmark complete_job_checkmark"></span>
                      </label>
                      <span className="ml-2">
                        <img
                          className="pointer_cursor"
                          style={{
                            width: "12px",
                            marginBottom: "1px",
                          }}
                          data-tip={`Please check this box if you were unable to resolve the customer's issue.`}
                          data-event="click focus"
                          src="/images/icons/info.svg"
                        />
                      </span>
                    </div>
                    <div className="form-group">
                      <Field
                        as="textarea"
                        className="input_modify textarea_modify"
                        name="notes"
                        placeholder="Any notes?"
                        rows="4"
                      />
                    </div>
                  </div>
                  <div className="avh_seprator avh_sep_xl"></div>
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="theme_btn theme_primary btn_primary_shad"
                  >
                    {isLoading ? (
                      <PulseLoader
                        sizeUnit={"px"}
                        size={5}
                        color={"white"}
                        loading={isLoading}
                      />
                    ) : (
                      "CONFIRM"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closePopUp}
                    className="theme_btn theme_outline_primary "
                    data-dismiss="modal"
                  >
                    CANCEL
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default CompleteJob;
