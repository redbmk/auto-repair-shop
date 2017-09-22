import React from 'react';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

export default function UserMenu({ user, signOut }) {
  if (!user) return null;

  const button = (
    <IconButton>
      <Avatar src={user.photoURL} size={24} />
    </IconButton>
  );

  return (
    <IconMenu
      iconButtonElement={button}
      targetOrigin={{horizontal: 'right', vertical: 'top'}}
      anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
    >
      <MenuItem primaryText={user.displayName} disabled={true} />
      <MenuItem primaryText="Sign out" onClick={signOut} />
    </IconMenu>
  );
}
