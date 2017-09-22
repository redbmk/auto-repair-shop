import React, { Component } from 'react';
import firebase from './firebase';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import AppBar from 'material-ui/AppBar';

class App extends Component {
  state = {
    loading: true,
    user: null,
  };

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ loading: false, user });
    });
  }

  toggleAuth = () => {
    if (this.state.user) {
      firebase.auth().signOut();
    } else {
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }
  }

  render() {
    const label = `Sign ${this.state.user ? 'Out' : 'In with Google'}`;
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="Auto Repair Shop"
            showMenuIconButton={false}
          />
          {this.state.loading
            ? <CircularProgress />
            : <RaisedButton onClick={this.toggleAuth} label={label} />}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
