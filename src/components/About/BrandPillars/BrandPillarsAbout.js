import React from 'react'
import './BrandPillarsAbout.css'

const brandPillarsAbout = props => {
    return (
        <section className="home_hero brand-pillars-about FlexVrCenter">
            {/* <div class="container"> */}
            <article className="art_hero_text">
                <h1>ABOUT – WHY AV HERO?</h1>
                <p style={{ textAlign: 'justify', fontSize: '20px' }} className="about-us-hero__title"><strong>Expertise:</strong> <span className="right_section">Not just anyone can become an AV HERO. Our certification test ensures only those who can truly SAVE THE DAY are given the title of AV HERO.</span></p>
                <p style={{ textAlign: 'justify', fontSize: '20px' }} className="about-us-hero__title"><strong>People:</strong> <span className="right_section">We strive to provide unmatched value to our customers and service providers. Nothing is more important than taking care of the people putting their trust in us.</span></p>
                <p style={{ textAlign: 'justify', fontSize: '20px' }} className="about-us-hero__title"><strong>Ease Of Use:</strong> <span className="right_section">With the push of a button, help is on the way. Track all open, active and closed jobs with your custom dashboard, automated systems and intuitive user interface.</span></p>
                <p style={{ textAlign: 'justify', fontSize: '20px' }} className="about-us-hero__title"><strong>Speed:</strong> <span className="right_section">AV HERO provides help within minutes of making a request. Your custom dashboard allows for tracking of all open jobs - and communication is available directly with your AV HERO.</span></p>
                <p style={{ textAlign: 'justify', fontSize: '20px' }} className="about-us-hero__title"><strong>Value:</strong> <span className="right_section">Our pricing can’t be beat. No middle-man means minimal markups. You should feel sorry for the competition.</span></p>
                <p style={{ textAlign: 'justify', fontSize: '20px' }} className="about-us-hero__title"><strong>Service:</strong> <span className="right_section">AV HERO guarantees you will have an excellent experience. Our platform allows you to rate and re-request HEROES that truly SAVE THE DAY, so you can be confident in the outcome.</span></p>
                {/* <a href="javascript:void(0)" onClick={() => this.props.history.push(routes.PROFILE_QUESTIONS)} className="theme_btn theme_danger">LET’S GO!</a> */}
            </article>
            {/* </div> */}
        </section>
    )
}

export default brandPillarsAbout