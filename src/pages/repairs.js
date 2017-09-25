import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

  componentWillMount() {
    const usersRef = firebase.database().ref('/users');
    usersRef.on('value', this.updateUsers);

    this.setState({ usersRef });
  }

  componentWillUnmount() {
    this.state.usersRef.off('value', this.updateUsers);
  }

  updateUsers = snapshot => {
    const users = snapshot.val();
    const sortedUsers = Object.values(users).sort(sortUsers);

    this.setState({ users, sortedUsers });
  }

  render() {
    const RepairListComponent = this.props.currentUser.isManager ? ManagerRepairs : UserRepairs;

    return <RepairListComponent {...this.props} {...this.state} />;
  }
}

export default Repairs;
