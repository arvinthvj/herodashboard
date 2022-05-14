import axios from 'axios';
import swal from 'sweetalert';
import { lowerCase } from 'lodash';
import store from '../../redux/store/store';

export default function errorHandler(error) {
    if (axios.isCancel(error)) {
        return Promise.reject(error);
    }
    if (error.data) {
        swal({
            icon: '',
            title: 'Oops!',
            text: error.data.error.message,
            className: 'error-handler-modal'
        });
    } else if (error.message && error.message !== 'Request failed with status code 401') {
        swal({
            icon: '',
            title: 'Oops!',
            text: error.message,
            className: 'error-handler-modal'
        });
    }

    return Promise.reject(error.message);
}
