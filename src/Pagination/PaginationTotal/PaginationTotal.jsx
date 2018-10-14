import React from 'react';
import { forbidExtraProps, nonNegativeInteger } from 'airbnb-prop-types';

const propTypes = forbidExtraProps({
  start: nonNegativeInteger.isRequired,
  to: nonNegativeInteger.isRequired,
  total: nonNegativeInteger.isRequired,
});

const PaginationTotal = ({ start, to, total }) => (
  <div style={{ float: 'right', fontSize: '10px', marginTop: '4px', marginRight: '-66px' }}>
    Showing {start} to {to} of {total} Results
  </div>
);

PaginationTotal.propTypes = propTypes;

export default PaginationTotal;
