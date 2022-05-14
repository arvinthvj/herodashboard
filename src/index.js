import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import authInterceptor from './utility/interceptors/authInterceptor';
import tokenInterceptor from './utility/interceptors/tokenInterceptor';
import errorHandler from './utility/errorHandler/errorHandler';
import axios, { API_VERSION } from './config';
import * as serviceWorker from './serviceWorker';
import store from './redux/store/store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import * as actions from './redux/actions/index'
import './styles/custom.css';
import './styles/stylesheets/style.css'
import $ from 'jquery'
import storage from './utility/storage';
import { GAinitialize, FBPixelinitialize } from './analytics/Analytics';
import ReactPixel from 'react-facebook-pixel';

GAinitialize();
FBPixelinitialize()

const refreshAuthLogic = failedRequest =>
    axios.get(API_VERSION + '/tokens/refresh_token?refresh_token=' + storage.get('refresh_token'), {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(tokenRefreshResponse => {

        storage.set('token', tokenRefreshResponse.data.access_token);
        storage.set('refresh_token', tokenRefreshResponse.data.refresh_token);
        failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.data.access_token;
        return Promise.resolve();
    }).catch(error => {
        store.dispatch(actions.logout())
    });

createAuthRefreshInterceptor(axios, refreshAuthLogic);

axios.interceptors.request.use(authInterceptor, error => Promise.reject(error));
axios.interceptors.response.use(tokenInterceptor, errorHandler);

const app = (
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>
);



ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
