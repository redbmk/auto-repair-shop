import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Div } from 'glamorous';

import UserEdit from '../components/user-edit';
import UserEditDialog from '../components/user-edit-dialog';
import FAB from '../components/fab';

import firebase from '../firebase';

class ManageUsers extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
  }

  state = {
    isEditorOpen: false,
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

  openEditor = () => this.setState({ isEditorOpen: true });
  closeEditor = () => this.setState({ isEditorOpen: false });

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
        <FAB onClick={this.openEditor}/>
        <UserEditDialog open={this.state.isEditorOpen} onClose={this.closeEditor} />
      </Div>
    );
  }
}

export default ManageUsers;
