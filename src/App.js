import React, { Component } from 'react';
import firebase from './firebase';
import glamorous from 'glamorous';

import CircularProgress from 'material-ui/CircularProgress';

import { Redirect, Route, Switch } from 'react-router-dom';
import RedirectableRoute from './components/redirectable-route';

import Center from './components/center';
import AppBarWithLinks from './components/app-bar-with-links';

import SignIn from './pages/sign-in';

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

  setUserState = userSnapshot => {
    this.setState({ loading: false, user: userSnapshot.val() });
  }

  get routes() {
    if (this.state.loading) {
      return <Center height="100%" width="100%"><CircularProgress /></Center>;
    }

    const Repairs = () => <div>Repairs</div>;
    const ManageUsers = () => <div>Manage Users</div>;

    const { isManager } = this.state.user || {};

    const requireAuth = !this.state.user && '/sign-in';
    const requireManager = !isManager && '/sign-in';
    const requireUnauth = this.state.user && '/';

    return (
      <Switch>
        <RedirectableRoute redirect={requireAuth} exact path="/" component={Repairs} />
        <RedirectableRoute redirect={requireManager} path="/manage-users" component={ManageUsers} />
        <RedirectableRoute redirect={requireUnauth} path="/sign-in" component={SignIn} />
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
