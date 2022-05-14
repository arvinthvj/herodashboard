import store from '../../redux/store/store';
import { isTokenValid } from '../constants/constants';
import * as actions from '../../redux/actions/index'
import storage from '../storage';

const authInterceptor = (config) => {
    const state = store.getState();
    const token = state.authReducer.token
    const refresh_token = state.authReducer.refresh_token
    const updateTokenDispatched = state.authReducer.dispatchUpdateAccessToken
    const isValidToken = isTokenValid(token)
    const isRefreshTokenValid = isTokenValid(refresh_token)
    if (isValidToken && state.authReducer.token) {
        config.headers.common['Authorization'] = 'bearer ' + state.authReducer.token;
    }
    else {
        config.headers.common['Authorization'] = 'bearer ' + state.authReducer.token;
        //  
        if (!updateTokenDispatched && state.authReducer.token && isRefreshTokenValid) {
            store.dispatch(actions.updateAccessToken(refresh_token))
            store.dispatch(actions.dispatchUpdateAccessToken(true))
        }
        else if (refresh_token && !isRefreshTokenValid) {
            store.dispatch(actions.logout())
        }
    }
    return config;
}

export default authInterceptor;