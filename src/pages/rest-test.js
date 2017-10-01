import React, { Component } from 'react';

import JSONPretty from 'react-json-pretty';

import { api } from '../firebase';

import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardText } from 'material-ui/Card';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  card: {
    margin: 10,
    overflow: 'hidden',
  },
  json: {
    width: 350,
    minHeight: 100,
    maxHeight: 250,
    overflowX: 'auto',
  }
};

class RESTTest extends Component {
  state = { }

  getUser = async () => {
    this.setState({
      getUser: await api('GET', 'users/pizzamike'),
    });
  }

  putUser = async () => {
    this.setState({
      putUser: await api('PUT', 'users/pizzamike', {
        displayName: 'Mike',
        photoURL: 'https://goo.gl/Ak9KrU',
        email: 'pizzalover@turtle.power',
        uid: 'pizzamike',
      }),
    });
  }

  patchUser = async () => {
    this.setState({
      patchUser: await api('PATCH', 'users/pizzamike', {
        displayName: 'Leo',
        photoURL: 'https://goo.gl/JK3Ei1',
      }),
    });
  }

  deleteUser = async () => {
    this.setState({
      deleteUser: await api('DELETE', 'users/pizzamike'),
    });
  }

  getRepairs = async () => {
    this.setState({
      getRepairs: await api('GET', 'repairs'),
    });
  }

  postRepairs = async () => {
    this.setState({
      postRepairs: await api('POST', 'repairs', {
        date: '19840501',
        time: '13:00',
        title: 'First TMNT comic',
        description: 'The first appearance of the pizza loving ninjas was in May of 1984',
      }),
    });
  }

  patchRepair = async () => {
    this.setState({
      patchRepair: await api('PATCH', `repairs/${this.state.postRepairs.name}`, {
        date: '19900330',
        title: 'First TMNT movie',
        description: 'Bringing turtle power to the silver screen!',
      }),
    });
  }

  deleteRepair = async () => {
    this.setState({
      deleteRepair: await api('DELETE', `repairs/${this.state.postRepairs.name}`),
    });
  }

  render() {
    return (
      <div style={styles.container}>
        <Card style={styles.card}>
          <CardText><JSONPretty style={styles.json} json={this.state.getUser} /></CardText>
          <CardActions>
            <FlatButton onClick={this.getUser} label="GET /users/{user_id}" />
          </CardActions>
        </Card>

        <Card style={styles.card}>
          <CardText><JSONPretty style={styles.json} json={this.state.putUser} /></CardText>
          <CardActions>
            <FlatButton onClick={this.putUser} label="PUT /users/{user_id}" />
          </CardActions>
        </Card>

        <Card style={styles.card}>
          <CardText><JSONPretty style={styles.json} json={this.state.patchUser} /></CardText>
          <CardActions>
            <FlatButton onClick={this.patchUser} label="PATCH /users/{user_id}" />
          </CardActions>
        </Card>

        <Card style={styles.card}>
          <CardText><JSONPretty style={styles.json} json={this.state.deleteUser} /></CardText>
          <CardActions>
            <FlatButton onClick={this.deleteUser} label="DELETE /users/{user_id}" />
          </CardActions>
        </Card>

        <Card style={styles.card}>
          <CardText><JSONPretty style={styles.json} json={this.state.getRepairs} /></CardText>
          <CardActions>
            <FlatButton onClick={this.getRepairs} label="GET /repairs" />
          </CardActions>
        </Card>

        <Card style={styles.card}>
          <CardText><JSONPretty style={styles.json} json={this.state.postRepairs} /></CardText>
          <CardActions>
            <FlatButton onClick={this.postRepairs} label="POST /repairs" />
          </CardActions>
        </Card>

        <Card style={styles.card}>
          <CardText><JSONPretty style={styles.json} json={this.state.patchRepair} /></CardText>
          <CardActions>
            <FlatButton onClick={this.patchRepair} label="PATCH /repairs/{repair_id}" />
          </CardActions>
        </Card>

        <Card style={styles.card}>
          <CardText><JSONPretty style={styles.json} json={this.state.deleteRepair} /></CardText>
          <CardActions>
            <FlatButton onClick={this.deleteRepair} label="DELETE /repairs/{repair_id}" />
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default RESTTest;