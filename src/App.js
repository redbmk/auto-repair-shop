import React, { Component } from 'react';
import firebase from './firebase';

import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';

import { BrowserRouter as Router } from 'react-router-dom';
import RedirectableRoute from './components/redirectable-route';

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

  get routes() {
    if (this.state.loading) {
      return <CircularProgress />;
    }

    const SignIn = () => <FlatButton onClick={this.signIn} label="Sign In with Google" />;
    const Repairs = () => <div>Repairs</div>;

    const requireAuth = !this.state.user && '/sign-in';
    const requireUnauth = this.state.user && '/';

    return (
      <Router>
        <main>
          <RedirectableRoute redirect={requireAuth} exact path="/" component={Repairs} />
          <RedirectableRoute redirect={requireUnauth} exact path="/sign-in" component={SignIn} />
        </main>
      </Router>
    );
  }

  render() {

    const containerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    };

    return (
      <div>
        <AppBar
          title="Auto Repair Shop"
          showMenuIconButton={false}
          iconElementRight={this.appIcons}
        />
        <div style={containerStyle}>{this.routes}</div>
      </div>
    );
  }
}

export default App;
