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

    const Repairs = () => <div>Repairs</div>;

    const requireAuth = !this.state.user && '/sign-in';
    const requireUnauth = this.state.user && '/';

    return (
      <Router>
        <main>
          <Switch>
            <RedirectableRoute redirect={requireAuth} exact path="/" component={Repairs} />
            <RedirectableRoute redirect={requireUnauth} exact path="/sign-in" component={SignIn} />
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
