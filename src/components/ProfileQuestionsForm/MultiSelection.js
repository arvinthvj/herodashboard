import React, { useState } from 'react'
import { questions, questionTypes } from '../../utility/constants/constants'
import { Field, FieldArray } from 'formik'
import Oux from '../../hoc/Oux/Oux'

const MultiSelection = props => {

    const [selectedChoiceIndex, setSelectedChoiceIndex] = useState([])

    const onChangeOtherDetail = (event, arrayHelpers, index, choice) => {
        if (selectedChoiceIndex.length > 0 && selectedChoiceIndex.includes(index)) {
            if (props.formik_props.values["question_" + props.id + "_multi_choice"].length > 0) {
                props.formik_props.values["question_" + props.id + "_multi_choice"].map((value, index) => {
                    if (value.id === choice) {
                        props.formik_props.values["question_" + props.id + "_multi_choice"].splice(index, 1)
                    }
                })
            }
            arrayHelpers.push({ id: choice, other_description: event.target.value })
        }
    }

    const onChangeCheckboxButton = (event, arrayHelpers, index, choice) => {

        let checkedArray = selectedChoiceIndex ? selectedChoiceIndex : []

        if (event.target.checked) {
            checkedArray.push(index)
            arrayHelpers.push({ id: choice })
        }
        else {
            let checkedIndex = checkedArray.indexOf(index)
            checkedArray.splice(checkedIndex, 1)
            arrayHelpers.remove(checkedIndex);
        }
        console.log(checkedArray)
        setSelectedChoiceIndex(checkedArray)
        console.log(props.formik_props.values)
    }

    let errors = props.formik_props.errors
    let touched = props.formik_props.touched

    return (
        <div className="avh_ques_card card" id={"question_" + props.id}>
            <div className="card-body">
                <p className="label_ques">{props.question.content} <span className="text-danger">*</span></p>
                <FieldArray
                    name={"question_" + props.id + "_multi_choice"}
                    render={arrayHelpers => (
                        props.question.options.map((choice, index) => {
                            // console.log(props.formik_props.values)
                            let isOtherChecked = false
                            if ((choice.content.toLowerCase() === 'other' || choice.content.toLowerCase() === 'others') && (selectedChoiceIndex.length > 0 && selectedChoiceIndex.includes(index))) {
                                isOtherChecked = true
                            }
                            return (
                                <Oux>
                                    <label key={index} className="avh_check_container">{choice.content}
                                        <Field checked={selectedChoiceIndex.includes(index)} name={"question_" + props.id + "_multi_choice"} onChange={(event) => onChangeCheckboxButton(event, arrayHelpers, index, choice.id)} type="checkbox" />
                                        <span className="avh_check_checkmark"></span>
                                    </label>
                                    {
                                        isOtherChecked
                                            ? <div className="avh_input_ques">
                                                <Field type="text" id="other_description_field" onChange={(event) => onChangeOtherDetail(event, arrayHelpers, index, choice.id)} name={"question_" + props.id + "_multi_choice_others_selected"} placeholder="If you marked other please provide details" />
                                                <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>{errors["question_" + props.id + "_multi_choice_others_selected"] && touched["question_" + props.id + "_multi_choice_others_selected"] && errors["question_" + props.id + "_multi_choice_others_selected"]}</span>
                                            </div>
                                            : null
                                    }
                                </Oux>
                            )
                        })
                    )} />
                <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>{errors["question_" + props.id] && touched["question_" + props.id + "_multi_choice"] && errors["question_" + props.id]}</span>
            </div>
        </div >
    )
}

export default MultiSelection



/*
<label className="avh_check_container">AVIXA/InfoComm CTS-I
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">AVIXA/InfoComm CTS-D
               <input type="checkbox" checked="checked" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">CEDIA ESC
               <input type="checkbox" checked="checked" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">CEDIA ESC-T
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">CEDIA ESC-N
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Extron AV Associate
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Extron Control Specialist
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Extron Control Pofessional
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Extron XTP Design Engineer
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Extron XTP Systems Technician
               <input type="checkbox" checked="checked" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Biamp Tesira Forte
               <input type="checkbox" checked="checked" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Biamp Tesira Server/Server-IO
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">QSC Q-SYS Level One
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">QSC Q-SYS Level Two
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Crestron Certified Audio Technician
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Crestron DMC-T-4K
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Crestron DMC-E-4K
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Crestron Foundations of Programming
               <input type="checkbox" checked="checked" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Crestron Core System Programming
               <input type="checkbox" checked="checked" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Harman Audio Essentials
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Harman Cabling Essentials
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Harman Control Essentials
               <input type="checkbox" checked="checked" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Harman Networking Essentials
               <input type="checkbox" checked="checked" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Harman Video Essentials
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Audinate Dante Level 1
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Audinate Dante Level 2
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Audinate Dante Level 3
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Shure Integrated Systems Level 1
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Shure Integrated Systems Level 2
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">None
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
                <label className="avh_check_container">Other:
               <input type="checkbox" />
                    <span className="avh_check_checkmark"></span>
                </label>
*/