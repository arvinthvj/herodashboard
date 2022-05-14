import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Layout from '../hoc/Layout/Layout';
import { routes, roles, assessment_status, background_check } from '../utility/constants/constants';
import Home from '../container/Home/Home';
import Login from '../container/Login/Login';
import Register from '../container/Register/Register';
import ForgotPassword from '../components/ForgotPassword/ForgotPasswordForm';
import ProfileQuestions from '../container/ProfileQuestions/ProfileQuestions';
import OTPVerification from '../container/Register/OTPVerification/OTPVerification';
import Favorites from '../container/Favorties/Favorites';
import SelectIssuesAndTimeContainer from '../container/BookingFlowContainer/SelectIssuesAndTimeContainer';
import LocationAndPaymentDetailContiner from '../container/BookingFlowContainer/LocationAndPaymentDetailContiner';
import ReviewAndConfirmContainer from '../container/BookingFlowContainer/ReviewAndConfirmContainer';
import ClientDashboard from '../container/ClientDashboard/ClientDashboard';
import HeroDashboard from '../container/HeroDashboard/HeroDashboard';
import ClientProfile from '../container/ClientProfile/ClientProfile';
import HeroProfile from '../container/HeroProfile/HeroProfile';
import AdditionalInformation from '../container/Register/AdditionalInformation/AdditionalInformation';
import storage from '../utility/storage';
import Help from '../container/Help/Help';
import About from '../container/About/About';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { StripeKey } from '../config';
import PrivacyPolicyPage from '../components/PrivacyPolicy/PrivacyPolicy';
import TermsOfUse from '../components/TermsOfUse/TermsOfUse';
import ContactUs from '../components/ContactUs/ContactUs';
import BusinessCard from '../components/Profile/HeroProfileForm/BusinessCard/BusinessCard';

