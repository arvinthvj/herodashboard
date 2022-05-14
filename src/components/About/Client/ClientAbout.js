import React from 'react'
import './ClientAbout.css'

const clientAbout = props => {
    return (
        <section className="home_hero client-about FlexVrCenter">
            <div className="container">
                <article className="art_hero_text">
                    <h1>ABOUT – FOR CUSTOMERS</h1>
                    <p style={{ textAlign: 'justify', fontSize: '20px' }} className="about-us-hero__title">AV HERO’s Mission: SAVE THE DAY. <br /><br />In today’s world, audio visual systems have become a vital part of our everyday lives.
                        Whether you’re a business or an individual consumer, chances are you interact with and depend on audio visual equipment every day.<br /><br />
                        While the benefits of these technologies are significant, they can also cause a lot of pain and frustration - especially when they don’t work!
                        Problem is, many people don’t know who to call when their AV system stops working properly.
                        If they do know who to call, the process is complicated, slow and expensive.<br /><br />
                        Welcome AV HERO! AV HERO solves these problems by connecting you to certified audiovisual technicians at the touch of a button.
                        A network of AV HEROES that deliver on-demand audiovisual service - in a simple, fast and cost-effective way.
                        Forget Google search. Forget comparing companies. Forget expensive, slow and hard-to-navigate service providers.
                        AV HERO is here to connect people that need help with those that can help. <br /><br />Our sole mission is to SAVE THE DAY.</p>
                    {/* <a href="javascript:void(0)" onClick={() => this.props.history.push(routes.PROFILE_QUESTIONS)} className="theme_btn theme_danger">LET’S GO!</a> */}
                </article>
            </div>
        </section>
    )
}

export default clientAbout