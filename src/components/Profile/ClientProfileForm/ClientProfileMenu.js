import React from 'react'
import { NavLink, Route } from 'react-router-dom'
import { routes } from '../../../utility/constants/constants'
import Oux from '../../../hoc/Oux/Oux'

const clientProfileMenu = props => {

    return (
        <div className="vertical_tabs_colL vertical_tabs_col">
            <div className="tab_list_block">
                <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    {
                        props.isPhoneVerified
                            ? <Oux>
                                <NavLink className="nav-link" id="edit_profile-tab" to={routes.EDIT_PROFILE}>Edit Profile</NavLink>
                                <NavLink className="nav-link" id="Change_Password_tab" to={routes.CHANGE_PASSWORD}>Change Password</NavLink>
                                <NavLink className="nav-link" id="card_details_tab" to={routes.BANK_DETAILS}>Card Details</NavLink>
                                <NavLink className="nav-link" id="payments_tab" to={routes.PAYMENTS}>Transaction History</NavLink>
                                {/* <NavLink className="nav-link" id="favorite_hero_tab" to={routes.CLIENT_FAVOURITE_HERO}>Favorite Hero</NavLink> */}
                            </Oux>
                            : <NavLink className="nav-link" id="edit_profile-tab" to={routes.EDIT_PROFILE}>Edit Profile</NavLink>
                    }
                </div>
            </div>
        </div>
    )
}

export default clientProfileMenu