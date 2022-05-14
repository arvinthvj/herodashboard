import React from 'react'
import { useEffect } from 'react'
import { convertUTCToDifferentTZ, dateFormat } from '../../../../utility/utility'
import storage from '../../../../utility/storage';
import RingLoader from 'react-spinners/RingLoader';
import { css } from "@emotion/core";
import Oux from '../../../../hoc/Oux/Oux';
import { PayoutStatus } from '../../../../utility/constants/constants';
import { useState } from 'react';
import { themeBlackColor, HeroProfilePicPath, ClientProfilePicPath, themeYellowColor } from '../../../../utility/constants/constants';
import $ from 'jquery'

const Payouts = (props) => {

    const [dateSortPayouts, setDateSortPayouts] = useState([])

    const overrideSpinnerCSS = css`
        margin: 0 auto;
        left: calc(50% - 50px/2);
        display: inline-block;
        height: auto
    `;

    useEffect(() => {
        props.getPayouts()
    }, [dateSortPayouts])

    console.log(props.payouts, "Payouts")

    if ((props.payouts && props.payouts.length > 0) && (!dateSortPayouts || dateSortPayouts.length === 0)) {
        let sortedArray = props.payouts.sort((a, b) => new Date(b.booking.ended_at_utc) - new Date(a.booking.ended_at_utc))
        console.log(sortedArray)
        setDateSortPayouts(sortedArray)
    }

    const sortByName = () => {
        if ($('#sort_by_name_icon').hasClass('fa-caret-down')) {
            if ((props.payouts && props.payouts.length > 0)) {
                let sortedArray = props.payouts.sort((a, b) => a.booking.client.short_name < b.booking.client.short_name ? -1 : 1)
                console.log(sortedArray)
                setDateSortPayouts(sortedArray)
                $('#sort_by_name_icon').removeClass('fa-caret-down')
                $('#sort_by_name_icon').addClass('fa-caret-up')
            }
        }
        else {
            if ((props.payouts && props.payouts.length > 0)) {
                let sortedArray = props.payouts.sort((a, b) => a.booking.client.short_name < b.booking.client.short_name ? 1 : -1)
                console.log(sortedArray)
                setDateSortPayouts(sortedArray)
                $('#sort_by_name_icon').addClass('fa-caret-down')
                $('#sort_by_name_icon').removeClass('fa-caret-up')
            }
        }
    }

    const sortByCompanyName = () => {
        if ($('#sort_by_company_name_icon').hasClass('fa-caret-down')) {
            if ((props.payouts && props.payouts.length > 0)) {
                let sortedArray = props.payouts.sort((a, b) => a.booking.client.company_name < b.booking.client.company_name ? -1 : 1)
                console.log(sortedArray)
                setDateSortPayouts(sortedArray)
                $('#sort_by_company_name_icon').removeClass('fa-caret-down')
                $('#sort_by_company_name_icon').addClass('fa-caret-up')
            }
        }
        else {
            if ((props.payouts && props.payouts.length > 0)) {
                let sortedArray = props.payouts.sort((a, b) => a.booking.client.company_name < b.booking.client.company_name ? 1 : -1)
                console.log(sortedArray)
                setDateSortPayouts(sortedArray)
                $('#sort_by_company_name_icon').addClass('fa-caret-down')
                $('#sort_by_company_name_icon').removeClass('fa-caret-up')
            }
        }
    }

    return (
        <div style={{ display: 'block' }} class="tab-pane fade show active" id="payouts" role="tabpanel" aria-labelledby="payouts-tab">
            {
                dateSortPayouts && dateSortPayouts.length > 0
                    ? <Oux>
                        <h4 class="ml-4 mb-4 ft_Weight_600 text-uppercase wow fadeInDown">
                            Payouts
                        </h4>
                        <div class="table-responsive avh_tabel_cont">
                            <table class="table table-hover avh_table text-nowrap">
                                <thead class="thead-dark">
                                    <tr>
                                        {/* <th scope="col">ID</th> */}
                                        <th scope="col">Job ID</th>
                                        <th style={{ cursor: 'pointer' }} onClick={sortByName} scope="col">Client <i id="sort_by_name_icon" class="fa fa-caret-down ml-1 fa_cursor"></i></th>
                                        <th style={{ cursor: 'pointer' }} onClick={sortByCompanyName} scope="col">Company Name <i id="sort_by_company_name_icon" class="fa fa-caret-down ml-1 fa_cursor"></i></th>
                                        {/* <th scope="col">ISSUES</th> */}
                                        <th scope="col">Date</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" class="text-center">Total amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dateSortPayouts && dateSortPayouts.length > 0
                                            ? dateSortPayouts.map((payout, index) => {
                                                let clientDetails = payout.booking.client
                                                let endDate = convertUTCToDifferentTZ(payout.booking.ended_at_utc, payout.booking.address.timezone)
                                                endDate = dateFormat(endDate)
                                                let clientProfileImage = null
                                                let payoutStatus = null
                                                let statusBgColor = null
                                                if (payout.status.toLowerCase() === PayoutStatus.paid.key) {
                                                    payoutStatus = PayoutStatus.paid.title
                                                    statusBgColor = '#29BF42'
                                                } else {
                                                    statusBgColor = themeYellowColor
                                                    payoutStatus = PayoutStatus.pending.title
                                                }
                                                if (clientDetails.photo_urls && Object.keys(clientDetails.photo_urls).length > 0) {
                                                    clientProfileImage = clientDetails.photo_urls.small
                                                }
                                                else if (clientDetails.social_photo_url) {
                                                    clientProfileImage = clientDetails.social_photo_url
                                                }
                                                return (
                                                    <tr key={payout.booking.id}>
                                                        <td class="number_font">{payout.booking.id}</td>
                                                        <td>
                                                            <div class="avh_avtar_block">
                                                                <span class="avh_ava_img">
                                                                    <img class="avh_sm_thumb client_profile_pic_bgcolor" src={clientProfileImage ? clientProfileImage : ClientProfilePicPath.FLYING} alt="Thomas Stock" />
                                                                </span>
                                                                <span class="avh_title">
                                                                    {clientDetails.short_name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="avh_avtar_block">
                                                                <span style={{ textTransform: 'capitalize' }} class="avh_title">
                                                                    {clientDetails.company_name ? clientDetails.company_name : "-"}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        {/* <td>
                                                            <div class="label_link_div">
                                                                {
                                                                    servicesDetails && servicesDetails.length > 0
                                                                        ? servicesDetails.map((service, index) => {
                                                                            return (
                                                                                <span key={service.id} class="link_label">{service.name}</span>
                                                                            )
                                                                        })
                                                                        : null
                                                                }
                                                            </div>
                                                        </td> */}
                                                        <td class="number_font">
                                                            {/* {endDate.getMonth() + endDate.getDate() + endDate.getFullYear()} */}
                                                            {endDate.toLocaleString()}
                                                        </td>
                                                        <td><span style={{ background: statusBgColor, color: 'white', fontWeight: 'bold' }} class="link_label">{payoutStatus}</span></td>
                                                        <td class="number_font text-success font-semi-bold fontS20 text-center">$ {payout.amount.toFixed(2)}</td>
                                                    </tr>
                                                )
                                            })
                                            : null
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Oux>
                    : props.isLoading
                        ? <RingLoader
                            css={overrideSpinnerCSS}
                            sizeUnit={"px"}
                            size={50}
                            color={themeBlackColor}
                            loading={props.isLoading} />
                        : <div>
                            <figure style={{ textAlign: 'center' }}><img style={{ width: '155px' }} src={HeroProfilePicPath.FLYING_PNG} alt="Icon" /></figure>
                            <h1 style={{ fontWeight: '700', fontSize: '30px' }} class="mt-0 theme_semibold">No Payouts Found</h1>
                        </div>
            }
            {
                props.isLoading
                    ? null
                    : <div class="payout_history_bg">
                        <h4 style={{ marginBottom: '1rem' }}>PAYOUT DETAILS</h4>
                        <p>You will be paid $50 per hour for services provided.  There is a one hour minimum for AV HERO services, after which you will be paid in 15-minute increments.  (e.g. If you work for 1 hour and 30 minutes you would be paid $75 for that job).</p>
                        <p>The Convenience Fee is a pass through cost to the customer.  There is no markup allowed on Convenience Fees.</p>
                        <p>If a Customer contests a job and their contest is approved by AV HERO HQ, you may not receive payment for that job or a partial payment may be issued.  AV HERO HQ will always seek a fair resolution to any conflict.</p>
                        <p>Please contact <a className="text-primary" href="mailto:support@avhero.com" target="_blank">support@avhero.com</a> with any additional questions.</p>
                        {/* <p><span class="theme_semibold">Direct deposit</span> payouts can take 1 – 3 days to reflect on your statement depending on your bank.</p>
                <p><span class="theme_semibold">PayPal</span> payouts will reflect on your account within 2 – 4 hours.</p> */}
                    </div>
            }
        </div >
    )
}

export default Payouts