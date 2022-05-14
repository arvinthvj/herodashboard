import $ from 'jquery'
import jwtDecode from 'jwt-decode';
import React from 'react'
import Oux from '../../hoc/Oux/Oux';

export const PASSWORD_MIN_LEN = 6;
export const URL_REGEXP = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
export const EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
// export const PhNoPattern = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
export const URL = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
export const PhNoPattern = /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$/;


export const SocialLinks = {
    fb: "https://www.facebook.com/AV-HERO-100212031554774",
    linkedin: "https://www.linkedin.com/company/av-hero",
    instagram: "https://www.instagram.com/theavhero/",
    youtube: "https://www.youtube.com/channel/UC4jZVTU7S8jLGNyL1fAvRuQ?view_as=subscriber",
    twitter: "https://twitter.com/avherohq"
}

export const routes = {
    ROOT: '/',
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    ADDITIONAL_INFORMATION: '/additional-information',
    VERIFY_OTP: '/otp_verification',
    FORGOT_PASSWORD: '/forgot_password',
    RESET_PASSWORD_TOKEN: '/resetpassword',
    BOOK: '/book',
    IN_Review: '/in_review',
    THANK_YOU: '/thank-you',
    LOGOUT: '/logout',
    DASHBOARD: `/dashboard`,
    PROFILE_QUESTIONS: '/profile_questions',
    PROFILE: '/profile',
    EDIT_PROFILE: '/profile/edit',
    CHANGE_PASSWORD: '/profile/change-password',
    BANK_DETAILS: '/profile/bank-details',
    PAYOUTS: '/profile/payouts',
    PAYMENTS: '/profile/payments',
    BUSINESS_CARD: '/profile/business-card',
    PUBLIC_BUSINESS_CARD: '/:av_hero_code',

    FAVORITES: '/favorites',
    HELP: "/help",
    ABOUT: "/about",
    // ABOUT_CLIENT: "/about/customer",
    // ABOUT_TECHNICIANS: "/about/technicians",
    // ABOUT_BRAND_PILLARS: "/about/brand-pillars",
    HOW_IT_WORKS: "/how-it-works",
    COVERAGE: "/coverage",
    PRIVACY_POLICY: '/privacy-policy',
    TERMS_OF_USE: '/terms-of-use',
    CONTACT: '/contact',
    BLOG: process.env.REACT_APP_ENV === 'development' || process.env.REACT_APP_ENV === 'staging' ? 'http://aibitz.com/avhero' : 'https://blog.avhero.com/',

    // Booking Flow
    SELECT_ISSUES_AND_TIME: '/select_issues_and_time',
    LOCATION_AND_PAYMENT_DETAIL: '/location_and_payment_detail',
    REVIEW_AND_CONFIRM: '/review_and_confirm',
    OPEN_GOOGLE_MAPS: '/maps'
};

export const themeBlackColor = "#241e1e"

export const themeBlueColor = "#0e55a5"

export const themeYellowColor = "#fecb2f"

export const socialMediaSignInTypes = {
    GOOGLE: 'google',
    FB: 'fb'
}

export const MinImageResolution = {
    height: 683,
    width: 1024
}

export const HeroProfilePicPath = {
    NORMAL: '/custom_images/hero_profile_normal.jpg',
    FLYING: '/custom_images/hero_profile_flying.jpg',
    NORMAL_PNG: '/custom_images/hero_profile_normal.png',
    FLYING_PNG: '/custom_images/hero_profile_flying.png' // /custom_images/hero_profile_flying.png
}

export const background_check = {
    APPROVED: 'passed',
    PENDING: 'pending',
    FAILED: 'failed'
}

export const ClientProfilePicPath = {
    FLYING: '/custom_images/flying_hero_white.png'
}

export const address_attributes = {
    city: '',
    state: '',
    zip: '',
    country: '',
    latitude: '',
    longitude: '',
    formatted_address: '',
    street_address: '',
    description: ''
}

export const assessment_status = {
    APPROVED: 'approved',
    SUBMITTED: 'submitted',
    REQUESTED: 'requested',
    FAILED: 'declined'
}

