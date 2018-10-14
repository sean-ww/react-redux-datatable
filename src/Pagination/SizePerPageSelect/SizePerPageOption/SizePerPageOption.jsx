import React from 'react';
import PropTypes from 'prop-types';
import { forbidExtraProps, nonNegativeInteger } from 'airbnb-prop-types';

const propTypes = forbidExtraProps({
  text: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  page: nonNegativeInteger.isRequired,
  onSizePerPageChange: PropTypes.func.isRequired,
});

const SizePerPageOption = ({ text, page, onSizePerPageChange }) => (
  <li key={text} role="presentation" className="dropdown-item">
    <button
      type="button"
      role="menuitem"
      data-page={page}
      onMouseDown={e => {
        e.preventDefault();
        onSizePerPageChange(page);
      }}
    >
      {text}
    </button>
  </li>
);

SizePerPageOption.propTypes = propTypes;

export default SizePerPageOption;
