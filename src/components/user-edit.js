import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Div } from 'glamorous';

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';

import DeleteIcon from 'material-ui/svg-icons/action/delete';

import firebase from '../firebase';

class UserEdit extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    isCurrent: PropTypes.bool.isRequired,
  }

  get userRef() {
    return firebase.database().ref(`/users/${this.props.user.uid}`);
  }

  toggleManager = () => {
    this.userRef.child('isManager').set(!this.props.user.isManager);
  }

  deleteUser = () => {
    this.userRef.remove();
  }

  get actions() {
    if (this.props.isCurrent) return;

    const icon = <DeleteIcon />;

    return (
      <CardActions>
        <FlatButton
          icon={icon}
          onClick={this.deleteUser}
          secondary={true}
          label="Delete"
        />
      </CardActions>
    );
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
          {this.actions}
        </Card>
      </Div>
    );
  }
}

export default UserEdit;
