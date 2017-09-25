import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import { lightBlack } from 'material-ui/styles/colors';

import { formatDateTime } from '../moment';

const styles = {
  datetime: {
    fontSize: '.7em',
    color: lightBlack,
    paddingLeft: 4,
  },
  message: {
    height: 'auto',
    whiteSpace: 'pre-wrap',
  }
};

const Comment = ({ comment, users }) => {

  const user = users[comment.user] || users.deleted;
  const avatar = typeof user.photoURL === 'string'
    ? <Avatar src={user.photoURL} />
    : user.photoURL;

  const primaryText = (
    <span>
      {user.displayName}
      <span style={styles.datetime}>{formatDateTime(comment.datetime)}</span>
    </span>
  );

  const secondaryText = <p style={styles.message}>{comment.message}</p>;

  return (
    <ListItem
      leftAvatar={avatar}
      disabled={true}
      primaryText={primaryText}
      secondaryText={secondaryText}
    />
  );
}

Comment.proptypes = {
  comment: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
}

export default Comment;
