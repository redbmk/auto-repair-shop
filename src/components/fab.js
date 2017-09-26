import React from 'react';
import PropTypes from 'prop-types';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import AddIcon from 'material-ui/svg-icons/content/add';

const styles = {
  fab: {
    position: 'fixed',
    bottom: 40,
    right: 40,
  }
};

const FAB = ({ onClick }) => (
  <FloatingActionButton secondary={true} style={styles.fab} onClick={onClick}>
    <AddIcon />
  </FloatingActionButton>
);

FAB.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default FAB;
