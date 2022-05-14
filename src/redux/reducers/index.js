import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { authReducer } from './users/authReducer';
import { configReducer } from './users/configReducer';
import { clientOrHeroReducer } from './users/clientOrHeroReducer';
import { historyReducer } from './users/historyReducer'

const reducers = combineReducers({
        authReducer,
        configReducer,
        clientOrHeroReducer,
        historyReducer,
        form: formReducer
});

export default reducers;
