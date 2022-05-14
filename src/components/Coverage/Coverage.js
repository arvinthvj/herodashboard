import React, { useState } from 'react'
import CoverageMaps from '../UI/CoverageMap/CoverageMap'
import './Coverage.css'
import $ from 'jquery'
import { GOOGLE_PLACES_API_KEY } from '../../config';
const locationsSupported = [
    {
        title: 'San Diego, CA',
        city: 'San Diego',
        center: {
            lat: 32.7157,
            lng: -117.1611
        },
        population: 1425976
    },
    {
        title: 'Phoenix, AZ',
        city: 'Arizona',
        center: {
            lat: 33.4484,
            lng: -112.0740,
        },
        population: 7378494

    }
];

const Coverage = (props) => {
    // const [selectedLatLong, setSelectedLatLong] = useState({ lat: 32.7157, long: 117.1611 })

    // const onClickMapView = (place) => {
    //     if (place === "san_diego") {
    //         setSelectedLatLong({ lat: 32.7157, long: 117.1611 })
    //     } else {
    //         setSelectedLatLong({ lat: 33.4484, long: 112.0740 })
    //     }
    // }

    const toggleCoverageSideNav = () => {
        $("#coverage_sidebar").toggleClass('active')
    }

    return (
        <div style={{ height: '100vh' }} className="coverage_wrapper coverage-d-flex coverage-align-items-stretch home_hero FlexVrCenter">
            <nav id="coverage_sidebar" className="active">
                <div className="custom-menu">
                    <button onClick={toggleCoverageSideNav} type="button" id="sidebarCollapse" className="btn btn-primary">
                        <i className="fa fa-bars"></i>
                        <span className="sr-only">Toggle Menu</span>
                    </button>
                </div>
                <div className="p-4">
                    <h1><a href="index.html" className="logo">Coverage Area</a></h1>
                    <ul className="list-unstyled components mb-5">
                        {
                            locationsSupported.map((location, index) => {
                                return (<li>
                                    <a href="javascript:void(0)" id="coverage_places_text" onClick={toggleCoverageSideNav}><span className="fa fa-globe mr-3"></span> {location.title}</a>
                                </li>)
                            })
                        }
                    </ul>
                    {/* <a className="theme_btn theme_danger" style={{marginLeft: '-15px'}} href="javascript:void(0)" onClick={toggleCoverageSideNav}>Request Your Location</a> */}
                </div>
            </nav>

            {/* <!-- Page Content  --> */}
            <div class="art_hero_btn" style={{ height: '80%', width: '80%', position: "absolute" }}>
                <div id="coverage_content" className="p-2 p-md-3 pt-3">
                    <CoverageMaps
                        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GOOGLE_PLACES_API_KEY()}`}
                        loadingElement={<div className="map_loading" style={{ height: `100%` }} />}
                        containerElement={<div className="map_container" style={{ height: '100%', width: '100%' }} />}
                        mapElement={<div className="map_element" style={{ height: `100%` }} />}
                        locations={locationsSupported} />
                </div>
            </div>
        </div>
    )
}
export default Coverage