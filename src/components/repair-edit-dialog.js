import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import firebase from '../firebase';

class RepairEditDialog extends Component {
  static propTypes = {
    repair: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  state = {
    title: '',
    description: '',
  }

  updateRepair = () => {
    const ref = firebase.database().ref(`/repairs/${this.props.repair.key}`);
    const { title, description } = this.state;

    ref.update({ title, description });

    this.props.onClose();
  }

  componentWillReceiveProps({ repair: { title, description } }) {
    if (!this.props.open) {
      this.setState({ title, description });
    }
  }

  updateText = (event, value) => {
    this.setState({ [event.target.name]: value });
  }

  onKeyPress = event => {
    if (event.charCode !== 13) return;
    if (event.target.type === 'text' || !event.shiftKey) this.updateRepair();

    event.preventDefault();
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
        onClick={this.updateRepair}
      />
    ];

    return (
      <Dialog
        title="Edit Repair"
        actions={actions}
        open={this.props.open}
        modal={false}
        onRequestClose={this.props.onRequestClose}
      >
        <TextField
          floatingLabelText="Title"
          multiLine={false}
          defaultValue={this.props.repair.title}
          name="title"
          fullWidth={true}
          onKeyPress={this.onKeyPress}
          onChange={this.updateText}
        />
        <TextField
          floatingLabelText="Description"
          multiLine={true}
          rows={1}
          defaultValue={this.props.repair.description}
          name="description"
          fullWidth={true}
          onKeyPress={this.onKeyPress}
          onChange={this.updateText}
        />
      </Dialog>
    );
  }
}

export default RepairEditDialog;