const Router = (props) => {
    let routeList = null;
    let user = props.user;
    let isPhoneVerified = storage.get('isPhoneVerified', null);
    let PrivacyPolicyRoute = <Route exact path={routes.PRIVACY_POLICY} component={PrivacyPolicyPage} />
    let TermsOfUseRoute = <Route exact path={routes.TERMS_OF_USE} component={TermsOfUse} />
    let ContactUsRoute = <Route exact path={routes.CONTACT} component={ContactUs} />
    let PublicBusinessCard = <Route exact path={routes.PUBLIC_BUSINESS_CARD} component={BusinessCard} />
    if (user) {
        //when user is logged in
        if (user.role === roles.service_provider) {
            /* role=hero */
            if (isPhoneVerified || props.isPhoneVerified) {
                if (user.address) {

                    if (user.assessment_status.toLowerCase() === assessment_status.APPROVED && user.background_check === background_check.APPROVED) {
                        routeList = (
                            <Switch>
                                <Route exact path={routes.ROOT} render={(props) => <Redirect to={routes.DASHBOARD} />} />
                                {/* <Route exact path={routes.PROFILE_QUESTIONS} render={() => (props.isPhoneVerified || isPhoneVerified) && !props.user.address ? <Redirect to={routes.ADDITIONAL_INFORMATION} /> : props.isPhoneVerified || isPhoneVerified ? <ProfileQuestions /> : <Redirect to={routes.VERIFY_OTP} />} /> */}
                                <Route exact path={routes.VERIFY_OTP} render={() => props.isPhoneVerified ? <Redirect to={routes.DASHBOARD} /> : <OTPVerification />} />
                                <Route exact path={routes.DASHBOARD} component={HeroDashboard} />
                                <Route path={routes.PROFILE} component={HeroProfile} />
                                <Route path={routes.ABOUT} component={About} />
                                {/* <Route exact path={routes.COVERAGE} component={Coverage} /> */}
                                <Route exact path={routes.HOW_IT_WORKS} component={HowItWorks} />
                                <Route exact path={routes.HELP} component={Help} />
                                {PrivacyPolicyRoute}
                                {TermsOfUseRoute}
                                {ContactUsRoute}
                                {PublicBusinessCard}
                                <Route path='*' render={() => <Redirect to={routes.DASHBOARD} />} />
                            </Switch>
                        )
                    } else if (user.assessment_status.toLowerCase() === assessment_status.REQUESTED) {
                        debugger;
                        routeList = (
                            <Switch>
                                <Route exact path={routes.ROOT} render={(props) => <Redirect to={routes.THANK_YOU} />} />
                                <Route exact path={routes.PROFILE_QUESTIONS} component={ProfileQuestions} />
                                <Route exact path={routes.THANK_YOU} component={Home} />
                                {PrivacyPolicyRoute}
                                {TermsOfUseRoute}
                                {ContactUsRoute}
                                {PublicBusinessCard}
                                <Route path='*' render={() => <Redirect to={routes.THANK_YOU} />} />
                            </Switch>
                        )
                    } else {
                        // for submitted or failed
                        routeList = (
                            <Switch>
                                <Route exact path={routes.ROOT} component={Home} />
                                <Route path={routes.PROFILE} component={HeroProfile} />
                                {PrivacyPolicyRoute}
                                {TermsOfUseRoute}
                                {ContactUsRoute}
                                {PublicBusinessCard}
                                <Route path='*' render={() => <Redirect to={routes.HOME} />} />
                            </Switch>
                        )
                    }
                } else {
                    routeList = (
                        <Switch>
                            <Route exact path={routes.ROOT} render={(props) => <Redirect to={routes.ADDITIONAL_INFORMATION} />} />
                            <Route path={routes.ADDITIONAL_INFORMATION} component={AdditionalInformation} />
                            {PrivacyPolicyRoute}
                            {TermsOfUseRoute}
                            {ContactUsRoute}
                            {PublicBusinessCard}
                            <Route path='*' render={() => <Redirect to={routes.ADDITIONAL_INFORMATION} />} />
                        </Switch>
                    )
                }
            } else if (user.phone) {
                routeList = (
                    <Switch>
                        <Route exact path={routes.ROOT} render={(props) => <Redirect to={routes.VERIFY_OTP} />} />
                        <Route exact path={routes.VERIFY_OTP} component={OTPVerification} />
                        {PrivacyPolicyRoute}
                        {TermsOfUseRoute}
                        {ContactUsRoute}
                        {PublicBusinessCard}
                        <Route path='*' render={() => <Redirect to={routes.VERIFY_OTP} />} />
                    </Switch>
                )
            } else {
                routeList = (
                    <Switch>
                        <Route exact path={routes.ROOT} render={(props) => <Redirect to={routes.EDIT_PROFILE} />} />
                        <Route exact path={routes.VERIFY_OTP} component={OTPVerification} />
                        <Route path={routes.PROFILE} component={HeroProfile} />
                        {PrivacyPolicyRoute}
                        {TermsOfUseRoute}
                        {ContactUsRoute}
                        {PublicBusinessCard}
                        <Route path='*' render={() => <Redirect to={routes.EDIT_PROFILE} />} />
                    </Switch>
                )
            }
        } else {
            //  
            // role=client
            if (props.isPhoneVerified || isPhoneVerified) {
                // if(props.history.location.pathname)
                // const path = props.history.location.pathname;
                //  
                routeList = (
                    <Switch>
                        <Route exact path={routes.ROOT} render={(props) => <Redirect to={routes.BOOK} />} />
                        <Route exact path={routes.BOOK} component={Home} />
                        <Route exact path={routes.DASHBOARD} component={ClientDashboard} />
                        <Route exact path={routes.FAVORITES} component={Favorites} />
                        <Route path={routes.ABOUT} component={About} />
                        {/* <Route exact path={routes.COVERAGE} component={Coverage} /> */}
                        <Route exact path={routes.HOW_IT_WORKS} component={HowItWorks} />
                        <Route exact path={routes.VERIFY_OTP} render={() => (props.isPhoneVerified || isPhoneVerified) && !props.isLoading ? <Redirect to={routes.DASHBOARD} /> : <OTPVerification />} />
                        <Route path={routes.PROFILE} component={ClientProfile} />
                        <Route exact path={routes.HELP} component={Help} />
                        <Route exact path={routes.SELECT_ISSUES_AND_TIME} component={SelectIssuesAndTimeContainer} />
                        <Route exact path={routes.LOCATION_AND_PAYMENT_DETAIL} component={LocationAndPaymentDetailContiner} />
                        <Route exact path={routes.REVIEW_AND_CONFIRM} component={ReviewAndConfirmContainer} />
                        {PrivacyPolicyRoute}
                        {TermsOfUseRoute}
                        {ContactUsRoute}
                        {PublicBusinessCard}
                        <Route path='*' render={() => <Redirect to={routes.BOOK} />} />
                    </Switch>
                )
            } else if (user.phone) {
                routeList = (
                    <Switch>
                        <Route exact path={routes.ROOT} render={(props) => <Redirect to={routes.VERIFY_OTP} />} />
                        <Route exact path={routes.VERIFY_OTP} component={OTPVerification} />
                        {PrivacyPolicyRoute}
                        {TermsOfUseRoute}
                        {PublicBusinessCard}
                        {ContactUsRoute}
                        <Route path='*' render={() => <Redirect to={routes.VERIFY_OTP} />} />
                    </Switch>
                )
            } else {
                routeList = (
                    <Switch>
                        <Route exact path={routes.ROOT} render={(props) => <Redirect to={routes.EDIT_PROFILE} />} />
                        <Route exact path={routes.VERIFY_OTP} component={OTPVerification} />
                        <Route path={routes.PROFILE} component={ClientProfile} />
                        {PrivacyPolicyRoute}
                        {TermsOfUseRoute}
                        {PublicBusinessCard}
                        {ContactUsRoute}
                        <Route path='*' render={() => <Redirect to={routes.EDIT_PROFILE} />} />
                    </Switch>
                )
            }
        }

    } else {
        //when user is not logged in
        routeList = (
            <Switch>
                <Route exact path={routes.ROOT} component={Login} />
                <Route exact path={routes.LOGIN} component={Login} />
                <Route exact path={routes.REGISTER} component={Register} />
                <Route exact path={routes.HELP} component={Help} />
                <Route path={routes.ABOUT} component={About} />
                {/* <Route exact path={routes.COVERAGE} component={Coverage} /> */}
                <Route exact path={routes.PRIVACY_POLICY} component={PrivacyPolicyPage} />
                <Route exact path={routes.TERMS_OF_USE} component={TermsOfUse} />
                <Route exact path={routes.CONTACT} component={ContactUs} />
                <Route exact path={routes.HOW_IT_WORKS} component={HowItWorks} />
                <Route exact path={routes.FORGOT_PASSWORD} component={ForgotPassword} />
                <Route exact path={routes.SELECT_ISSUES_AND_TIME} component={SelectIssuesAndTimeContainer} />
                <Route exact path={routes.RESET_PASSWORD_TOKEN} render={() => <ForgotPassword history={props.history} resetPassword={props.resetPassword} user={user} />} />
                {PrivacyPolicyRoute}
                {TermsOfUseRoute}
                {ContactUsRoute}
                {PublicBusinessCard}
                <Route path='*' render={(props) => <Redirect to={routes.ROOT} />} />
            </Switch>
        )
    }

    return (
        <Layout>
            <StripeProvider apiKey={StripeKey()}>
                <Elements>
                    {routeList}
                </Elements>
            </StripeProvider>
        </Layout >
    )
};

export default Router;

export const NotFound = () => {
    return (
        <h1 className="text-center" style={{ margin: '100px' }}>404. Page not found.</h1>
    );
};

