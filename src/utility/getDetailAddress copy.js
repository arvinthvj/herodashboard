import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { address_attributes } from './constants/constants';

const getDetailAddress = (address) => {

    let addressFields = { ...address_attributes }
    return geocodeByAddress(address)
        .then(results => {
             
            addressFields.formatted_address = results[0].formatted_address
            results[0].address_components.map((addressType, i) => {
                addressType.types.map(type => {
                    if (type === "postal_code") {
                        addressFields.zip = addressType.long_name
                    } else if (type === "country") {
                        addressFields.country = addressType.long_name
                    } else if (type === "administrative_area_level_1") {
                        addressFields.state = addressType.long_name
                    } else if (type === "locality") {
                        addressFields.city = addressType.long_name
                    }
                })
            })
            //  
            // this.setState({
            //     address_attributes: addressFields
            // })
            // console.log(this.state)
            return getLatLng(results[0])
        })
        .then(latLng => {
            console.log('Success', latLng)

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
