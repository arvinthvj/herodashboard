import React from 'react'
import { GoogleMap, Marker, withGoogleMap, withScriptjs, Circle, DrawingManager } from "react-google-maps"
import Oux from '../../../hoc/Oux/Oux.js';
import google from 'react-google-maps/lib/withGoogleMap'
const styles = require('./GoogleMapStyles.json');

const coveragMap = (props) => {
    return (
        <GoogleMap
            defaultZoom={6}
            defaultCenter={props.locations[0].center} defaultOptions={{
                gestureHandling: "cooperative",
                disableDefaultUI: true, // disable default map UI
                draggable: true, // make map draggable
                keyboardShortcuts: false, // disable keyboard shortcuts
                scaleControl: true, // allow scale controle
                scrollwheel: false, // allow scroll wheel
                styles: styles, // change default map styles
                zoomControl: true,
                zoomControlOptions: { position: 7 },
                navigationControl: false,
                mapTypeControl: false,
            }}
        >
            {
                props.locations.map((ele, index) => {
                    console.log(ele.center)
                    return (
                        <Oux key={index}>
                            <Marker
                                icon="/custom_images/map_hero_profile_flying.png"
                                // icon={
                                // {
                                //     path: 'M20,1C12.4,1,6.2,7.1,6.2,14.7c0,9.4,12.3,23.2,12.8,23.8c0.5,0.5,1.4,0.5,1.9,0c0.5-0.6,12.8-14.4,12.8-23.8 C33.8,7.1,27.6,1,20,1z',
                                //     fillColor: "#241e1e",
                                //     fillOpacity: 1,
                                //     strokeColor: '#FFFF',
                                //     strokeWeight: 1.3,
                                //     scale: 0.9,
                                //     anchor: { x: 0, y: -50 },
                                //     origin: { x: 0, y: 0 }
                                // }}
                                position={{ lat: ele.center.lat, lng: ele.center.lng }} />
                            {/* <Circle
                                center={ele.center}
                                radius={Math.sqrt(ele.population) * 100}
                                options={{
                                    fillColor: '#db3732',
                                    fillOpacity: 0.5,
                                    strokeWeight: 0,
                                    clickable: false,
                                    editable: false,
                                    zIndex: 1,
                                }} /> */}
                        </Oux>
                    )

                })
            }
        </GoogleMap>
    )
}

export default withScriptjs(withGoogleMap(coveragMap))