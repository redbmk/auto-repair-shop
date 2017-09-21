const functions = require('firebase-functions');

exports.assignUser = functions.database.ref('/repairs/{id}').onWrite(({ data }) => {
  const prevUID = data.child('user').previous.val();
  const nextUID = data.child('user').val();

  if (prevUID !== nextUID) {
    const { root } = data.ref;

    return Promise.all([
      prevUID !== null && root.child(`/users/${prevUID}/repairs/${data.key}`).remove(),
      nextUID !== null && root.child(`/users/${nextUID}/repairs/${data.key}`).set(true),
    ].filter(cmd => cmd));
  }
});