export const client_sign_up_types = {
    BUSINESS: 'business',
    RESIDENCE: 'residence'
}

export const ImageTypes = {
    PNG: 'png',
    JPEG: 'jpeg'
}

export const Base64ImagesTypes = {
    PNG: 'data:image/png',
    JPEG: 'data:image/jpeg'
}


export const AllWeekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const FormatedWeekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const errorStyle = {
    borderColor: "rgb(240, 77, 83)",
    borderLeftWidth: '5px',
    borderLeftStyle: 'solid'
}

// Client data

// server status
// ["created", "assigned", "expired", "on_the_way", "started", "in_progress", "completed", 
// "contested", "payment_failed", "closed", "rescheduling", "cancelled" ]



export const ClientFilterSections = {
    requested: {
        title: "Requested",
        key: "requested",
        api_filter: "new",
        header: "New Job request",
    },
    accepted: {
        title: "Accepted",
        key: "accepted",
        api_filter: "open",
        header: "Open Job request",
    },
    active: {
        title: "Active",
        key: "active",
        api_filter: "ongoing",
        header: "Ongoing Job request",
    },
    closed: {
        title: "Closed",
        key: "closed",
        api_filter: "closed",
        header: "Closed Job request",
    },
    other: {
        title: "Other",
        key: "other",
        api_filter: "history",
        header: "History Job request",
    }
}

export const ClientJobStatus = {
    created: {
        status: "created",
        title: "Job is requested",
        cancellation_allowed: "true",
    },
    assigned: {
        status: "assigned",
        title: "Job is accepted",
        sub_title: "",
        cancellation_allowed: "true",
        call_allowed: true,
    },
    rescheduling: {
        status: "rescheduling",
        title: "HERO has requested to reschedule",
        accept_allowed: "true",
        reschedule_allowed: "true",
        repost_allowed: "true",
        cancellation_allowed: true,
        call_allowed: true,
    },
    cancelled: {
        status: "cancelled",
        title: "Job is Cancelled",
        sub_title: "Job is cancelled"
    },
    on_the_way: {
        status: "on_the_way",
        title: "Job is Active",
        sub_title: "HERO is on the way",
        call_allowed: true,
        cancellation_allowed: "true",
    },
    in_progress: {
        status: "in_progress",
        title: "Job is active",
        sub_title: "HERO is working",
        call_allowed: true,
    },
    completed: {
        status: "completed",
        title: <p className="">Job is completed <br />Approval Requested</p>,
        call_allowed: true,
        contest_allowed: true,
        approve_allowed: true
    },
    contested: {
        status: "contested",
        title: "Job is being contested",
        sub_title: "Pending AV HERO HQ Review",
        call_allowed: true,
    },
    approved: {
        status: "approved",
        title: "Job is Approved",
        sub_title: "",
        call_allowed: true,
    },
    payment_failed: {
        status: "payment_failed",
        title: "Payment failed",
        pay_allowed: true,
    },
    closed: {
        status: "closed",
        title: "Job is Closed",
    },
    expired: {
        status: "expired",
        title: "Job has expired",
    },
}


export const next_route_filter = (next_status) => {
    switch (next_status) {
        case ClientJobStatus.created.status:
            return ClientFilterSections.requested.key;
        case ClientJobStatus.assigned.status:
            return ClientFilterSections.accepted.key;
        case ClientJobStatus.rescheduling.status:
            return ClientFilterSections.accepted.key;
        case ClientJobStatus.cancelled.status:
            return ClientFilterSections.other.key;
        case ClientJobStatus.on_the_way.status:
            return ClientFilterSections.active.key;
        case ClientJobStatus.in_progress.status:
            return ClientFilterSections.active.key;
        case ClientJobStatus.completed.status:
            return ClientFilterSections.active.key;
        case ClientJobStatus.contested.status:
            return ClientFilterSections.active.key;
        case ClientJobStatus.approved.status:
            return ClientFilterSections.closed.key;
        case ClientJobStatus.payment_failed.status:
            return ClientFilterSections.accepted.key;
        case ClientJobStatus.closed.status:
            return ClientFilterSections.closed.key;
        case ClientJobStatus.expired.status:
            return ClientFilterSections.other.key;
        default:
            return ClientFilterSections.other.key;
    }
}

