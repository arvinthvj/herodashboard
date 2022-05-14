import store from '../../redux/store/store';
import { routes } from '../constants/constants';

export const onAuthentication = () => {
    const state = store.getState();
    if (!state.authReducer.token) {
        //navigate to login
    }
}   