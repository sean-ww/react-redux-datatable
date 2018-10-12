import React from 'react';
import PropTypes from 'prop-types';

import PageButton from './PageButton';

const propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      active: PropTypes.bool,
      disable: PropTypes.bool,
      title: PropTypes.string,
    }),
  ).isRequired,
  onPageChange: PropTypes.func.isRequired,
};

const PaginatonList = ({ pages, onPageChange }) => (
  <ul className="pagination react-bootstrap-table-page-btns-ul">
    {pages.map(pageProps => (
      <PageButton key={pageProps.page} {...pageProps} onPageChange={onPageChange} />
    ))}
  </ul>
);

PaginatonList.propTypes = propTypes;

export default PaginatonList;
