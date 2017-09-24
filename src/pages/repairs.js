import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Div } from 'glamorous';

import Avatar from 'material-ui/Avatar';

import PersonAddIcon from 'material-ui/svg-icons/social/person-add';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

import RepairList from '../components/repair-list';

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
    repairs: [],
  }

  get usersRef() {
    return firebase.database().ref('/users');
  }

  get repairsRef() {
    return firebase.database().ref('/repairs');
  }

  componentWillMount() {
    this.usersRef.on('value', this.updateUsers);
    this.repairsRef.on('value', this.updateRepairs);
  }

  componentWillUnmount() {
    this.usersRef.off('value', this.updateUsers);
    this.repairsRef.off('value', this.updateRepairs);
  }

  get deletedUser() {
    const icon = <DeleteIcon />;
    return {
      displayName: <i>[ Deleted ]</i>,
      photoURL: <Avatar icon={icon} />,
    };
  }

  get unassignedUser() {
    const icon = <PersonAddIcon />;
    return {
      displayName: <i>[ Unassigned ]</i>,
      photoURL: <Avatar icon={icon} />,
      uid: null,
    };
  }

  updateUsers = snapshot => {
    const users = snapshot.val();
    const sortedUsers = Object.values(users).sort(sortUsers);

    users.unassigned = this.unassignedUser;
    users.deleted = this.deletedUser;

    this.setState({ users, sortedUsers });
  }

  updateRepairs = snapshot => {
    const repairHash = snapshot.val() || {};
    const repairs = [];

    for (let key of Object.keys(repairHash)) {
      repairs.push({ ...repairHash[key], key });
    }

    this.setState({ repairs });
  }

  render() {
    return (
      <Div display="flex" justifyContent="space-between" flexWrap="wrap">
        <RepairList {...this.state} {...this.props} />
      </Div>
    );
  }
}

export default Repairs;
