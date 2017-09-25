import React, { Component } from 'react';
import PropTypes from 'prop-types';

import glamorous from 'glamorous';

import { Card, CardHeader, CardText } from 'material-ui/Card';
// import { List, ListItem } from 'material-ui/List';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import IconButton from 'material-ui/IconButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

import FilterIcon from 'material-ui/svg-icons/content/filter-list';
import ClearIcon from 'material-ui/svg-icons/content/clear';

import { serializeDate, serializeTime } from '../moment';

const fromDateFilter = date => repair => repair.date >= date;
const toDateFilter = date => repair => repair.date <= date;
const fromTimeFilter = time => repair => repair.time >= time;
const toTimeFilter = time => repair => repair.time <= time;

const completedFilter = completed => repair => !!repair.completed === completed;

const Range = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
});

const styles = {
  radioButton: {
    whiteSpace: 'nowrap',
    width: 'auto',
    marginRight: 20,
  },
  radioGroup: {
    display: 'flex',
    margin: 12,
  }
};

class RepairFilter extends Component {
  static propTypes = {
    subtitle: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

  state = {
    fromDate: null,
    toDate: null,
    fromTime: null,
    toTime: null,

    completed: '',
  }

  getFilters(props) {
    const filters = [];

    if (props.fromDate) filters.push(fromDateFilter(serializeDate(props.fromDate)));
    if (props.toDate) filters.push(toDateFilter(serializeDate(props.toDate)));
    if (props.fromTime) filters.push(fromTimeFilter(serializeTime(props.fromTime)));
    if (props.toTime) filters.push(toTimeFilter(serializeTime(props.toTime)));

    if (props.completed !== '') filters.push(completedFilter(props.completed));

    return filters;
  }

  updateField(field, value = null) {
    const state = { ...this.state, [field]: value };
    const filters = this.getFilters(state);
    console.log(state, filters);

    this.props.onChange(filters);
    this.setState(state);
  }

  updateFromDate = (event, date) => this.updateField('fromDate', date)
  updateToDate = (event, date) => this.updateField('toDate', date)
  updateFromTime = (event, time) => this.updateField('fromTime', time)
  updateToTime = (event, time) => this.updateField('toTime', time)

  updateFieldFromEvent = (event, value) => {
    this.updateField(event.target.name, value)
  }

  render() {
    return (
      <Card>
        <CardHeader
          avatar={<FilterIcon />}
          title="Filter Repairs"
          subtitle={this.props.subtitle}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <Range>
            <IconButton onClick={this.updateFromDate} disabled={!this.state.fromDate}>
              <ClearIcon />
            </IconButton>
            <DatePicker
              hintText="From Date"
              name="date"
              onChange={this.updateFromDate}
              value={this.state.fromDate}
            />
            <IconButton onClick={this.updateToDate} disabled={!this.state.toDate}>
              <ClearIcon />
            </IconButton>
            <DatePicker
              hintText="To Date"
              name="date"
              onChange={this.updateToDate}
              value={this.state.toDate}
            />
          </Range>

          <Range>
            <IconButton onClick={this.updateFromTime} disabled={!this.state.fromTime}>
              <ClearIcon />
            </IconButton>
            <TimePicker
              hintText="From Time"
              name="date"
              onChange={this.updateFromTime}
              value={this.state.fromTime}
            />
            <IconButton onClick={this.updateToTime} disabled={!this.state.toTime}>
              <ClearIcon />
            </IconButton>
            <TimePicker
              hintText="To Time"
              name="date"
              onChange={this.updateToTime}
              value={this.state.toTime}
            />
          </Range>

          <RadioButtonGroup
            name="completed"
            onChange={this.updateFieldFromEvent}
            style={styles.radioGroup}
          >
            <RadioButton style={styles.radioButton} value="" label="Show All" />
            <RadioButton style={styles.radioButton} value={true} label="Completed" />
            <RadioButton style={styles.radioButton} value={false} label="Incomplete" />
          </RadioButtonGroup>
        </CardText>
      </Card>
    );
  }
}

export default RepairFilter;
