import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Div } from 'glamorous';

import RepairEdit from './repair-edit';
import RepairFilter from './repair-filter';
import RepairEditDialog from './repair-edit-dialog';
import FAB from './fab';

const sortRepairs = (a, b) => {
  return a.date.localeCompare(b.date)
    || a.time.localeCompare(b.time);
}

class RepairList extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    sortedUsers: PropTypes.array.isRequired,
    repairs: PropTypes.array.isRequired,
  }

  state = {
    isEditorOpen: false,
    filters: [],
  }

  openEditor = () => this.setState({ isEditorOpen: true });
  closeEditor = () => this.setState({ isEditorOpen: false });
  updateFilters = filters => this.setState({ filters });

  get addRepairWidget() {
    if (!this.props.currentUser.isManager) return null;

    return (
      <div>
        <FAB onClick={this.openEditor} />
        <RepairEditDialog {...this.props}
          open={this.state.isEditorOpen}
          onClose={this.closeEditor}
        />
      </div>
    );
  }

  get filteredRepairs() {
    let repairs = [ ...this.props.repairs ];

    for (let filter of this.state.filters) {
      repairs = repairs.filter(filter);
    }

    return repairs.sort(sortRepairs);
  }

  render() {
    const { repairs, ...rest } = this.props;
    const filteredRepairs = this.filteredRepairs;

    const editors = filteredRepairs.map(repair => (
      <RepairEdit
        key={repair.key}
        repair={repair}
        {...rest}
      />
    ));

    return (
      <div>
        <RepairFilter
          subtitle={`Showing ${filteredRepairs.length} of ${repairs.length}`}
          users={this.props.currentUser.isManager ? this.props.sortedUsers : null}
          onChange={this.updateFilters}
        />
        <Div display="flex" justifyContent="space-between" flexWrap="wrap">
          {editors}
        </Div>
        {this.addRepairWidget}
      </div>
    );
  }
}

export default RepairList;
