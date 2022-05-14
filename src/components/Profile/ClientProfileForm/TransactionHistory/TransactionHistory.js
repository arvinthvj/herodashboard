import React from 'react'
import { useEffect } from 'react'
import Avatar from 'react-avatar';
import storage from '../../../../utility/storage';
import { convertUTCToDifferentTZ } from '../../../../utility/utility';
import RingLoader from 'react-spinners/RingLoader';
import { css } from "@emotion/core";
import Oux from '../../../../hoc/Oux/Oux';
import { useState } from 'react';
import { themeBlackColor, HeroProfilePicPath, themeYellowColor, TransactionHistoryStatus } from '../../../../utility/constants/constants';
import $ from 'jquery'

const TransactionHistory = (props) => {

    const [dateSortTransactions, setDateSortTransactions] = useState([])

    const overrideSpinnerCSS = css`
        margin: 0 auto;
        left: calc(50% - 50px/2);
        display: inline-block;
        height: auto
    `;

    useEffect(() => {
        props.getClientOrders()
    }, [dateSortTransactions])

    console.log(props.clientOrders)

    let finalTotal = null
    if ((props.clientOrders && props.clientOrders.length > 0) && (!dateSortTransactions || dateSortTransactions.length === 0)) {

        let filteredOrders = props.clientOrders.filter((order) => {
            return order.booking
        })
        let sortedArray = filteredOrders.sort((a, b) => {
            return new Date(b.booking.ended_at_utc) - new Date(a.booking.ended_at_utc)
        })
        console.log(sortedArray)
        setDateSortTransactions(sortedArray)
    }

    const sortByName = () => {
        if ($('#sort_by_name_icon').hasClass('fa-caret-down')) {
            if ((props.clientOrders && props.clientOrders.length > 0)) {
                let sortedArray = props.clientOrders.sort((a, b) => a.booking.provider && b.booking.provider && a.booking.provider.short_name < b.booking.provider.short_name ? -1 : 1)
                console.log(sortedArray)
                setDateSortTransactions(sortedArray)
                $('#sort_by_name_icon').removeClass('fa-caret-down')
                $('#sort_by_name_icon').addClass('fa-caret-up')
            }
        }
        else {
            if ((props.clientOrders && props.clientOrders.length > 0)) {
                // let filteredArray = props.clientOrders.filter(a =>
                //     a.total_with_fee > 0 && a.status !== TransactionHistoryStatus.created.key
                // );
                let sortedArray = props.clientOrders.sort((a, b) => a.booking.provider && b.booking.provider && a.booking.provider.short_name < b.booking.provider.short_name ? 1 : -1)
                console.log(sortedArray)
                setDateSortTransactions(sortedArray)
                $('#sort_by_name_icon').addClass('fa-caret-down')
                $('#sort_by_name_icon').removeClass('fa-caret-up')
            }
        }
    }

    return (
        <div style={{ display: 'block' }} class="tab-pane fade show active" id="payments" role="tabpanel" aria-labelledby="payments_tab">
            {
                dateSortTransactions && dateSortTransactions.length > 0
                    ? <Oux>
                        <h4 class="ml-4 mb-4 ft_Weight_600 text-uppercase wow fadeInDown">Payments</h4>
                        <div class="table-responsive avh_tabel_cont">
                            <table class="table table-hover avh_table text-nowrap transaction_history_table">
                                <thead class="thead-dark">
                                    <tr>
                                        {/* <th scope="col">ID</th> */}
                                        <th scope="col">Job ID</th>
                                        <th style={{ cursor: 'pointer' }} onClick={sortByName} scope="col">Hero <i id="sort_by_name_icon" class="fa fa-caret-down ml-1 fa_cursor"></i> </th>
                                        {/* <th scope="col">ISSUES</th> */}
                                        <th scope="col">Date</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" class="text-center">Total amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dateSortTransactions && dateSortTransactions.length > 0
                                            ? dateSortTransactions.map((order, index) => {
                                                debugger;
                                                let heroDetails = order.booking.provider
                                                let servicesDetails = order.booking.services
                                                let endDate = convertUTCToDifferentTZ(order.booking.ended_at_utc, order.booking.address.timezone)
                                                let heroProfileImage = null
                                                let statusBgColor = null
                                                let paymentStatus = null
                                                if (!finalTotal) {
                                                    finalTotal = order.total_with_fee
                                                }
                                                else {
                                                    finalTotal += order.total_with_fee
                                                }
                                                if (order.status.toLowerCase() === TransactionHistoryStatus.completed.key.toLowerCase()) {
                                                    statusBgColor = '#29BF42'
                                                    paymentStatus = TransactionHistoryStatus.completed.title
                                                }
                                                else if (order.status.toLowerCase() === TransactionHistoryStatus.payment_processed.key.toLowerCase()) {
                                                    statusBgColor = '#29BF42'
                                                    paymentStatus = TransactionHistoryStatus.payment_processed.title
                                                }
                                                else if (order.status.toLowerCase() === TransactionHistoryStatus.payment_failed.key.toLowerCase()) {
                                                    statusBgColor = '#F32013'
                                                    paymentStatus = TransactionHistoryStatus.payment_failed.title
                                                }
                                                else if (order.status.toLowerCase() === TransactionHistoryStatus.cancelled.key.toLowerCase()) {
                                                    statusBgColor = '#F32013'
                                                    paymentStatus = TransactionHistoryStatus.cancelled.title
                                                }
                                                else if (order.status.toLowerCase() === TransactionHistoryStatus.payment_held.key.toLowerCase()) {
                                                    statusBgColor = themeYellowColor
                                                    paymentStatus = TransactionHistoryStatus.payment_held.title
                                                }
                                                else if (order.status.toLowerCase() === TransactionHistoryStatus.created.key.toLowerCase()) {
                                                    statusBgColor = themeYellowColor
                                                    paymentStatus = TransactionHistoryStatus.created.title
                                                }
                                                else {
                                                    statusBgColor = themeYellowColor
                                                    paymentStatus = 'Pending'
                                                }

                                                if (heroDetails && heroDetails.photo_urls && Object.keys(heroDetails.photo_urls).length > 0) {
                                                    heroProfileImage = heroDetails.photo_urls.small
                                                }
                                                else if (heroDetails && heroDetails.social_photo_url) {
                                                    heroProfileImage = heroDetails.social_photo_url
                                                }
                                                return (
                                                    <tr className="booking_history" key={order.booking.id}>
                                                        <td class="number_font">{order.booking.id}</td>
                                                        <td>
                                                            <div class="avh_avtar_block">
                                                                <span class="avh_ava_img">
                                                                    {
                                                                        heroProfileImage
                                                                            ? <img class="avh_sm_thumb" src={heroProfileImage} alt="Thumbnail" />
                                                                            : <img src={HeroProfilePicPath.FLYING} />
                                                                    }
                                                                </span>
                                                                <span class="avh_title">
                                                                    {heroDetails && heroDetails.short_name}
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
                                                            {endDate.toLocaleDateString()}
                                                        </td>
                                                        <td><span style={{ background: statusBgColor, color: 'white', fontWeight: 'bold' }} class="link_label">{paymentStatus}</span></td>
                                                        <td id="addTotal" className="number_font text-danger font-semi-bold fontS20 text-center addTotal">$ {order.total_with_fee.toFixed(2)}</td>
                                                    </tr>
                                                )
                                            })
                                            : null
                                    }
                                </tbody>
                                {
                                    finalTotal
                                        ? <tfoot class="thead-dark">
                                            <tr>
                                                <th scope="col" colSpan="3"></th>
                                                <th scope="col" className="font-semi-bold" id="total">Final Total</th>
                                                <th class="number_font font-semi-bold fontS20 text-center">${finalTotal.toFixed(2)}</th>
                                            </tr>
                                        </tfoot>
                                        : null
                                }
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
                        : <div class="empty_img_wrp transaction_history_empty_wrp">
                            {/* <figure><img style={{ width: '155px' }} src={HeroProfilePicPath.FLYING_PNG} alt="Icon" /></figure> */}
                            <h1 style={{ fontWeight: '700', fontSize: '30px' }} class="mt-0 theme_semibold">No Transaction History Found</h1>
                        </div>
            }
        </div>
    )
}

export default TransactionHistory