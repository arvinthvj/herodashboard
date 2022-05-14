import React from 'react'
import { questions, questionTypes, scrollToError, themeBlackColor } from '../../utility/constants/constants'
import SingleSelection from './SingleSelection'
import MultiSelection from './MultiSelection'
import Rating from './Rating'
import Descriptive from './Descriptive'
import { Formik, Form } from 'formik'
import ScrollToTop from '../UI/ScrollToTop/ScrollToTop'
import RingLoader from 'react-spinners/RingLoader';
import { css } from "@emotion/core";

const profileQuestionsForm = props => {

  const overrideSpinnerCSS = css`
        margin: 0 auto;
    `;

  const onSubmitProfileQuestionForm = (values) => {
    let evaluation_answers = []
    let multi_choice_answers = null
    Object.keys(values).map((value, valueIndex) => {
      let question_id = value.split("_")[1]
      if (value.includes("_rating_choice")) {
        evaluation_answers.push({ question_id: question_id, options: values["question_" + question_id + "_rating_choice"] })
      }
      else if (value.includes("multi_choice")) {
        evaluation_answers.push({ question_id: question_id, options: values["question_" + question_id + "_multi_choice"] })
      }
      else if (value.includes("single_choice")) {
        evaluation_answers.push({ question_id: question_id, options: [{ id: values["question_" + question_id + "_single_choice"] }] })
      }
      else {
        evaluation_answers.push({ question_id: question_id, content: values["question_" + question_id] })
      }
    })
    console.log(values, 'values')
    console.log(multi_choice_answers, "multi")
    props.submitQuestions(evaluation_answers)
    console.log(evaluation_answers, "eval")
  }

  const validateProfileQuestionForm = (values) => {
    let errors = {};
    props.testQuestions.map((question, index) => {
      if (question.category.toLowerCase() === questionTypes.RATING.toLowerCase()) {
        if (!values["question_" + question.id + "_rating_choice"] || (values["question_" + question.id + "_rating_choice"] && values["question_" + question.id + "_rating_choice"].length !== question.options.length)) {
          errors["question_" + question.id] = "Please rate all the " + question.options.length + " options"
        }
      }
      else if (question.category.toLowerCase() === questionTypes.MULTI_SELECTION.toLowerCase()) {
        question.options.map((choice, choiceIndex) => {
          if (!values["question_" + question.id + "_multi_choice"]) {
            errors["question_" + question.id] = "Please select atleast one option."
          }
        })
      }
      else if (question.category.toLowerCase() === questionTypes.SINGLE_SELECTION.toLowerCase()) {
        question.options.map((choice, choiceIndex) => {
          if (!values["question_" + question.id + "_single_choice"]) {
            errors["question_" + question.id + "_single_choice"] = "This field is required."
          }
        })
      }
      else {
        if (!values["question_" + question.id]) {
          errors["question_" + question.id] = "This field is required"
        }
      }
    })
    return errors
  }
  const initialFormValues = {}

  console.log(props.testQuestions)

  if (props.testQuestions) {
    props.testQuestions.map((question, index) => {
      if (question.category.toLowerCase() === questionTypes.RATING.toLowerCase()) {
        initialFormValues["question_" + question.id + "_rating_choice"] = '';
      }
      else if (question.category.toLowerCase() === questionTypes.MULTI_SELECTION.toLowerCase()) {
        initialFormValues["question_" + question.id + "_multi_choice"] = '';
      }
      else if (question.category.toLowerCase() === questionTypes.SINGLE_SELECTION.toLowerCase()) {
        initialFormValues["question_" + question.id + "_single_choice"] = '';
      }
      else {
        initialFormValues["question_" + question.id] = '';
      }
    })
  }

  return (
    <section className="avh_sec sec_mt_83 home_hero">
      <div className="container">
        <div className="avh_max_450">
          <h3>AV HERO Assessment<span className="pull-right avh_sm text-danger spansm_t14">* Required</span></h3>
          <Formik
            enableReinitialize={true}
            initialValues={initialFormValues}
            validate={(values) => validateProfileQuestionForm(values)}
            onSubmit={(values) => onSubmitProfileQuestionForm(values)}>
            {(formik_props) => {
              console.log(formik_props.errors, "Errors")
              console.log(formik_props.touched, "Touched")
              console.log(formik_props.values, "Values")
              scrollToError(formik_props.errors, formik_props.isValidating, formik_props.isSubmitting)
              return (
                <Form>
                  {
                    props.testQuestions && props.testQuestions.map((question, index) => {
                      if (question.category.toLowerCase() === questionTypes.SINGLE_SELECTION.toLowerCase()) {
                        return <SingleSelection formik_props={formik_props} key={index} id={question.id} question={question} />
                      }
                      else if (question.category.toLowerCase() === questionTypes.MULTI_SELECTION.toLowerCase()) {
                        return <MultiSelection formik_props={formik_props} key={index} id={question.id} question={question} />
                      }
                      else if (question.category.toLowerCase() === questionTypes.DESCRIPTIVE.toLowerCase()) {
                        return <Descriptive formik_props={formik_props} key={index} id={question.id} question={question} />
                      }
                      else if (question.category.toLowerCase() === questionTypes.RATING.toLowerCase()) {
                        return <Rating formik_props={formik_props} key={index} id={question.id} question={question} />
                      }
                      else {
                        return <p key={index}>No Questionnaire</p>
                      }
                    })
                  }
                  <div className="form-group mt-4">
                    {
                      props.isLoading
                        ? <RingLoader
                          css={overrideSpinnerCSS}
                          sizeUnit={"px"}
                          size={30}
                          color={themeBlackColor}
                          loading={props.isLoading} />
                        : <button className="theme_primary btn-block theme_btn_lg theme_btn" type="submit"> SUBMIT </button>
                    }
                  </div>
                </Form>
              )
            }}
          </Formik>
          <ScrollToTop />
        </div>
      </div>
    </section>
  )
}

export default profileQuestionsForm