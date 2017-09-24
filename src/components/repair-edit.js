import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Div } from 'glamorous';

import { Card, CardHeader, CardText } from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';

import UserSelect from './user-select';

import firebase from '../firebase';

class RepairEdit extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    repair: PropTypes.object.isRequired,
  }

  toggleCompleted = () => {
    const ref = firebase.database().ref(`/repairs/${this.props.repair.key}/completed`);
    ref.set(!this.props.repair.completed);
  }

  get userHeader() {
    const { repair, users, currentUser } = this.props;
    if (currentUser.uid === repair.user && !currentUser.isManager) return null;

    const user = repair.user
      ? users[repair.user] || users.deleted
      : users.unassigned;

    return (
      <CardHeader
        title={user.displayName}
        subtitle={user.email}
        avatar={user.photoURL}
      />
    );
  }

  selectUser = user => {
    const ref = firebase.database().ref(`/repairs/${this.props.repair.key}/user`);
    ref.set(user && user.uid);
  }

  get assignUser() {
    if (!this.props.currentUser.isManager) return null;

    return (
      <CardText>
        <UserSelect
          selected={this.props.users[this.props.repair.user]}
          users={this.props.sortedUsers}
          onChange={this.selectUser}
        />
      </CardText>
    );
  }

  render() {
    const { repair, currentUser } = this.props;

    return (
      <Div marginBottom="20">
        <Card>
          <CardHeader
            title={repair.title}
            subtitle={repair.description}
          />
          {this.assignUser}
          <CardText>
            <Toggle
              toggled={repair.completed}
              onToggle={this.toggleCompleted}
              disabled={repair.completed && !currentUser.isManager}
              labelPosition="right"
              label="Completed"
            />
          </CardText>
          {this.userHeader}
          <CardText>
            Hello world
          </CardText>
        </Card>
      </Div>
    );
  }
}

export default RepairEdit;
