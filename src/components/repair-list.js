import React from 'react';
import PropTypes from 'prop-types';

import { Div } from 'glamorous';

import RepairEdit from './repair-edit';

const RepairList = ({ repairs, ...rest }) => {
  const editors = repairs.map(repair => (
    <RepairEdit
      key={repair.key}
      repair={repair}
      {...rest}
    />
  ));

  return (
    <Div display="flex" justifyContent="space-between" flexWrap="wrap">
      {editors}
    </Div>
  );
}

RepairList.propTypes = {
  currentUser: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  sortedUsers: PropTypes.array.isRequired,
  repairs: PropTypes.array.isRequired,
}

export default RepairList;
