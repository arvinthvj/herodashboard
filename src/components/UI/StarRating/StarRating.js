import React from 'react'
import StarRatingComponent from 'react-star-rating-component';
import Oux from '../../../hoc/Oux/Oux';
import { starTypes, themeBlackColor, themeBlueColor, themeYellowColor } from '../../../utility/constants/constants';
import './StarRating.css'

// ✭ => star icon


// To Apply Gradient Color To Text below three css files

// background:"linear-gradient(to right, #30CFD0 0%, #330867 100%)"
// WebkitBackgroundClip: 'text'
// WebkitTextFillColor: 'transparent'

const starRating = (props) => {

    let emptyStarStyling = {
        webkitTextFillColor: 'white',
        webkitTextStrokeWidth: '1px',
        webkitTextStrokeColor: themeBlackColor
    }

    let starRatedValue = null

    if (props.starRating && props.starRating.length > 0) {
        props.starRating.map((rating, index) => {
            if (rating.choiceName === props.name) {
                starRatedValue = rating.starRated
            }
        })
    }

    return (
        <Oux>
            {props.ratingType === starTypes.customIconStarRating ?
                <div style={{ marginTop: '-3px' }}>
                    <StarRatingComponent
                        name={props.name}
                        starCount={props.starCount}
                        value={starRatedValue}
                        onStarClick={(nextValue, prevValue, name) => props.onClickStar(nextValue, prevValue, name)}
                        starColor={themeYellowColor}
                        emptyStarColor="#ccc"
                        onStarHover={props.starHover}
                        onStarHoverOut={props.starHoverOut}
                        renderStarIcon={(nextValue, prevValue, name) => {
                            return (
                                <span style={{ paddingRight: '10px' }}><i className={prevValue >= nextValue ? "fa fa-star" : "fa fa-star empty-star"}></i></span>
                            )
                        }} />
                </div> : null}

            {props.ratingType === starTypes.defaultIconStarRating ?
                <div style={{ fontSize: 25 }}>
                    <StarRatingComponent
                        name="defaultIconStarRating"
                        starCount={props.starCount}
                        value={props.starRate}
                        onStarClick={props.onClickStar}
                        starColor="#f00"
                        onStarHover={props.starHover}
                        onStarHoverOut={props.starHoverOut} />
                </div> : null}

            {props.ratingType === starTypes.nonRatableStarRating ?
                <div style={{ fontSize: props.starSize }}>
                    <StarRatingComponent
                        name="nonRatableStarRating"
                        starCount={props.starCount}
                        value={props.starRate}
                        renderStarIcon={() => <span><i className="fas fa-star" /></span>}
                        starColor="#f00" />
                </div> : null}

            {props.ratingType === starTypes.halfStarRating ?
                <div style={{ fontSize: 24 }}>
                    <StarRatingComponent
                        name="halfIconStarRate"
                        starCount={props.starCount}
                        value={props.starRate}
                        onStarClick={props.onClickHalfStar}
                        onStarHover={props.halfStarHover}
                        onStarHoverOut={props.starHoverOut}
                        starColor="#ffb400"
                        emptyStarColor="#ffb400"
                        renderStarIcon={(index, value) => {
                            return (
                                <span>
                                    <i className={index <= value ? 'fas fa-star' : 'far fa-star'} />
                                </span>
                            );
                        }}
                        renderStarIconHalf={() => {
                            return (
                                <span>
                                    <span style={{ position: 'absolute' }}><i className="far fa-star" /></span>
                                    <span><i className="fas fa-star-half" /></span>
                                </span>
                            );
                        }} />
                </div> : null}
            {props.ratingType === starTypes.halfStarNonRatable ?
                <div style={{ fontSize: 24 }}>
                    <StarRatingComponent
                        name="halfStarNonRatable"
                        starCount={props.starCount}
                        value={props.starRate}
                        editing='false'
                        starColor="#f00"
                        renderStarIcon={(index, value) => {
                            return (
                                <span>
                                    <i className={index <= value ? 'fas fa-star' : 'far fa-star'} style={{ color: '#f00' }} />
                                </span>
                            );
                        }}
                        renderStarIconHalf={() => {
                            return (
                                <span>
                                    <span style={{ position: 'absolute', color: '#f00' }}><i className="far fa-star" /></span>
                                    <span style={{ color: '#f00' }}><i className="fas fa-star-half" /></span>
                                </span>
                            );
                        }} />
                </div> : null}
        </Oux>
    );
}

export default starRating