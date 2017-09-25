import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import moment from 'moment';

import firebase from '../firebase';

const FORMATS = {
  DATE: 'YYYYMMDD',
  TIME: 'HH:mm',
};

const repairDefaults = {
  title: null,
  description: null,
  date: null,
  time: null,
};

class RepairEditDialog extends Component {
  static propTypes = {
    repair: PropTypes.object,
    onClose: PropTypes.func.isRequired,
  }

  state = { ...repairDefaults }

  get validatedRepair() {
    const repair = this.sanitizeRepair(this.state);

    for (let value of Object.values(repair)) {
      if (value === null || value === undefined) {
        return null;
      }
    }

    return {
      ...repair,
      date: repair.date.format(FORMATS.DATE),
      time: repair.time.format(FORMATS.TIME),
    };
  }

  updateRepair = () => {
    const repair = this.validatedRepair;
    if (!repair) return;

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
      let value = clean[prop];

      if (unclean[prop] !== undefined) {
        value = unclean[prop];
      }

      if (value && prop === 'date') {
        value = moment(value, FORMATS.DATE);
      }

      if (value && prop === 'time') {
        value = moment(value, FORMATS.TIME)
      }

      clean[prop] = value;
    }

    return clean;
  }

  componentWillReceiveProps({ repair }) {
    if (!this.props.open) {
      this.setState(this.sanitizeRepair(repair));
    }
  }

  componentWillMount() {
    this.setState(this.sanitizeRepair(this.props.repair));
  }

  updateText = (event, value) => {
    this.setState({ [event.target.name]: value });
  }

  updateDate = (event, date) => this.setState({ date: moment(date) })
  updateTime = (event, time) => this.setState({ time: moment(time) })

  onKeyPress = event => {
    if (event.charCode !== 13) return;
    if (event.target.type === 'text' || !event.shiftKey) {
      this.updateRepair();
      event.preventDefault();
    }
  }

  render() {
    const repair = this.sanitizeRepair(this.state);

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
        disabled={!this.validatedRepair}
      />
    ];

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
        <DatePicker
          hintText="Date"
          name="date"
          onChange={this.updateDate}
          value={repair.date && new Date(repair.date)}
        />
        <TimePicker
          hintText="Time"
          name="date"
          value={repair.time && new Date(repair.time)}
          onChange={this.updateTime}
        />
      </Dialog>
    );
  }
}

export default RepairEditDialog;
