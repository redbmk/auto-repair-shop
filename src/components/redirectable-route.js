import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const RedirectableRoute = ({ component: Component, redirect, ...rest }) => (
  <Route {...rest}
    render={props => redirect
      ? <Redirect to={{ pathname: redirect, state: { from: props.location } }} />
      : <Component {...props} />
    }
  />
);

export default RedirectableRoute;
