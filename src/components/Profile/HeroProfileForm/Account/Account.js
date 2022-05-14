import React from 'react'
import PlaidLink from 'react-plaid-link'
import { PlaidPublicKey } from '../../../../config'
import { roles, assessment_status } from '../../../../utility/constants/constants'

const account = props => {

    let bank = null
    if (props.user && props.user.account) {
        bank = props.user.account.external_accounts.data[0]
    }
    let isDisabled = props.user.role === roles.service_provider && (props.user.assessment_status.toLowerCase() === assessment_status.SUBMITTED.toLowerCase() || props.user.assessment_status.toLowerCase() === assessment_status.FAILED.toLowerCase())

    let plaidEnv = "production";
    if (process.env.REACT_APP_ENV === 'development') {
        plaidEnv = "sandbox"
    } else if (process.env.REACT_APP_ENV === 'staging') {
        plaidEnv = "sandbox"
    } else if (process.env.REACT_APP_ENV === 'production') {
        plaidEnv = "production"
    }

    return (
        <div style={{ display: 'block' }} className="tab-pane active show fade" id="Account" role="tabpanel" aria-labelledby="Account-tab">
            {bank ? <h4 className="ml-4 ft_Weight_600 text-uppercase wow fadeInDown">Bank Details</h4> : null}
            <div className="row">
                {
                    bank
                        ? <div className="col-sm-12 col-md-10">
                            <div className="card bank_ac_card refer_tab_cont">
                                <div className="card-body">
                                    <h5 className="mt-0 mb-1 theme_semibold">{bank.bank_name}</h5>
                                    <div className="account_block">
                                        <span className="fellow_service_txt light_gray">Account ending in xxxx xxxx {bank.last4}</span>
                                        <span className="right_links">
                                            {
                                                // isDisabled
                                                //     ? <h3>Account Not Activated!</h3>
                                                //     :
                                                <PlaidLink
                                                    clientName="AV HERO"
                                                    env={plaidEnv}
                                                    product={["auth"]}
                                                    publicKey={PlaidPublicKey()}
                                                    onExit={props.handleOnExit}
                                                    onSuccess={props.handleOnSuccess}
                                                    className="theme_link link_underline a_tag_to_button"
                                                    style={isDisabled ? { pointerEvents: 'none' } : null}>
                                                    Update Bank Account
                                                    </PlaidLink>
                                            }
                                            {/* <a href="javascript:void(0)" className="theme_link link_underline"></a> */}

                                        </span>
                                    </div>
                                    <span className="currency">Currency usd</span>
                                </div>
                            </div>
                        </div>
                        : <div style={{ width: '100%', textAlign: 'center' }}>
                            {
                                // isDisabled
                                //     ? <article class="art_hero_text">
                                //         <h3>Come back again to add your bank account once the account is activated.</h3>
                                //     </article>
                                //     : 
                                <PlaidLink
                                    clientName="AV HERO"
                                    env={plaidEnv}
                                    product={["auth"]}
                                    publicKey={PlaidPublicKey()}
                                    onExit={props.handleOnExit}
                                    onSuccess={props.handleOnSuccess}
                                    className={"theme_btn theme_primary w-420"}
                                    style={null}>

                                    Connect your bank account!
                                </PlaidLink>
                            }
                        </div>

                }
            </div>

        </div>
    )
}

export default account