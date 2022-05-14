import React from 'react';
import { Helmet } from "react-helmet";
import { connect } from 'react-redux';
import { compose } from 'redux';
import Aux from '../hoc/Oux/Oux';

const WrapperComponent = (WrappedComponent) => {      // Wrapped Component is the parent component
    return class HigherOrderComponent extends React.Component {     // Returns a new component

        // Bring any reusable logic here.
        // For example Add a new prop to the existing props
        // or filter props based on the need

        render() {
            // let content = (

            // );
            return (
                <Aux>
                    <Helmet>
                        <script
                            id="_agile_min_js"
                            async
                            type="text/javascript"
                            src="https://bitcot.agilecrm.com/stats/min/agile-min.js"></script>


                        <script type="text/javascript">
                            {`  var Agile_API = Agile_API || {};
                                Agile_API.on_after_load = function() {
                                _agile.set_account("4udg741i9oq4hc23mi6lsqd2ne", "bitcot", false);
                                _agile.track_page_view();
                                _agile_execute_web_rules();
                              };`}
                        </script>
                    </Helmet>
                    < WrappedComponent {...this.props} />
                </Aux >
            );
        }
    }
}

const mapStateToProps = (state) => ({
});

const composedHOC = compose(
    connect(mapStateToProps, null),
    WrapperComponent
);

export default composedHOC;