import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import firebase, { updateUserData } from '../firebase';

import Center from '../components/center';

class SignIn extends Component {
  signIn = () => firebase.auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(({ user }) => updateUserData(user))
    .catch(err => null);

  render() {
    return (
      <Center>
        <RaisedButton onClick={this.signIn} label="Sign In with Google" />
      </Center>
    );
  }
}

export default SignIn;
