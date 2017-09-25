import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Avatar from 'material-ui/Avatar';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class UserSelect extends Component {
  static propTypes = {
    users: PropTypes.array.isRequired,
    selected: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    emptyText: PropTypes.any,
  }

  get menuItems() {
    return this.props.users.map(user => {
      const avatar = <Avatar src={user.photoURL} />;

      return (
        <MenuItem
          key={user.uid}
          value={user}
          primaryText={user.displayName}
          leftIcon={avatar}
        />
      );
    });
  }

  selectionRenderer(user, menuItem) {
    if (!user) return null;

    return (
      <div>
        <Avatar src={user.photoURL} size={20} style={{marginRight: 10, marginBottom: -4}} />
        {user.displayName}
      </div>
    );
  }

  onChange = (event, key, user) => this.props.onChange(user);

  render() {
    const emptyText = this.props.emptyText || <i>Unassigned</i>;

    return (
      <SelectField
        floatingLabelText="Assigned User"
        value={this.props.selected}
        selectionRenderer={this.selectionRenderer}
        onChange={this.onChange}
      >
        <MenuItem value={null} primaryText={emptyText} />
        {this.menuItems}
      </SelectField>
    );
  }
}

export default UserSelect;
