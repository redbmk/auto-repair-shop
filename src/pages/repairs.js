import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Div } from 'glamorous';

import RepairList from '../components/repair-list';

import firebase from '../firebase';

class Repairs extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
  }

  state = {
    users: {},
    repairs: [],
  }

  get usersRef() {
    return firebase.database().ref('/users');
  }

  get repairsRef() {
    return firebase.database().ref('/repairs');
  }

  componentWillMount() {
    this.usersRef.on('value', this.updateUsers);
    this.repairsRef.on('value', this.updateRepairs);
  }

  componentWillUnmount() {
    this.usersRef.off('value', this.updateUsers);
    this.repairsRef.off('value', this.updateRepairs);
  }

  updateUsers = snapshot => {
    this.setState({ users: snapshot.val() });
  }

  updateRepairs = snapshot => {
    const repairHash = snapshot.val() || {};
    const repairs = [];

    for (let key of Object.keys(repairHash)) {
      repairs.push({ ...repairHash[key], key });
    }

    this.setState({ repairs });
  }

  render() {
    return (
      <Div display="flex" justifyContent="space-between" flexWrap="wrap">
        <RepairList {...this.state} {...this.props} />
      </Div>
    );
  }
}

export default Repairs;
