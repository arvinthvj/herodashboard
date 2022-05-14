import React from 'react'
import { NavLink } from 'react-router-dom'
import { routes, roles, assessment_status, background_check } from '../../../utility/constants/constants'
import Oux from '../../../hoc/Oux/Oux'

const heroProfileMenu = props => {

    let disableLeftMenu = (props.user.role === roles.service_provider && props.isPhoneVerified) && ((props.user.assessment_status.toLowerCase() === assessment_status.SUBMITTED.toLowerCase() || props.user.assessment_status.toLowerCase() === assessment_status.FAILED.toLowerCase())
        || (props.user.background_check.toLowerCase() === background_check.FAILED.toLowerCase() || props.user.background_check.toLowerCase() === background_check.PENDING.toLowerCase()))

    return (
        <div className="vertical_tabs_colL vertical_tabs_col">
            <div className="tab_list_block">
                <div className="nav flex-column nav-pills" id="v-pills-tab">
                    {
                        (disableLeftMenu || !props.isPhoneVerified)
                            ? <NavLink to={routes.EDIT_PROFILE} className="nav-link" id="edit_profile-tab">Edit Profile</NavLink>
                            : <Oux>
                                <NavLink to={routes.BUSINESS_CARD} className="nav-link" id="business-card-tab">Business Card</NavLink>
                                <NavLink to={routes.EDIT_PROFILE} className="nav-link" id="edit_profile-tab">Edit Profile</NavLink>
                                <NavLink to={routes.CHANGE_PASSWORD} className="nav-link" id="Change_Password_tab">Change Password</NavLink>
                                <NavLink to={routes.BANK_DETAILS} className="nav-link" id="Account-tab">Bank Account</NavLink>
                                <NavLink to={routes.PAYOUTS} className="nav-link" id="payouts-tab">Payouts</NavLink>
                            </Oux>
                    }
                </div>
            </div>
        </div>
    )
}

export default heroProfileMenu