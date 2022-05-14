import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

const GooglePlacesAutoComplete = ({ name, value, onChange, handleAddressSelect, errors, touched, setFieldTouched, disabled }) => {
    //  
    //  
    return (
        <PlacesAutocomplete
            value={value}
            onChange={value => {
                if (!touched[name] && setFieldTouched) {
                    setFieldTouched(name, true)
                }
                onChange(name, value);
            }}
            onSelect={(value) => handleAddressSelect(value, onChange, name)}
        >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                    <input
                        id="googleAddress"
                        // onBlurCapture={(event) => handleAddressSelect(value)}
                        // style={props.isAddressEmpty ? { borderColor: 'rgb(240, 77, 83)', borderLeftWidth: '3px' } : null}
                        {...getInputProps({
                            placeholder: 'Address',
                            className: errors.address && touched.address ? "form-control input-modifier error_class" : "form-control input-modifier",
                            autoComplete: "off",
                            disabled: disabled
                        })}
                    />
                    {/* <span style={{ color: '#DD2726', fontSize: '13px' }}>{props.isAddressEmpty ? 'this field is required.' : null}</span> */}
                    <div onClick={(value) => handleAddressSelect(value.target.textContent)} className="autocomplete-dropdown-container" style={suggestions.length !== 0 ? { border: '1px solid #c3c3c3' } : null}>
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                            const className = suggestion.active
                                ? 'suggestion-item--active'
                                : 'suggestion-item';
                            // inline style for demonstration purpose
                            const style = suggestion.active
                                ? { backgroundColor: '#ebf0f7', cursor: 'pointer', fontSize: '12px', paddingLeft: '5px', fontWeight: 'bold', paddingTop: '10px', paddingBottom: '10px' }
                                : { backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '12px', paddingLeft: '5px', fontWeight: 'bold', paddingTop: '10px', paddingBottom: '10px' };
                            return (
                                <div
                                    {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style,
                                    })}
                                >
                                    <span>{suggestion.description}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </PlacesAutocomplete>
    )
}

export default GooglePlacesAutoComplete;