///////////////////////////////Clients data end

//////////Hero Data

export const HeroFilterSections = {
    available: {
        title: "Available",
        key: "available",
        api_filter: "new",
        header: "New Job request",
    },
    accepted: {
        title: "Accepted",
        key: "accepted",
        api_filter: "open",
        header: "Open Job request",
    },
    active: {
        title: "Active",
        key: "active",
        api_filter: "ongoing",
        header: "Ongoing Job request",
    },
    closed: {
        title: "Closed",
        key: "closed",
        api_filter: "closed",
        header: "Closed Job request",
    },
    other: {
        title: "Other",
        key: "other",
        api_filter: "history",
        header: "History Job request",
    }
}

export const hero_next_route_filter = (next_status) => {
    switch (next_status) {
        case HeroJobStatus.created.status:
            return HeroFilterSections.available.key;
        case HeroJobStatus.assigned.status:
            return HeroFilterSections.accepted.key;
        case HeroJobStatus.rescheduling.status:
            return HeroFilterSections.accepted.key;
        case HeroJobStatus.cancelled.status:
            return HeroFilterSections.other.key;
        case HeroJobStatus.on_the_way.status:
            return HeroFilterSections.active.key;
        case HeroJobStatus.in_progress.status:
            return HeroFilterSections.active.key;
        case HeroJobStatus.completed.status:
            return HeroFilterSections.active.key;
        case HeroJobStatus.contested.status:
            return HeroFilterSections.active.key;
        case HeroJobStatus.approved.status:
            return HeroFilterSections.closed.key;
        case HeroJobStatus.payment_failed.status:
            return HeroFilterSections.accepted.key;
        case HeroJobStatus.closed.status:
            return HeroFilterSections.closed.key;
        case HeroJobStatus.expired.status:
            return HeroFilterSections.other.key;
        default:
            return HeroFilterSections.other.key;
    }
}

export const HeroJobStatus = {
    created: {
        status: "created",
        title: "Job is Available",
        accept_allowed: "true"
    },
    assigned: {
        status: "assigned",
        title: "Job is Accepted",
        cancellation_allowed: true,
        call_allowed: true,
        onmyway_allowed: true,
    },
    rescheduling: {
        status: "rescheduling",
        title: <p className="">Your Job Is Being Rescheduled</p>,
        cancellation_allowed: true,
        call_allowed: true,
    },
    cancelled: {
        status: "cancelled",
        title: "Job is Cancelled",
        sub_title: "Job is cancelled"
    },
    on_the_way: {
        status: "on_the_way",
        title: "Job is Active",
        sub_title: "Time to SAVE THE DAY!",
        call_allowed: true,
        cancellation_allowed: "true",
        start_job_allowed: true,
    },
    in_progress: {
        status: "in_progress",
        title: "Job is Active",
        call_allowed: true,
        stop_job_allowed: true,
    },
    completed: {
        status: "completed",
        title: <Oux><p className="">Job is completed <br /> Customer approval requested</p></Oux>,
        call_allowed: true,
    },
    contested: {
        status: "contested",
        title: "Job is being contested",
        sub_title: "Pending AV HERO HQ Review",
    },
    payment_failed: {
        status: "payment_failed",
        title: "Payment is pending",
    },
    closed: {
        status: "closed",
        title: "Job is closed",
    },
    expired: {
        status: "expired",
        title: "Job has expired",
    },
}

export const BookingType = {
    asap: {
        key: "asap"
    },
    future: {
        key: "future"
    }
}


export const PayoutStatus = {
    pending: { title: "Pending", key: "pending" },
    paid: { title: "Paid", key: "paid" },
}

