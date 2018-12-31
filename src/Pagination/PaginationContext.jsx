import React from 'react';
import PropTypes from 'prop-types';
import Pagination from './Pagination';

export default (isRemotePagination, handleRemotePageChange) => {
  const PaginationContext = React.createContext();

  class PaginationProvider extends React.Component {
    static propTypes = {
      data: PropTypes.array.isRequired,
      pagination: PropTypes.object.isRequired,
      children: PropTypes.node,
    };

    static defaultProps = {
      children: null,
    };

    handleChangePage = selectedPage => {
      const {
        pagination: { options },
      } = this.props;

      if (isRemotePagination()) {
        handleRemotePageChange(selectedPage, options.sizePerPage);
      }
      this.forceUpdate();
    };

    handleChangeSizePerPage = (currentSizePerPage, currentPage) => {
      const {
        pagination: { options },
      } = this.props;

      if (options.onSizePerPageChange) {
        options.onSizePerPageChange(currentSizePerPage, currentPage);
      }

      if (isRemotePagination()) {
        handleRemotePageChange(currentPage, currentSizePerPage);
        return;
      }
      this.forceUpdate();
    };

    render() {
      const {
        data,
        children,
        pagination: { options },
      } = this.props;

      return (
        <PaginationContext.Provider value={{ data }}>
          {children}
          <Pagination
            key="pagination"
            dataSize={options.totalSize || data.length}
            currentPage={options.page}
            currentSizePerPage={options.sizePerPage}
            onPageChange={this.handleChangePage}
            onSizePerPageChange={this.handleChangeSizePerPage}
            paginationTotal={options.paginationTotal}
          />
        </PaginationContext.Provider>
      );
    }
  }

  return {
    Provider: PaginationProvider,
    Consumer: PaginationContext.Consumer,
  };
};
