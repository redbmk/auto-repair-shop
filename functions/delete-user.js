const functions = require('firebase-functions');

exports.deleteUser = functions.database.ref('/users/{id}').onDelete(({ data }) => {
  const { repairs = {} } = data.previous.val();
  const { root } = data.ref;

  return Promise.all(
    Object.keys(repairs).map(id => root.child(`/repairs/${id}/user`).set(null))
  );
});
