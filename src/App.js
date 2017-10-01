import React, { Component } from 'react';
import firebase from './firebase';
import glamorous from 'glamorous';

import CircularProgress from 'material-ui/CircularProgress';

import { Redirect, Route, Switch } from 'react-router-dom';
import RedirectableRoute from './components/redirectable-route';

import Center from './components/center';
import AppBarWithLinks from './components/app-bar-with-links';

import SignIn from './pages/sign-in';
import ManageUsers from './pages/manage-users';
import Repairs from './pages/repairs';
import RESTTest from './pages/rest-test';

const Main = glamorous.main({
  padding: '20px',
  boxSizing: 'border-box',
  height: '100%',
  width: '100%',
  overflowY: 'auto',
});

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '100vh',
});

class App extends Component {
  state = {
    loading: true,
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
          this.removeUserRefListener();
          this.setState({ loading: false, user: null, userRef: null });
        }
      }),
    });
  }

  removeUserRefListener() {
    if (this.state.userRef) {
      this.state.userRef.off('value', this.setUserState);
    }
  }

  componentWillUnmount() {
    this.state.authListenerUnsubscribe();
    this.removeUserRefListener();
  }

  setUserState = userSnapshot => {
    this.setState({ loading: false, user: userSnapshot.val() });
  }

  get routes() {
    if (this.state.loading) {
      return <Center height="100%" width="100%"><CircularProgress /></Center>;
    }

    const { isManager } = this.state.user || {};

    const requireAuth = !this.state.user && '/sign-in';
    const requireManager = !isManager && '/sign-in';
    const requireUnauth = this.state.user && '/';

    return (
      <Switch>
        <RedirectableRoute exact path="/"
          redirect={requireAuth}
          component={Repairs}
          props={{currentUser: this.state.user}}
        />
        <RedirectableRoute path="/manage-users"
          redirect={requireManager}
          component={ManageUsers}
          props={{currentUser: this.state.user}}
        />
        <RedirectableRoute redirect={requireUnauth} path="/sign-in" component={SignIn} />
        <RedirectableRoute redirect={requireManager} path="/rest-test" component={RESTTest} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    );
  }

  render() {
    return (
      <Container>
        <AppBarWithLinks user={this.state.user} />
        <Main>{this.routes}</Main>
      </Container>
    );
  }
}

export default App;
