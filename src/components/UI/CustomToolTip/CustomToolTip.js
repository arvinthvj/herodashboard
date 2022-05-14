import React from 'react'
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import positions from 'positions'
import $ from 'jquery'

const placementsMap = {
    tc: 'top center',
    bc: 'bottom center',
    cl: 'center left',
    cr: 'center right',
    tl: 'top left',
    tr: 'top right',
    bl: 'bottom left',
    br: 'bottom right',
};

const CustomToolTip = props => {

    const placeArrow = (tooltipEl, align) => {
        const arrowEl = tooltipEl.querySelector('.rc-tooltip-arrow');
        const targetEl = document.querySelector('#custom_tooltip');  // eslint-disable-line no-invalid-this
        const position = positions(arrowEl, placementsMap[align.points[0]], targetEl, placementsMap[align.points[1]]);
        
        if (align.points[0] === 'tc' || align.points[0] === 'bc') {
            arrowEl.style.top = '';
            arrowEl.style.left = `${position.left}px`;
        } else {
            arrowEl.style.top = `${position.top}px`;
            arrowEl.style.left = '';
        }
    }

    return (
        <Tooltip trigger={['click']} placement={props.placement} overlay={props.text} onPopupAlign={placeArrow}>
            <span id="custom_tooltip">{props.children}</span>
        </Tooltip>
    )
}

export default CustomToolTip