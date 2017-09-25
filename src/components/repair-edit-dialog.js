import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Div } from 'glamorous';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import firebase from '../firebase';
import { asDate, asTime, serializeDate, serializeTime, hourRange, formatDateTime } from '../moment';

const repairDefaults = {
  title: null,
  description: null,
  date: null,
  time: null,
  key: null,
};

class RepairEditDialog extends Component {
  static propTypes = {
    repair: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    blockedTimes: PropTypes.array.isRequired,
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
      date: serializeDate(repair.date),
      time: serializeTime(repair.time),
    };
  }

  get validationErrors() {
    const repair = this.validatedRepair;

    let error;
    if (repair) {
      const repairRange = hourRange(repair);
      const errors = this.props.blockedTimes
        .filter(({ key }) => key !== repair.key)
        .filter(({ range }) => range.overlaps(repairRange))
        .map(({ range }) => range.toDate().map(formatDateTime).join(' - '))
        .map((text, index) => <p key={index}>{text}</p>);

      if (errors.length) {
        error = (
          <div>
            <p>The following date ranges conflict with the time you've chosen:</p>
            {errors}
          </div>
        );
      }
    } else {
      error = 'All fields are required.';
    }

    return error ? <Div color="red">{error}</Div> : null;
  }

  updateRepair = () => {
    if (this.validationErrors) return;

    const repair = { ...this.validatedRepair, key: null };

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
        value = asDate(value);
      }

      if (value && prop === 'time') {
        value = asTime(value);
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

  updateDate = (event, date) => this.setState({ date: asDate(date) })
  updateTime = (event, time) => this.setState({ time: asTime(time) })

  onKeyPress = event => {
    if (event.charCode !== 13) return;
    if (event.target.type === 'text' || !event.shiftKey) {
      this.updateRepair();
      event.preventDefault();
    }
  }

  render() {
    const repair = this.sanitizeRepair(this.state);

    const validationErrors = this.validationErrors;

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
        disabled={!!validationErrors}
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
        <Div display="flex" justifyContent="flex-start">
          <DatePicker
            hintText="Date"
            name="date"
            style={{marginRight: 20}}
            onChange={this.updateDate}
            value={repair.date && new Date(repair.date)}
          />
          <TimePicker
            hintText="Time"
            name="date"
            value={repair.time && new Date(repair.time)}
            onChange={this.updateTime}
          />
        </Div>
        {validationErrors}
      </Dialog>
    );
  }
}

export default RepairEditDialog;
