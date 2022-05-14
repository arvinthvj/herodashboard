import { ConfigActionTypes } from './actionType';
import * as API from '../../../api/configAPI';
import errorHandler from '../../../utility/errorHandler/errorHandler';

export const config = () => dispatch => dispatch({
    type: ConfigActionTypes.PULL_CONFIG,
    payload: API.fetchConfig()
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
            errorHandler(error);
            return error;
        })
});