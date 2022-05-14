import axios from 'axios';
import swal from 'sweetalert';

export default function successAlert(message) {
    if (axios.isCancel(message)) {
        return Promise.reject(message);
    }

    if (message) {
        swal({
            icon: '',
            title: 'Success!',
            text: message,
            className: 'success-alert-modal'
        });
    }

    return Promise.reject(message);
}
