
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';

const ProtectedRoute = (pProps) => {
    return (
        <Route
            path={pProps.path}
            exact={pProps.exact}
            render={props =>
                window.authenticated ?
                        React.createElement(pProps.component, { ...props})
                        : (
                            <div><Redirect to="/" /></div>
                        )
            }
        />
    )
};

export default ProtectedRoute;
