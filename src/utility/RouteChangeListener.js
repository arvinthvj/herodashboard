

import { useEffect } from 'react';
import { withRouter } from 'react-router-dom'


const Component = ({ history }) => {

    useEffect(() => history.listen(() => {
        // do something on route change
        // for my example, close a drawer
        window.scroll(0, 0);
    }), [])

    return null;
    //...
}

export default withRouter(Component)