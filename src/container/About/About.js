import React, { Component } from 'react'
import './About.css'
import { Route, Redirect, Switch } from 'react-router-dom'
import { routes } from '../../utility/constants/constants'
import Oux from '../../hoc/Oux/Oux'
import ClientAbout from '../../components/About/Client/ClientAbout'
import TechniciansAbout from '../../components/About/Technicians/TechniciansAbout'
import BrandPillarsAbout from '../../components/About/BrandPillars/BrandPillarsAbout'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions/index'

class About extends Component {

    componentDidMount() {
        //  
        if (this.props.location.pathname === routes.ABOUT) {
            this.props.history.push(routes.ABOUT_CLIENT)
        }
    }

    navigateToBookingFlow = () => {
        if (this.props.user) {
            this.props.history.push(routes.SELECT_ISSUES_AND_TIME);
        } else {
            this.props.updateIsSigningFromBooking(true);
            this.props.history.push(routes.REGISTER, { signUpAsHero: false, signUpAsUser: true });
        }
    }

    render() {
        return (
            <Oux>
                <Switch>
                    <Route exact path={routes.ABOUT_CLIENT} render={() => <ClientAbout navigateToBookingFlow={this.navigateToBookingFlow} />} />
                    <Route exact path={routes.ABOUT_TECHNICIANS} component={TechniciansAbout} />
                    <Route exact path={routes.ABOUT_BRAND_PILLARS} component={BrandPillarsAbout} />
                    <Route path="*" render={(props) => <Redirect to={routes.ABOUT_CLIENT} />} />
                </Switch>
            </Oux>
        )
    }

}

const mapStateToProps = (state) => ({
    user: state.authReducer.user,
    isSigningupForBooking: state.authReducer.isSigningupForBooking,
    emailPath: state.authReducer.emailPath
});

const mapStateToDispatch = (dispatch) => ({
    updateIsSigningFromBooking: (enable) => { dispatch(actions.updateIsSigningFromBooking(enable)) },
    getUserProfile: () => dispatch(actions.getUserProfile()),
});

export default connect(mapStateToProps, mapStateToDispatch)(About)