export const TransactionHistoryStatus = {
    payment_processed: { title: "Paid", key: "payment_processed" },
    payment_failed: { title: "Payment Failed", key: "payment_failed" },
    payment_held: { title: "Payment Held", key: "payment_held" },
    cancelled: { title: "Cancelled", key: "cancelled" },
    completed: { title: "Paid", key: "completed" },
    created: { title: "Created", key: "created" },
    accounts_receivable: { title: "Accounts Receivable", key: "accounts_receivable" }
}

///////////////////////////////Hero data end

export const roles = {
    service_provider: "service_provider",
    client: "client"
}

export const JobTimeText = {
    asap: 'This is the time when the job was created.',
    future: 'This is the time when the customer would like the service to take place.'
}


// export const UserRoles = {
//     user: "client",
//     service_provider: "service_provider",
// };

export const starTypes = {
    customIconStarRating: "customIconStarRate",
    halfStarRating: "halfIconStarRate",
    nonRatableStarRating: "nonRatableStarRating",
    defaultIconStarRating: "defaultIconStarRating",
    halfStarNonRatable: 'halfStarNonRatable'
}

export const questionTypes = {
    SINGLE_SELECTION: 'Single_Selection',
    MULTI_SELECTION: 'Multi_Selection',
    DESCRIPTIVE: 'Descriptive',
    RATING: 'Rating'
}

// Issues List

export const TypesOfIssues = {
    AUDIO: 'Audio',
    VIDEO: 'Video',
    CONTROL: 'Control',
    OTHER: 'Other'
}

export const IssuesList = [
    {
        id: 1,
        name: 'AUDIO'
    }, {
        id: 2,
        name: 'VIDEO'
    }, {
        id: 3,
        name: 'CONTROLS'
    }, {
        id: 4,
        name: 'OTHERS'
    }
]

export const FavHeros = [
    {
        name: 'DAVE SMITH',
        value: 1,

    }, {
        name: 'STEVE T. SCAIFE',
        value: 2,

    }, {
        name: 'KONSTA PEURA',
        value: 3,

    }, {
        name: 'LEO GILL',
        value: 4,

    }, {
        name: 'ANDREAS BRIXEN',
        value: 5,

    }, {
        name: 'TRY SOMEBODY NEW',
        value: 6,

    }]

export const HeroOnTheWayTime = [
    {
        id: 15,
        name: '15 mins',
    }, {
        id: 30,
        name: '30 mins',
    }, {
        id: 45,
        name: '45 mins',
    },
    {
        id: 60,
        name: '60 mins',
    },
    {
        id: 75,
        name: '75 mins',
    },
    {
        id: 90,
        name: '90 mins',
    }, {
        id: 105,
        name: '105 mins',
    }, {
        id: 120,
        name: '120 mins',
    },
    {
        id: "tbd",
        name: 'TBD mins',
    },
]

export const minutes = [
    {
        id: 0,
        name: '00 mins',
    },
    {
        id: 15,
        name: '15 mins',
    },
    {
        id: 30,
        name: '30 mins',
    },
    {
        id: 45,
        name: '45 mins',
    },
]

const fetchHours = (limit) => {
    let hours = []
    for (let i = 0; i <= limit; i++) {
        if (i <= 9) {
            hours.push({ id: i, name: `0${i} hrs` })
        } else {
            hours.push({ id: i, name: `${i} hrs` })
        }
    }
    return hours
}

export const hours = fetchHours(1000)


export const scrollToError = (errors, isValidating, isSubmitting) => {
    let firstError = null
    Object.keys(errors).map((error, index) => {
        if (index === 0) {
            firstError = error
        }
    })
    if (firstError && !isValidating && isSubmitting) {
        $('html, body').animate({
            scrollTop: $("#" + firstError).offset().top
        }, 2000);
    }
}

export const isTokenValid = (token) => {
    if (token) {
        const data = jwtDecode(token);
        let Valid = true;
        if (new Date() < new Date(parseInt(data.exp * 1000))) {
            Valid = true;
        } else {
            Valid = false
        }
        return Valid;
    }
    else {
        return false
    }
}
