import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Div } from 'glamorous';

import { Card, CardHeader, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Toggle from 'material-ui/Toggle';

import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Delete from 'material-ui/svg-icons/action/delete';

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

  get deletedUser() {
    const icon = <Delete />;
    return {
      displayName: <i>[ Deleted ]</i>,
      photoURL: <Avatar icon={icon} />,
    };
  }

  get unassignedUser() {
    const icon = <PersonAdd />;
    return {
      displayName: <i>[ Unassigned ]</i>,
      photoURL: <Avatar icon={icon} />,
    };
  }

  get userHeader() {
    const { repair, users, currentUser } = this.props;

    if (currentUser.uid === repair.user && !currentUser.isManager) return null;

    const user = repair.user
      ? users[repair.user] || this.deletedUser
      : this.unassignedUser;

    return (
      <CardHeader
        title={user.displayName}
        subtitle={user.email}
        avatar={user.photoURL}
      />
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
