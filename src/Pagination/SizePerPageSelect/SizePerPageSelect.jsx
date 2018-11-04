import React from 'react';
import cs from 'classnames';
import PropTypes from 'prop-types';
import { forbidExtraProps } from 'airbnb-prop-types';
import SizePerPageOption from './SizePerPageOption/SizePerPageOption';
import { SIZE_PER_PAGE_LIST } from '../constants';

const propTypes = forbidExtraProps({
  currentSizePerPage: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onSizePerPageChange: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  options: PropTypes.array,
});

const defaultProps = {
  isOpen: false,
  options: SIZE_PER_PAGE_LIST,
};

const SizePerPageSelect = props => {
  const { isOpen, onClick, onBlur, options, currentSizePerPage, onSizePerPageChange } = props;

  const openClass = isOpen ? 'open show' : '';
  const classes = cs(openClass, 'react-bs-table-sizePerPage-dropdown', 'dropdown');

  return (
    <span className={classes}>
      <button
        type="button"
        id="pageDropDown"
        className="btn btn-default btn-secondary dropdown-toggle"
        data-toggle="dropdown"
        aria-expanded={isOpen}
        onClick={onClick}
        onBlur={onBlur}
      >
        {currentSizePerPage}{' '}
        <span>
          <span className="caret" />
        </span>
      </button>
      <ul className={`dropdown-menu ${openClass}`} role="menu" aria-labelledby="pageDropDown">
        {options.map(option => (
          <SizePerPageOption key={option} text={option} page={option} onSizePerPageChange={onSizePerPageChange} />
        ))}
      </ul>
    </span>
  );
};

SizePerPageSelect.propTypes = propTypes;
SizePerPageSelect.defaultProps = defaultProps;

export default SizePerPageSelect;
