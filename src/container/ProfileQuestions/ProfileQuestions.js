import React, { Component } from 'react'
import ProfileQuestionsForm from '../../components/ProfileQuestionsForm/ProfileQuestionsForm'
import { routes } from '../../utility/constants/constants'
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/index'

class ProfileQuestions extends Component {

    componentDidMount() {
        this.props.getTestQuestions()
    }

    submitQuestions = (values) => {
        // this.props.history.push(routes.DASHBOARD);
        this.props.submitTest({ evaluation_answers: [...values] })
        console.log(values)
    }

    render() {
        return (
            <ProfileQuestionsForm
                testQuestions={this.props.questions}
                isLoading={this.props.isLoading}
                submitQuestions={this.submitQuestions} />
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.authReducer.user,
    isLoading: state.authReducer.isloading,
    assessment: state.authReducer.assessment,
    questions: state.authReducer.heroProfileQuestions
});

const mapStateToDispatch = (dispatch) => ({
    getTestQuestions: () => dispatch(actions.getHeroTestProfileQuestions()),
    submitTest: (questions) => dispatch(actions.submitHeroTestProfileQuestions(questions)),
    getHeroTestResult: () => dispatch(actions.getHeroTestResults()),
    getUserProfile: () => dispatch(actions.getUserProfile()),
});

export default connect(mapStateToProps, mapStateToDispatch)(ProfileQuestions)