import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Card, CardHeader, CardText } from 'material-ui/Card';
// import { List, ListItem } from 'material-ui/List';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import FilterIcon from 'material-ui/svg-icons/content/filter-list';

import { serializeDate, serializeTime } from '../moment';

const fromDateFilter = date => repair => repair.date >= date;
const toDateFilter = date => repair => repair.date <= date;
const fromTimeFilter = time => repair => repair.time >= time;
const toTimeFilter = time => repair => repair.time <= time;

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
  }

  getFilters(props) {
    const filters = [];

    if (props.fromDate) filters.push(fromDateFilter(serializeDate(props.fromDate)));
    if (props.toDate) filters.push(toDateFilter(serializeDate(props.toDate)));
    if (props.fromTime) filters.push(fromTimeFilter(serializeTime(props.fromTime)));
    if (props.toTime) filters.push(toTimeFilter(serializeTime(props.toTime)));

    return filters;
  }

  updateField(field, value) {
    const state = { ...this.state, [field]: value };
    const filters = this.getFilters(state);

    this.props.onChange(filters);
    this.setState(state);
  }

  updateFromDate = (event, date) => this.updateField('fromDate', date)
  updateToDate = (event, date) => this.updateField('toDate', date)
  updateFromTime = (event, time) => this.updateField('fromTime', time)
  updateToTime = (event, time) => this.updateField('toTime', time)

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
          <DatePicker
            hintText="Minimum Date"
            name="date"
            onChange={this.updateFromDate}
            value={this.state.fromDate}
          />
          <DatePicker
            hintText="Maximum Date"
            name="date"
            onChange={this.updateToDate}
            value={this.state.toDate}
          />
          <TimePicker
            hintText="Minimum Time"
            name="date"
            onChange={this.updateFromTime}
            value={this.state.fromTime}
          />
          <TimePicker
            hintText="Maximum Time"
            name="date"
            onChange={this.updateToTime}
            value={this.state.toTime}
          />
        </CardText>
      </Card>
    );
  }
}

export default RepairFilter;
