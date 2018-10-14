import cs from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { forbidExtraProps, nonNegativeInteger } from 'airbnb-prop-types';
import { calculateFromTo, calculatePageCount, createListItems } from './Pagination.helpers';
import SizePerPageSelect from './SizePerPageSelect/SizePerPageSelect';
import PaginationList from './PaginationList/PaginationList';
import PaginationTotal from './PaginationTotal/PaginationTotal';
import { LIST_ITEMS } from './constants';

const propTypes = forbidExtraProps({
  dataSize: nonNegativeInteger.isRequired,
  currentPage: nonNegativeInteger.isRequired,
  currentSizePerPage: nonNegativeInteger.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onSizePerPageChange: PropTypes.func.isRequired,
});

class Pagination extends React.Component {
  state = {
    isDropDownOpen: false,
  };

  toggleDropDown = () => {
    this.setState(prevState => ({
      isDropDownOpen: !prevState.isDropDownOpen,
    }));
  };

  closeDropDown = () => {
    this.setState(() => ({
      isDropDownOpen: false,
    }));
  };

  handleChangeSizePerPage = sizePerPage => {
    const { currentPage, currentSizePerPage, dataSize, onSizePerPageChange } = this.props;

    if (sizePerPage !== currentSizePerPage) {
      const newPageCount = calculatePageCount(sizePerPage, dataSize);
      onSizePerPageChange(sizePerPage, Math.min(newPageCount, currentPage));
    }
    this.closeDropDown();
  };

  getNewPageNumber = newPage => {
    const { currentPage, currentSizePerPage, dataSize } = this.props;
    const pageCount = calculatePageCount(currentSizePerPage, dataSize);

    if (newPage === LIST_ITEMS.PREVIOUS.TEXT) return currentPage - 1;
    if (newPage === LIST_ITEMS.NEXT.TEXT) return Math.min(currentPage + 1, pageCount);
    if (newPage === LIST_ITEMS.LAST.TEXT) return pageCount;
    if (newPage === LIST_ITEMS.FIRST.TEXT) return 1;

    return parseInt(newPage, 10);
  };

  handleChangePage = newPage => {
    const { currentPage, onPageChange } = this.props;
    const newPageNumber = this.getNewPageNumber(newPage);
    if (newPageNumber !== currentPage) {
      onPageChange(newPageNumber);
    }
  };

  render() {
    const { isDropDownOpen } = this.state;
    const { currentPage, dataSize, currentSizePerPage } = this.props;
    const pageCount = calculatePageCount(currentSizePerPage, dataSize);
    const paginationListItems = createListItems(currentPage, pageCount);

    const [from, to] = calculateFromTo(currentPage, currentSizePerPage, dataSize);
    const pageListClass = cs('react-bootstrap-table-pagination-list', 'col-md-6 col-xs-6 col-sm-6 col-lg-6', {
      'react-bootstrap-table-pagination-list-hidden': pageCount === 1,
    });
    return (
      <div className="row react-bootstrap-table-pagination">
        <div className="col-md-6 col-xs-6 col-sm-6 col-lg-6">
          <SizePerPageSelect
            currentSizePerPage={`${currentSizePerPage}`}
            isOpen={isDropDownOpen}
            onBlur={this.closeDropDown}
            onClick={this.toggleDropDown}
            onSizePerPageChange={this.handleChangeSizePerPage}
          />
          <PaginationTotal start={from} to={to} total={dataSize} />
        </div>
        <div className={pageListClass}>
          <PaginationList pages={paginationListItems} onPageChange={this.handleChangePage} />
        </div>
      </div>
    );
  }
}

Pagination.propTypes = propTypes;

export default Pagination;
