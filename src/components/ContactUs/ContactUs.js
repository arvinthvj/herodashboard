import React from 'react'
import { HeroProfilePicPath } from '../../utility/constants/constants'
import './ContactUs.css'

const contactUs = props => {
    return (
        <section className="home_hero FlexVrCenter home_hero_contact">
            <div className="container">
                <article className="art_hero_text">
                    <span className="contact_us_fly_icon fly_icon mb-2">
                        <img src={HeroProfilePicPath.FLYING_PNG} alt="Icon" />
                    </span>
                    <h1>Contact Us</h1>
                    <p className="about-us-hero__title">We would love to hear from you! <br /> Please email us at <a className="text-primary" href="mailto:support@avhero.com" target="_blank">support@avhero.com</a> and we will get back to you ASAP.</p>
                </article>
            </div>
        </section>
    )
}

export default contactUs