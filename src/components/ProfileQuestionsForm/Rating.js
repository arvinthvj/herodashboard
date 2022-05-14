import React, { useState } from 'react'
import StarRating from '../UI/StarRating/StarRating'
import { starTypes } from '../../utility/constants/constants'
import { FieldArray } from 'formik'

let hoverStarRating = null

const Rating = props => {

    const [starRating, setStarRating] = useState([])
    const [isOnClickTrue, setIsOnClickTrue] = useState(false)

    const onStarClick = (nextValue, prevValue, name, choice, arrayHelpers) => {

        setStarRating([{ choiceName: name, starRated: nextValue === 1 && prevValue === 1 ? 0 : nextValue }])
        // props.formik_props.setFieldValue(name, nextValue)
        if (props.formik_props.values["question_" + props.id + "_rating_choice"] && props.formik_props.values["question_" + props.id + "_rating_choice"].length > 0) {
            props.formik_props.values["question_" + props.id + "_rating_choice"].map((value, index) => {
                if (value.id === choice) {
                    arrayHelpers.remove(index)
                }
            })
        }
        arrayHelpers.push({ id: choice, content: nextValue })
        setIsOnClickTrue(true)
        hoverStarRating = nextValue;
        console.log('name: %s, nextValue: %s, prevValue: %s', name, nextValue, prevValue);
    }

    // const onHoverStar = (nextValue, prevValue, name) => {
    //     console.log(nextValue)
    //     setStarRating([{ choiceName: name, starRated: nextValue }])
    // }

    // const onHoverStarOut = (nextValue, prevValue, name) => {

    //     if (isOnClickTrue) {
    //         setStarRating([{ choiceName: name, starRated: hoverStarRating }])
    //     }
    //     else {
    //         setStarRating([{ choiceName: name, starRated: 0 }])
    //     }
    // }
    let errors = props.formik_props.errors
    let touched = props.formik_props.touched

    return (
        <div className="avh_ques_card card" id={"question_" + props.id}>
            <div className="card-body">
                <p className="label_ques">{props.question.content} <span className="text-danger">*</span></p>
                <FieldArray
                    name={"question_" + props.id + "_rating_choice"}
                    render={arrayHelpers => {
                        return (
                            <div className="avh_rating_cont">
                                {
                                    props.question.options.map((choice, index) => {
                                        return (
                                            <div key={index} className="avh_rating_block">
                                                <span className="rating_label">{choice.content}</span>
                                                <span className="avh_rating_list">
                                                    <a href="javascript:void(0)" className="avh_rating_link">
                                                        <StarRating
                                                            starCount={5}
                                                            ratingType={starTypes.customIconStarRating}
                                                            starRating={starRating}
                                                            onClickStar={(nextValue, prevValue, name) => onStarClick(nextValue, prevValue, name, choice.id, arrayHelpers)}
                                                            name={"question_" + props.id + "_rated_choice_" + choice.id}
                                                        // starHover={onHoverStar}
                                                        // starHoverOut={onHoverStarOut}
                                                        />
                                                    </a>
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                                <span style={{ color: 'rgb(221, 39, 38)', fontSize: '13px' }}>{errors["question_" + props.id] && touched["question_" + props.id + "_rating_choice"] && errors["question_" + props.id]}</span>
                            </div>
                        )
                    }} />
            </div>
        </div>
    )
}

export default Rating