import { ConfigActionTypes, AuthActionTypes } from '../../actions/usersActions/actionType';
import storage from '../../../utility/storage';

const initialState = {
    services: [],
    settings: {}
}

const updateObject = (oldState, updatedProps) => {
    return {
        ...oldState,
        ...updatedProps
    }
}

export const configReducer = (state = initialState, action) => {
    switch (action.type) {

        case ConfigActionTypes.PULL_CONFIG_FULFILLED:
            if (action.payload.error) {
                return state;
            }
            const { services } = action.payload;
            const { settings } = action.payload;
            return updateObject(state,
                {
                    services: services && services.length > 0 ? services : state.services,
                    settings: settings ? settings : state.settings
                });

        default: return state;
    }
}