import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';

import config from './firebase-config.json';

firebase.initializeApp(config);

export default firebase;

export const updateUserData = async ({ uid, displayName, email, photoURL }) => {
  await firebase.database().ref(`/users/${uid}`).update({ uid, displayName, email, photoURL });
  return { uid, displayName, email, photoURL };
}

export const createUser = async user => {
  const url = `https://us-central1-${config.projectId}.cloudfunctions.net/createUser/`;
  const json = await fetchJSON('post', url, user);

  return updateUserData(json.user);
}

const fetchJSON = async (method, url, body) => {
  const token = await firebase.auth().currentUser.getIdToken();
  const urlWithAuth = new URL(url);
  urlWithAuth.searchParams.set('auth', token);

  const response = await fetch(urlWithAuth, {
    method,
    headers: {
      'accept': 'application.json',
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  const json = await response.json();
  if (json && json.error) throw json.error;

  return json;
}

export const api = async (method, endpoint, body) => {
  const url = `${config.databaseURL}/${endpoint}.json`;
  return fetchJSON(method, url, body);
}
