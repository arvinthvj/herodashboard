import React from 'react'
import './TechniciansAbout.css'

const techniciansAbout = props => {
    return (
        <section className="home_hero technicians-about FlexVrCenter">
            <div class="container">
                <article className="art_hero_text">
                    <h1 className="text-uppercase">About – FOR TECHNICIANS</h1>
                    <p style={{ textAlign: 'justify', fontSize: '20px' }} className="about-us-hero__title">The most valuable people in the audiovisual industry are those who are in the field helping customers every day - AV Technicians. Unfortunately, at times, these frontrunners are undervalued, underappreciated and even treated as a commodity.
                    <br /><br /> Welcome AV HERO! AV HERO recognizes the value of the AV technician. As a matter of fact, AV HERO was created to prove just how great of an asset you are. No more corporate ladders.  The power is in your hands. People need help. You were born to make a difference. And we’re giving you the platform to do just that. Work whenever you want - but our hunch is that HERO life might become addictive.
                    <br /><br />It’s time we share our superpowers for the betterment of society – to fight for opportunity, flexibility and your future. So let’s do this!</p>
                    {/* <a href="javascript:void(0)" onClick={() => this.props.history.push(routes.PROFILE_QUESTIONS)} className="theme_btn theme_danger">LET’S GO!</a> */}
                </article>
            </div>
        </section>
    )
}

export default techniciansAbout