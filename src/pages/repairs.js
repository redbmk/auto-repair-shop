import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Avatar from 'material-ui/Avatar';

import DeleteIcon from 'material-ui/svg-icons/action/delete';

import ManagerRepairs from './repairs/manager-repairs';
import UserRepairs from './repairs/user-repairs';

import firebase from '../firebase';

function sortUsers(a, b) {
  return a.displayName.localeCompare(b.displayName)
    || a.email.localeCompare(b.email);
}

class Repairs extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
  }

  state = {
    users: {},
    sortedUsers: [],
  }

  get usersRef() {
    return firebase.database().ref('/users');
  }

  get repairsRef() {
    return firebase.database().ref('/repairs');
  }

  componentWillMount() {
    this.usersRef.on('value', this.updateUsers);
  }

  componentWillUnmount() {
    this.usersRef.off('value', this.updateUsers);
  }

  get deletedUser() {
    const icon = <DeleteIcon />;
    return {
      displayName: <i>[ Deleted ]</i>,
      photoURL: <Avatar icon={icon} />,
    };
  }

  updateUsers = snapshot => {
    const users = snapshot.val();
    const sortedUsers = Object.values(users).sort(sortUsers);

    users.deleted = this.deletedUser;

    this.setState({ users, sortedUsers });
  }

  render() {
    const RepairListComponent = this.props.currentUser.isManager ? ManagerRepairs : UserRepairs;

    return <RepairListComponent {...this.props} {...this.state} />;
  }
}

export default Repairs;
