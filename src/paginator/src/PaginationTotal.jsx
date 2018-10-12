import React from 'react';
import PropTypes from 'prop-types';

const PaginationTotal = ({ start, to, total }) => (
  <div style={{ float: 'right', fontSize: '10px', marginTop: '4px', marginRight: '-66px' }}>
    Showing {start} to {to} of {total} Results
  </div>
);

PaginationTotal.propTypes = {
  start: PropTypes.number.isRequired,
  to: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default PaginationTotal;
