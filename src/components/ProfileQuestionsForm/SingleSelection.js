import React, { useState } from 'react'
import { questions, questionTypes } from '../../utility/constants/constants'
import { Field } from 'formik'

const SingleSelection = props => {

    let errors = props.formik_props.errors
    let touched = props.formik_props.touched

    const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null)

    const onChangeRadioButton = (event, index, choice) => {
        setSelectedChoiceIndex(index)
        props.formik_props.setFieldValue("question_" + props.id + "_single_choice", choice)
    }

    return (
        <div className="avh_ques_card card" id={"question_" + props.id + "_single_choice"}>
            <div className="card-body">
                <p className="label_ques">{props.question.content}<span className="text-danger">*</span></p>
                {
                    props.question.options.map((choice, index) => {
                        return (
                            <label key={index} className="avh_rado_container">{choice.content}
                                <Field type="radio" checked={index === selectedChoiceIndex} name={"question_" + props.id + "_single_choice"} onChange={(event) => onChangeRadioButton(event, index, choice.id)} />
                                <span className="avh_rado_checkmark"></span>
                            </label>
                        )
                    })
                }
                <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>{errors["question_" + props.id + "_single_choice"] && touched["question_" + props.id + "_single_choice"] && errors["question_" + props.id + "_single_choice"]}</span>
            </div>
        </div>
    )
}

export default SingleSelection

{/* <label className="avh_rado_container">2-4 years
                <input type="radio" name="radio" />
                <span className="avh_rado_checkmark"></span>
            </label>
            <label className="avh_rado_container">5-8 years
                <input type="radio" name="radio" />
                <span className="avh_rado_checkmark"></span>
            </label>
            <label className="avh_rado_container">8 or more years
                <input type="radio" name="radio" />
                <span className="avh_rado_checkmark"></span>
            </label> */}