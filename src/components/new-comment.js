import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import { ListItem } from 'material-ui/List';

import firebase from '../firebase';
import { serializeDateTime } from '../moment';

class NewComment extends Component {
  state = {
    value: '',
  }

  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    repair: PropTypes.object.isRequired,
  }

  onKeyPress = event => {
    if (event.charCode === 13 && !event.shiftKey) {
      if (this.state.value.trim()) {
        firebase.database().ref(`/repairs/${this.props.repair.key}/comments`).push({
          message: this.state.value,
          datetime: serializeDateTime(),
          user: this.props.currentUser.uid,
        });

        this.setState({ value: '' });
      }

      event.preventDefault();
    }
  }

  updateValue = (event, value) => {
    this.setState({ value });
  }

  get inputBlock() {
    return (
      <TextField
        style={{marginTop: -10}}
        hintText="Add a comment"
        multiLine={true}
        value={this.state.value}
        onChange={this.updateValue}
        onKeyPress={this.onKeyPress}
        fullWidth={true}
        rows={1}
      />
    );
  }

  render() {
    const avatar = <Avatar src={this.props.currentUser.photoURL} />;

    return (
      <ListItem
        leftAvatar={avatar}
        disabled={true}
        primaryText={this.inputBlock}
      />
    );
  }
}

export default NewComment;
