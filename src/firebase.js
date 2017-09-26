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
  const token = await firebase.auth().currentUser.getIdToken();

  const response = await fetch(url, {
    method: 'post',
    headers: {
      'accept': 'application.json',
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });

  const json = await response.json();
  if (json.error) throw json.error;

  return updateUserData(json.user);
}
