import React from 'react';
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom';

const RedirectableRoute = ({ component: Component, redirect, ...rest }) => (
  <Route {...rest}
    render={props => redirect
      ? <Redirect to={{ pathname: redirect, state: { from: props.location } }} />
      : <Component {...props} />
    }
  />
);

RedirectableRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default RedirectableRoute;
