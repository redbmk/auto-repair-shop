import React from 'react';
import GithubLogo from './github-logo';
import IconButton from 'material-ui/IconButton';

export default function GithubLink() {
  return (
    <IconButton
      style={{verticalAlign: null}}
      tooltip="View project on GitHub"
      tooltipPosition="bottom-left"
      href="https://github.com/redbmk/auto-repair-shop"
      iconStyle={{width: 24, height: 24}}
    >
      <GithubLogo color="white" />
    </IconButton>
  );
}
