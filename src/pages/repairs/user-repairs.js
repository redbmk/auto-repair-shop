import React, { Component } from 'react';
import PropTypes from 'prop-types';

import firebase from '../../firebase';
import RepairList from '../../components/repair-list';

class UserRepairs extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
  }

  state = {
    refs: {},
    repairs: {},
  }

  subscribeToRepair(key) {
    const ref = firebase.database().ref(`/repairs/${key}`);
    ref.on('value', this.updateRepair);
    return ref;
  }

  updateRefs({ repairs: newRepairs = {} }) {
    for (let key of Object.keys(this.state.refs)) {
      if (this.state.refs[key] && !(key in newRepairs)) {
        this.state.refs[key].off('value', this.updateRepair);
      }
    }

    let refs = {};
    let repairs = {};

    for (let key of Object.keys(newRepairs)) {
      refs[key] = this.state.refs[key] || this.subscribeToRepair(key);

      if (this.state.repairs[key]) {
        repairs[key] = this.state.repairs[key];
      }
    }

    this.setState({ refs, repairs });
  }

  componentWillReceiveProps({ currentUser }) {
    this.updateRefs(currentUser);
  }

  componentWillMount() {
    this.updateRefs(this.props.currentUser);
  }

  componentWillUnmount() {
    for (let ref of Object.values(this.state.refs)) {
      ref.off('value', this.updateRepair);
    }
  }

  updateRepair = snapshot => {
    if (snapshot.exists()) {
      const { key } = snapshot;

      this.setState({
        repairs: {
          ...this.state.repairs,
          [key]: { ...snapshot.val(), key },
        },
      });
    }
  }

  render() {
    return <RepairList {...this.props} repairs={Object.values(this.state.repairs)} />;
  }
}

export default UserRepairs;;
