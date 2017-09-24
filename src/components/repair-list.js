import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Div } from 'glamorous';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import AddIcon from 'material-ui/svg-icons/content/add';

import RepairEdit from './repair-edit';
import RepairEditDialog from './repair-edit-dialog';

const styles = {
  fab: {
    position: 'fixed',
    bottom: 40,
    right: 40,
  }
};

class RepairList extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    sortedUsers: PropTypes.array.isRequired,
    repairs: PropTypes.array.isRequired,
  }

  state = {
    isEditorOpen: false,
  }

  openEditor = () => this.setState({ isEditorOpen: true });
  closeEditor = () => this.setState({ isEditorOpen: false });

  get addRepairWidget() {
    if (!this.props.currentUser.isManager) return null;

    return (
      <div>
        <FloatingActionButton secondary={true} style={styles.fab} onClick={this.openEditor}>
          <AddIcon />
        </FloatingActionButton>
        <RepairEditDialog {...this.props}
          open={this.state.isEditorOpen}
          onClose={this.closeEditor}
        />
      </div>
    );
  }

  render() {
    const { repairs, ...rest } = this.props;

    const editors = repairs.map(repair => (
      <RepairEdit
        key={repair.key}
        repair={repair}
        {...rest}
      />
    ));

    return (
      <div>
        <Div display="flex" justifyContent="space-between" flexWrap="wrap">
          {editors}
        </Div>
        {this.addRepairWidget}
      </div>
    );
  }
}

export default RepairList;
