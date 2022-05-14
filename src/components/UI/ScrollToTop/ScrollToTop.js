import React from 'react'
import $ from 'jquery'
import './ScrollToTop.css'

const scrollToTop = props => {

    $(window).scroll(() => {
        if ($(window).scrollTop() > 300) {
            $('.mouse').addClass('show');
        } else {
            $('.mouse').removeClass('show');
        }
    });

    const onClickScrollToTop = (e) => {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, '300');
    }

    return (
        <div className="row">
            <a onClick={(event)=>onClickScrollToTop(event)} href="javascript:void(0)" className="mouse" aria-hidden="true">
                <span className="mouse__wheel"></span>
            </a>
        </div>
    )
}

export default scrollToTop