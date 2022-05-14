import React, { useState, useEffect } from 'react'
import { validateAVHeroCode } from '../../../../api/bookingAPI'
import { routes, themeBlackColor } from '../../../../utility/constants/constants'
import { Redirect } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { css } from "@emotion/core";
import RingLoader from 'react-spinners/RingLoader';
import storage from '../../../../utility/storage';
import './BusinessCard.css'

const BusinessCardDesign = props => {

    const sendMail = () => {
        // Construct a mailto: URL with all the details:
        let subject = "AV HERO - Business Card!"
        let msg = `Check out my business card link here: https://${window.location.hostname}/${props.user.code ? props.user.code : props.heroCode}`
        window.open("mailto:?subject=" + subject + "&body=" + msg)

    }

    console.log(props.user, "user")
    return (
        <div className="avh_content">
            <div className="card avh_card hero_business_card" data-sr-id="0" style={{ visibility: 'visible', opacity: '1', transition: 'opacity 2.5s cubic-bezier(0.5, 0, 0, 1) 0s' }}>
                <div className="card-header">
                    <figure className="top_card_image">
                        <img src="/images/thumbnails/avhero-logo-yellow.svg" className="logo_inner" alt="av_hero" />
                    </figure>
                </div>
                <div className="card-body">
                    <h5 className="h5_title">{props.user.first_name} {props.user.last_name}</h5>
                    <p className="card_info">HERO</p>
                    <p className="card_info">{props.user.code ? props.user.code.toUpperCase() : props.heroCode.toUpperCase()}</p>
                </div>
                <div className="card-footer" style={{ padding: '0' }}>
                    {
                        props.history.location.pathname.includes(routes.PROFILE)
                            ? <a href="javascript:void(0)" style={{ cursor: 'default' }} className="footer_anchor">www.avhero.com</a>
                            : <a
                                href="javascript:void(0)"
                                onClick={() => {
                                    let user = storage.get('user', null)
                                    storage.set('booking_from_business_card', { hero_code: props.user.code ? props.user.code : props.heroCode })
                                    if (user) {
                                        props.history.push(routes.SELECT_ISSUES_AND_TIME);
                                    }
                                    else {
                                        props.history.push(routes.REGISTER);
                                    }
                                }}
                                className="footer_anchor book_this_hero_btn">Book This HERO</a>
                    }
                </div>
            </div>
            {
                props.history.location.pathname.includes(routes.PROFILE)
                    ? <div className="btn_grp">
                        <a href="javascript:void(0)" onClick={sendMail} className="theme_btn theme_primary text_inherie">share via email</a>
                        {
                            props.linkCopied
                                ? <a style={{ opacity: '0.5', cursor: 'default' }} href="javascript:void(0)" className="theme_btn theme_primary text_inherie">Link Copied</a>
                                : <CopyToClipboard text={`https://${window.location.hostname}/${props.user.code ? props.user.code : props.heroCode}`}
                                    onCopy={props.toggleCopyLinkBtn}>
                                    <a href="javascript:void(0)" className="theme_btn theme_primary text_inherie">copy link</a>
                                </CopyToClipboard>
                        }
                    </div>
                    : null
            }
        </div>
    )
}

const BusinessCard = props => {

    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [linkCopied, setLinkCopied] = useState(false)

    const overrideSpinnerCSS = css`
        margin: 0 auto;
    `;

    const toggleCopyLinkBtn = () => {
        setLinkCopied(true)
        setTimeout(() => {
            setLinkCopied(false)
        }, 2000)
    }

    let heroCode = props.history.location.pathname

    let content = null

    useEffect(() => {
        if (heroCode.toUpperCase().includes('AVH') && isLoading) {
            validateAVHeroCode(heroCode.substring(1, heroCode.length))
                .then(response => {
                    console.log(response, "response")
                    if (response.data.success === "true") {
                        console.log(response.data.user)
                        setUser(response.data.user)
                        setIsLoading(false)
                    }
                    else {
                        setIsLoading(false)
                    }
                }).catch(error => {
                    setIsLoading(false)
                    console.log(error)
                })

        }
        else {
            setIsLoading(false)
        }
    }, [isLoading])

    if (!isLoading) {
        if (user) {
            content = (
                <section className="home_hero FlexVrCenter">
                    {
                        isLoading
                            ? <RingLoader
                                sizeUnit={"px"}
                                size={70}
                                color={themeBlackColor}
                                loading={isLoading} />
                            : <BusinessCardDesign
                                history={props.history}
                                linkCopied={linkCopied}
                                toggleCopyLinkBtn={toggleCopyLinkBtn}
                                heroCode={heroCode.substring(1, heroCode.length)}
                                user={user} />
                    }
                </section>
            )
        }
        else {
            if (props.user && heroCode.includes(routes.PROFILE)) {
                content = (
                    <div style={{ display: 'block' }} className="tab-pane fade show active" id="business-card" role="tabpanel" aria-labelledby="business-card-tab">
                        {/* <!--<h4 className="mt-0 theme_semibold mb_25">Business Card</h4>--> */}
                        {
                            isLoading
                                ? <RingLoader
                                    css={overrideSpinnerCSS}
                                    sizeUnit={"px"}
                                    size={70}
                                    color={themeBlackColor}
                                    loading={isLoading} />
                                : <BusinessCardDesign
                                    history={props.history}
                                    linkCopied={linkCopied}
                                    toggleCopyLinkBtn={toggleCopyLinkBtn}
                                    user={props.user} />
                        }
                    </div>
                )
            }
            else {
                content = <Redirect to={routes.HOME} />
            }
        }
    }

    return content
}

export default BusinessCard