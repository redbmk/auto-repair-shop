import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Div } from 'glamorous';

import UserEdit from '../components/user-edit';

import firebase from '../firebase';

class ManageUsers extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
  }

  state = {
    users: [],
  }

  get usersRef() {
    return firebase.database().ref('/users');
  }

  componentWillMount() {
    this.usersRef.on('value', this.updateUsers);
  }

  componentWillUnmount() {
    this.usersRef.off('value', this.updateUsers);
  }

  updateUsers = usersSnapshot => {
    const users = Object.values(usersSnapshot.val());
    this.setState({ users });
  }

  get users() {
    return this.state.users.map(user => (
      <UserEdit
        key={user.uid}
        user={user}
        isCurrent={this.props.currentUser.uid === user.uid}
      />
    ));
  }

  render() {
    return (
      <Div display="flex" justifyContent="space-between" flexWrap="wrap">
        {this.users}
      </Div>
    );
  }
}

export default ManageUsers;
