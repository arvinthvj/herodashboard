import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/index'
import RingLoader from 'react-spinners/RingLoader';
import { css } from "@emotion/core";
import $ from 'jquery'
import { themeBlackColor } from '../../utility/constants/constants';

class Help extends Component {

    state = {
        currentlyOpenedFAQ: null
    }

    componentDidMount() {
        this.props.getFAQ()
    }

    toggleOtherFaqs = (selected_faq) => {
        this.props.faqs.map((faq, index) => {
            if (faq.id !== selected_faq.id) {
                $(`#faq_${faq.id}`).removeClass('show')
                $('.card-header').addClass('collapsed')
            }
        })
    }

    render() {

        const overrideSpinnerCSS = css`
            margin: 0 auto;
        `;

        return (
            <section className="avh_sec sec_mt_83 avh_quiz home_hero">
                <div className="container">
                    <div className="quiz_head">
                        <h1>Frequently Asked Questions</h1>
                        {/* <p>Need help? Be sure to visit our support forums for answers to your questions!</p> */}
                    </div>
                    <div className="quiz_accordion">
                        <div id="accordion">
                            {
                                this.props.faqs && this.props.faqs.length > 0
                                    ? this.props.faqs.map((faq, index) => {
                                        return (
                                            <div key={faq.id} className="card">
                                                <div
                                                    data-toggle="collapse"
                                                    data-target={`#faq_${faq.id}`}
                                                    onClick={() => this.toggleOtherFaqs(faq)}
                                                    className="card-header collapsed">
                                                    <a className="card-title">
                                                        {faq.question}
                                                    </a>
                                                </div>

                                                <div
                                                    id={`faq_${faq.id}`}
                                                    className="collapse">
                                                    <div className="card-body">
                                                        <p>{faq.answer}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                    : this.props.isLoading
                                        ? <RingLoader
                                            css={overrideSpinnerCSS}
                                            sizeUnit={"px"}
                                            size={50}
                                            color={themeBlackColor}
                                            loading={this.props.isLoading} />
                                        : null
                            }
                        </div>
                    </div>
                    <h4 style={{ marginBottom: "25px" }}>Still need help? Contact <a href="mailto:support@avhero.com" target="_blank" style={{ color: '#0e55a5' }}>support@avhero.com</a></h4>
                </div>
            </section>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoading: state.authReducer.isloading,
    faqs: state.authReducer.faqs
});

const mapStateToDispatch = (dispatch) => ({
    getFAQ: () => dispatch(actions.getFAQ())
});

export default connect(mapStateToProps, mapStateToDispatch)(Help)