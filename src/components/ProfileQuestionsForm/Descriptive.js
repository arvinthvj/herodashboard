import React from 'react'
import { questions, questionTypes } from '../../utility/constants/constants'
import { Field } from 'formik'

const descriptive = props => {
    let errors = props.formik_props.errors
    let touched = props.formik_props.touched
    return (
        <div className="avh_ques_card card" id={"question_" + props.id}>
            <div className="card-body">
                <p className="label_ques">{props.question.content} <span className="text-danger">*</span></p>
                <div className="avh_input_ques">
                    <Field type="text" name={"question_" + props.id} placeholder="Your answer" />
                    <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>{errors["question_" + props.id] && touched["question_" + props.id] && errors["question_" + props.id]}</span>
                </div>
            </div>
        </div>
    )
}

export default descriptive