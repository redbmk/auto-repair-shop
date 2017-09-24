import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Div } from 'glamorous';

import { Card, CardHeader, CardText } from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';

import UserSelect from './user-select';
import NewComment from './new-comment';
import Comment from './comment';
import RepairEditDialog from './repair-edit-dialog';

import firebase from '../firebase';

class RepairEdit extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    repair: PropTypes.object.isRequired,
  }

  state = {
    editingDescription: false,
  }

  toggleCompleted = () => {
    const ref = firebase.database().ref(`/repairs/${this.props.repair.key}/completed`);
    ref.set(!this.props.repair.completed);
  }

  toggleApproved = () => {
    const ref = firebase.database().ref(`/repairs/${this.props.repair.key}/approved`);
    ref.set(!this.props.repair.approved);
  }

  selectUser = user => {
    const ref = firebase.database().ref(`/repairs/${this.props.repair.key}/user`);
    ref.set(user && user.uid);
  }

  get assignUser() {
    if (!this.props.currentUser.isManager) return null;

    return (
      <CardText>
        <UserSelect
          selected={this.props.users[this.props.repair.user]}
          users={this.props.sortedUsers}
          onChange={this.selectUser}
        />
      </CardText>
    );
  }

  get comments() {
    const { repair } = this.props;
    const comments = [];
    for (let key of Object.keys(repair.comments || {})) {
      comments.push({ key, ...repair.comments[key] });
    }

    return comments.sort((a, b) => b.datetime - a.datetime)
      .map(comment => <Comment key={comment.key} {...this.props} comment={comment} />);
  }

  openDialog = () => this.setState({ editingDescription: true });
  closeDialog = () => this.setState({ editingDescription: false });

  get editDialog() {
    if (!this.props.currentUser.isManager) return null;

    return (
      <RepairEditDialog {...this.props}
        open={this.state.editingDescription}
        onClose={this.closeDialog}
      />
    );
  }

  get editButton() {
    if (!this.props.currentUser.isManager) return null;

    return (
      <IconButton tooltip="Edit Repair" onClick={this.openDialog} style={{marginTop: -5}}>
        <EditIcon />
      </IconButton>
    );
  }

  componentWillReceiveProps({ currentUser: { isManager } }) {
    if (!isManager) this.setState({ editingDescription: false });
  }

  render() {
    const { repair, currentUser } = this.props;

    return (
      <Div marginBottom="20">
        <Card>
          <CardHeader
            avatar={this.editButton}
            title={repair.title}
            subtitle={repair.description}
            subtitleStyle={{whiteSpace: 'pre-wrap'}}
          />
          {this.assignUser}
          <CardText>
            <Toggle
              toggled={repair.completed}
              onToggle={this.toggleCompleted}
              disabled={repair.completed && !currentUser.isManager}
              labelPosition="right"
              label="Completed"
            />
            <Toggle
              toggled={repair.approved}
              onToggle={this.toggleApproved}
              disabled={!repair.completed || !currentUser.isManager}
              labelPosition="right"
              label="Approved"
            />
          </CardText>
          <CardText>
            <List>
              <Subheader>Comments</Subheader>
              <NewComment {...this.props} />
              {this.comments}
            </List>
          </CardText>
        </Card>
        {this.editDialog}
      </Div>
    );
  }
}

export default RepairEdit;
