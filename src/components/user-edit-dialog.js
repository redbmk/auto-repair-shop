import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import { createUser } from '../firebase';

const userDefaults = { displayName: null, email: null, photoURL: null };

class UserEditDialog extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  }

  state = {
    loading: false,
    user: { ...userDefaults },
  }

  get isValid() {
    return this.state.displayName
      && this.state.email
      && this.state.photoURL;
  }

  createUser = async () => {
    if (!this.isValid) return;

    this.setState({ loading: true });

    try {
      await createUser(this.state);
      this.setState({ user: { ...userDefaults } });
    } catch(error) {
      console.error(error);
    }

    this.props.onClose();
    this.setState({ loading: false });
  }

  updateText = (event, value) => {
    this.setState({ [event.target.name]: value });
  }

  onKeyPress = event => {
    if (event.charCode === 13) {
      this.createUser();
      event.preventDefault();
    }
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.props.onClose}
      />,
      <FlatButton
        label="Save"
        primary={true}
        onClick={this.createUser}
        disabled={this.state.loading || !this.isValid}
      />
    ];

    return (
      <Dialog
        title="Add New User"
        actions={actions}
        open={this.props.open}
        modal={false}
        onRequestClose={this.props.onClose}
      >
        <TextField
          floatingLabelText="Display Name"
          defaultValue={this.state.user.displayName}
          name="displayName"
          fullWidth={true}
          onKeyPress={this.onKeyPress}
          onChange={this.updateText}
        />
        <TextField
          floatingLabelText="Email Address"
          defaultValue={this.state.user.email}
          name="email"
          fullWidth={true}
          onKeyPress={this.onKeyPress}
          onChange={this.updateText}
        />
        <TextField
          floatingLabelText="Photo URL"
          defaultValue={this.state.user.photoURL}
          name="photoURL"
          fullWidth={true}
          onKeyPress={this.onKeyPress}
          onChange={this.updateText}
        />
      </Dialog>
    );
  }
}

export default UserEditDialog;
