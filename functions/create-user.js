// Adapted from https://github.com/firebase/functions-samples/blob/master/authorized-https-endpoint/functions/index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({ origin: true });
const app = express();
const bodyParser = require('body-parser');

const validateUserIsManager = (req, res, next) => {
  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if (req.cookies.__session) {
    idToken = req.cookies.__session;
  } else {
    return next();
  }

  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    req.user = decodedIdToken;
    next();
  }).catch(error => next());
};

const unauthorized = res => res.status(403).json({ error: "Unauthorized" });

const requireManager = (req, res, next) => {
  if (!req.user) return unauthorized(res);

  admin.database().ref(`/users/${req.user.uid}/isManager`)
  .once('value', snapshot => snapshot.val() === true ? next() : unauthorized(res));
};

app.use(cors);
app.use(cookieParser);
app.use(validateUserIsManager);
app.use(requireManager);
app.use(bodyParser.json());
app.post('/', (req, res) => {
  const { email, displayName, photoURL } = req.body;

  admin.auth().createUser({ email, displayName, photoURL })
    .then(user => res.json({ success: true, user }))
    .catch(error => res.status(400).json({ error }));
});

exports.createUser = functions.https.onRequest(app);
