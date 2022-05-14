import store from '../../redux/store/store';
import * as actions from '../../redux/actions/usersActions/action';

export const onLogout = () => {
    store.dispatch(actions.logout);
}   