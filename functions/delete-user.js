const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.deleteUser = functions.database.ref('/users/{id}').onDelete(({ data }) => {
  const { repairs = {}, uid } = data.previous.val();
  const { root } = data.ref;

  return Promise.all([
    admin.auth().deleteUser(uid),
    ...Object.keys(repairs).map(id => root.child(`/repairs/${id}/user`).set(null)),
  ]);
});
