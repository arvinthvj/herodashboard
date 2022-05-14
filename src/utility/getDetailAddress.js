import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { address_attributes } from './constants/constants';
import { removeDublicateValuesInAddress } from './utility';
var tzlookup = require("tz-lookup");

const getDetailAddress = (address) => {

    let addressFields = { ...address_attributes }

    return geocodeByAddress(address)
        .then(results => {
            addressFields.formatted_address = results[0].formatted_address
            results[0].address_components.map((addressType, i) => {
                addressType.types.map(type => {
                    if (type === "postal_code") {
                        // SplittedAddress.map((spld, i) => {
                        //     if (spld.trim() === addressType.long_name.trim() || spld.trim() === addressType.short_name.trim()) {
                        //         SplittedAddress.splice(i, 1);
                        //     }
                        // })
                        addressFields.zip = addressType.long_name
                    } else if (type === "country") {
                        addressFields.country = addressType.long_name
                    } else if (type === "administrative_area_level_1") {
                        // SplittedAddress.map((spld, i) => {
                        //     if (spld.trim() === addressType.long_name.trim() || spld.trim() === addressType.short_name.trim()) {
                        //         SplittedAddress.splice(i, 1);
                        //     }
                        // })
                        addressFields.state = addressType.long_name
                    } else if (type === "locality") {
                        // SplittedAddress.map((spld, i) => {
                        //     if (spld.trim() === addressType.long_name.trim() || spld.trim() === addressType.short_name.trim()) {
                        //         SplittedAddress.splice(i, 1);
                        //     }
                        // })
                        addressFields.city = addressType.long_name
                    }
                })
            })

            addressFields.street_address = removeDublicateValuesInAddress(address);
            //  
            // this.setState({
            //     address_attributes: addressFields
            // })
            // console.log(this.state)

            // if (onChange && name) {
            //     onChange(name, SteetAddress)
            // }
            return getLatLng(results[0])
        })
        .then(latLng => {
            console.log('Success', latLng)

            addressFields['timeZone'] = tzlookup(latLng.lat, latLng.lng);
            // let addressFields = { ...this.state.address_attributes };
            addressFields.latitude = latLng.lat;
            addressFields.longitude = latLng.lng;

            //  
            // this.setState({
            //     address_attributes: addressFields
            // })

            return addressFields;
        })
        .catch(error => {
            console.error('Error', error)
            return error;
        });

}

export default getDetailAddress;
