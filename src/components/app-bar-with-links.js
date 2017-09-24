import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';

import UserMenu from './user-menu';
import GithubLink from './github-link';

const flatButtonStyles = {
  color: 'white',
  top: 5,
};

export default class AppBarWithLinks extends Component {
  get isManager() {
    return this.props.user && this.props.user.isManager;
  }

  get manageUsersLink() {
    if (!this.isManager) return null;

    const link = <Link to="/manage-users" />;
    return (
      <FlatButton
        style={flatButtonStyles}
        containerElement={link}
        label="Manager Users"
      />
    );
  }

  get repairsLink() {
    if (!this.isManager) return null;

    const link = <Link to="/" />;
    return (
      <FlatButton
        style={flatButtonStyles}
        containerElement={link}
        label="Repairs"
      />
    );
  }

  get appIcons() {
    return (
      <div>
        {this.manageUsersLink}
        {this.repairsLink}
        <UserMenu user={this.props.user} />
        <GithubLink />
      </div>
    );
  }

  render() {
    return (
      <AppBar
        title="Auto Repair Shop"
        style={{flexShrink: 0}}
        showMenuIconButton={false}
        iconElementRight={this.appIcons}
      />
    );
  }
}
