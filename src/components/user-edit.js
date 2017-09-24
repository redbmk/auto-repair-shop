import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Div } from 'glamorous';

import { Card, CardHeader, CardText } from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';

import firebase from '../firebase';

class UserEdit extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    isCurrent: PropTypes.bool.isRequired,
  }

  toggleManager = () => {
    const ref = firebase.database().ref(`/users/${this.props.user.uid}/isManager`);
    ref.set(!this.props.user.isManager);
  }

  render() {
    const { user, isCurrent } = this.props;

    return (
      <Div marginBottom="20">
        <Card>
          <CardHeader
            title={user.displayName}
            subtitle={user.email}
            avatar={user.photoURL}
          />
          <CardText>
            <Toggle
              toggled={user.isManager}
              onToggle={this.toggleManager}
              disabled={isCurrent}
              labelPosition="right"
              label="Manager"
            />
          </CardText>
        </Card>
      </Div>
    );
  }
}

export default UserEdit;
