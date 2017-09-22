import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';

import config from './firebase-config.json';

firebase.initializeApp(config);

export default firebase;
