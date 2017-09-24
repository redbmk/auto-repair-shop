import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import firebase from '../firebase';

const repairDefaults = {
  title: '',
  description: '',
};

class RepairEditDialog extends Component {
  static propTypes = {
    repair: PropTypes.object,
    onClose: PropTypes.func.isRequired,
  }

  state = { ...repairDefaults }

  updateRepair = () => {
    const { title, description } = this.state;
    const repair = { title, description };

    if (this.props.repair) {
      const ref = firebase.database().ref(`/repairs/${this.props.repair.key}`);
      ref.update(repair);
    } else {
      firebase.database().ref('/repairs').push(repair);
    }

    this.props.onClose();
  }

  sanitizeRepair(unclean = {}) {
    const clean = { ...repairDefaults };

    for (let prop of Object.keys(clean)) {
      if (unclean[prop] !== undefined) {
        clean[prop] = unclean[prop];
      }
    }

    return clean;
  }

  componentWillReceiveProps({ repair }) {
    if (!this.props.open) {
      this.setState(this.sanitizeRepair(repair));
    }
  }

  updateText = (event, value) => {
    this.setState({ [event.target.name]: value });
  }

  onKeyPress = event => {
    if (event.charCode !== 13) return;
    if (event.target.type === 'text' || !event.shiftKey) {
      this.updateRepair();
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
        onClick={this.updateRepair}
      />
    ];


    const repair = this.sanitizeRepair(this.props.repair);

    return (
      <Dialog
        title={this.props.repair ? "Edit Repair" : "Add New Repair"}
        actions={actions}
        open={this.props.open}
        modal={false}
        onRequestClose={this.props.onRequestClose}
      >
        <TextField
          floatingLabelText="Title"
          multiLine={false}
          defaultValue={repair.title}
          name="title"
          fullWidth={true}
          onKeyPress={this.onKeyPress}
          onChange={this.updateText}
        />
        <TextField
          floatingLabelText="Description"
          multiLine={true}
          rows={1}
          defaultValue={repair.description}
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
