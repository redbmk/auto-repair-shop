import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import firebase from '../firebase';

class SignIn extends Component {
  saveUser({ uid, displayName, email, photoURL }) {
    firebase.database().ref(`/users/${uid}`).update({ uid, displayName, email, photoURL });
  }

  signIn = () => firebase.auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(({ user }) => this.saveUser(user))
    .catch(err => null);

  render() {
    return <RaisedButton onClick={this.signIn} label="Sign In with Google" />;
  }
}

export default SignIn;
