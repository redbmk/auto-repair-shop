import React, { Component } from 'react';
import firebase from './firebase';

import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';

import UserMenu from './components/user-menu';
import GithubLink from './components/github-link';

class App extends Component {
  state = {
    loading: true,
    alive: true,
    user: null,
  };

  componentWillMount() {
    this.setState({
      authListenerUnsubscribe: firebase.auth().onAuthStateChanged(user => {
        this.setState({ loading: false, user });
      }),
    });
  }

  componentWillUnmount() {
    this.state.authListenerUnsubscribe();
  }

  signIn = () => firebase.auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .catch(err => null);

  signOut = () => firebase.auth().signOut();

  get appIcons() {
    return (
      <div>
        <UserMenu user={this.state.user} signOut={this.signOut} />
        <GithubLink />
      </div>
    );
  }

  render() {
    const signInButton = !this.state.loading && !this.state.user &&
      <FlatButton onClick={this.signIn} label="Sign In with Google" />;

    return (
      <div>
        <AppBar
          title="Auto Repair Shop"
          showMenuIconButton={false}
          iconElementRight={this.appIcons}
        />
        {signInButton}
      </div>
    );
  }
}

export default App;
