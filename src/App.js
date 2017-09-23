import React, { Component } from 'react';
import firebase from './firebase';

import CircularProgress from 'material-ui/CircularProgress';
import AppBar from 'material-ui/AppBar';

import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import RedirectableRoute from './components/redirectable-route';

import UserMenu from './components/user-menu';
import GithubLink from './components/github-link';

import SignIn from './pages/sign-in';

class App extends Component {
  state = {
    loading: true,
    alive: true,
    user: null,
    userRef: null,
  };

  componentWillMount() {
    this.setState({
      authListenerUnsubscribe: firebase.auth().onAuthStateChanged(authUser => {
        if (authUser) {
          const userRef = firebase.database().ref(`/users/${authUser.uid}`)
          userRef.on('value', this.setUserState);

          this.setState({ userRef });
        } else {
          if (this.state.userRef) {
            this.state.userRef.off('value', this.setUserState);
          }

          this.setState({ loading: false, user: null, userRef: null });
        }
      }),
    });
  }

  componentWillUnmount() {
    this.state.authListenerUnsubscribe();
  }

  signOut = () => firebase.auth().signOut();
  setUserState = userSnapshot => {
    this.setState({ loading: false, user: userSnapshot.val() });
  }

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

    const Repairs = () => <div>Repairs</div>;
    const ManageUsers = () => <div>Manage Users</div>;

    const { isManager } = this.state.user || {};

    const requireAuth = !this.state.user && '/sign-in';
    const requireManager = !isManager && '/sign-in';
    const requireUnauth = this.state.user && '/';

    return (
      <Router>
        <main>
          <Switch>
            <RedirectableRoute redirect={requireAuth} exact path="/" component={Repairs} />
            <RedirectableRoute redirect={requireManager} path="/manage-users" component={ManageUsers} />
            <RedirectableRoute redirect={requireUnauth} path="/sign-in" component={SignIn} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
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
