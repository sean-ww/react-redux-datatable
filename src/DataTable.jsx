import React from 'react';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter, numberFilter, customFilter } from 'react-bootstrap-table2-filter';
import { forbidExtraProps, nonNegativeInteger } from 'airbnb-prop-types';
import paginationFactory from './Pagination';

import { NO_DATA_INDICATOR } from './constants';

const propTypes = forbidExtraProps({
  dataTotalSize: nonNegativeInteger.isRequired,
  clearFilters: PropTypes.func.isRequired,
  currentPage: nonNegativeInteger.isRequired,
  keyField: PropTypes.string.isRequired,
  onExportToCSV: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSizePerPageChange: PropTypes.func.isRequired,
  onTableChange: PropTypes.func.isRequired,
  refreshTable: PropTypes.func.isRequired,
  sizePerPage: nonNegativeInteger.isRequired,
  startClearingFilters: PropTypes.func.isRequired,
  tableColumns: PropTypes.object.isRequired,
  defaultSort: PropTypes.array,
  extraButtons: PropTypes.func,
  isFiltered: PropTypes.bool,
  noDataIndication: PropTypes.any,
  searchValue: PropTypes.string,
  tableData: PropTypes.any,
});

const defaultProps = {
  defaultSort: null,
  extraButtons: null,
  isFiltered: false,
  noDataIndication: NO_DATA_INDICATOR,
  searchValue: undefined,
  tableData: null,
};

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilters: this.props.isFiltered,
      clearFilters: false,
    };
    this.colRef = {};
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.clearFilters) this.clearAllFilters();
  }

  menuButtonClass = () => ({
    className: 'table-button table-button-menu-item',
  });

  startClearingAllFilters = () => {
    this.props.startClearingFilters();
    this.setState({
      clearFilters: true,
    });
  };

  clearAllFilters = () => {
    Object.values(this.props.tableColumns)
      .filter(filter => filter.column.searchable !== false)
      .forEach(filter => {
        filter.resetDefault();
        this.colRef[filter.column.key](filter.getDefault());
      });
    this.setState({
      clearFilters: false,
    });
    this.props.clearFilters();
  };

  toggleFilters = () => {
    this.setState(prevState => ({ showFilters: !prevState.showFilters }));
  };

  renderExportCSVButton = () => (
    <button type="button" {...this.menuButtonClass()} onClick={() => this.props.onExportToCSV()}>
      <span className="export-icon">
        <b />
      </span>
      Export
    </button>
  );

  hasColumnFilters = () =>
    Object.values(this.props.tableColumns).filter(filter => filter.column.searchable !== false).length > 0;

  hasColumnToExport = () =>
    Object.values(this.props.tableColumns).filter(filter => filter.column.export !== false).length > 0;

  renderCustomButtonGroup = () => {
    let filtersType = 'hidden';
    const hasColumnFilters = this.hasColumnFilters();
    if (this.state.showFilters) {
      if (this.props.isFiltered) {
        filtersType = 'filtered';
      } else {
        filtersType = 'shown';
      }
    }
    return (
      <div className="table-button-menu">
        <button type="button" {...this.menuButtonClass()} onClick={() => this.props.refreshTable()}>
          <span class="refresh-icon">
            <b />
          </span>
        </button>
        {hasColumnFilters &&
          filtersType === 'shown' && (
            <button type="button" {...this.menuButtonClass()} onClick={() => this.toggleFilters()}>
              <span class="filter-icon filter-icon-shown">
                <b />
              </span>
              Filter
            </button>
          )}
        {hasColumnFilters &&
          filtersType === 'filtered' && (
            <button type="button" {...this.menuButtonClass()} onClick={() => this.startClearingAllFilters()}>
              <span class="filter-icon filter-icon-clear">
                <b />
              </span>
              Clear Filters
            </button>
          )}
        {hasColumnFilters &&
          filtersType === 'hidden' && (
            <button type="button" {...this.menuButtonClass()} onClick={() => this.toggleFilters()}>
              <span class="filter-icon">
                <b />
              </span>
              Filter
            </button>
          )}
        {this.hasColumnToExport() && this.renderExportCSVButton()}
        {this.props.extraButtons && this.props.extraButtons()}
      </div>
    );
  };

  renderSearchBox = () => (
    <div className="form-group form-group-sm react-bs-table-search-form">
      <input
        type="text"
        defaultValue={this.props.searchValue}
        placeholder="Search"
        onChange={this.props.onSearchChange}
      />
      <span className="input-group-btn" />
    </div>
  );

  renderToolBar = () => (
    <div class="react-bs-table-tool-bar">
      <div class="row">
        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-8">{this.renderCustomButtonGroup()}</div>
        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4">{this.hasColumnFilters() && this.renderSearchBox()}</div>
      </div>
    </div>
  );

  render() {
    const {
      keyField,
      noDataIndication,
      defaultSort,
      tableColumns,
      tableData,
      dataTotalSize,
      onTableChange,
      onSizePerPageChange,
      currentPage,
      sizePerPage,
      paginationTotal,
    } = this.props;

    // Add sort options
    let defaultSortOptions = null;
    if (defaultSort) {
      defaultSortOptions = [
        {
          dataField: defaultSort[0],
          order: defaultSort[1].toLowerCase(),
        },
      ];
    }

    // Add pagination options
    const paginationOptions = {
      onSizePerPageChange,
      page: currentPage,
      sizePerPage,
      totalSize: dataTotalSize,
      paginationTotal,
    };

    const columns = Object.values(tableColumns).map(tableColumn => {
      // set column filter, if searchable
      let columnFilter;
      let filterRenderer;
      if (tableColumn.column.searchable !== false) {
        let { defaultValue } = tableColumn.column;
        defaultValue = defaultValue || tableColumn.getBaseDefault();
        const filterOptions = {
          ...tableColumn.getColumnFilterProps(defaultValue),
          getFilter: c => {
            this.colRef[tableColumn.column.key] = c;
          },
        };
        if (filterOptions.type === 'TextFilter') {
          columnFilter = textFilter(filterOptions);
        }
        if (filterOptions.type === 'SelectFilter') {
          columnFilter = selectFilter(filterOptions);
        }
        if (filterOptions.type === 'NumberFilter') {
          columnFilter = numberFilter(filterOptions);
        }
        if (filterOptions.type === 'CustomFilter') {
          columnFilter = customFilter();
          filterRenderer = onFilter => tableColumn.getCustomFilter(onFilter, filterOptions);
        }
      }
      return {
        dataField: tableColumn.column.key,
        text: tableColumn.column.title,
        sort: !(tableColumn.column.sortable === false),
        filter: columnFilter,
        ...(filterRenderer && { filterRenderer }),
        headerClasses: `${this.state.showFilters ? '' : 'hide-filter'}`,
        hidden: tableColumn.column.hidden,
        ...(tableColumn.column.width && {
          headerStyle: { width: `${tableColumn.column.width.toString()}px` },
        }),
        ...(tableColumn.column.width && {
          style: { width: `${tableColumn.column.width.toString()}px` },
        }),
        ...(tableColumn.column.dataFormat && {
          formatter: tableColumn.column.dataFormat,
        }),
        ...(tableColumn.column.formatExtraData && {
          formatExtraData: tableColumn.column.formatExtraData,
        }),
      };
    });

    return (
      <div style={{ position: 'relative' }}>
        {this.renderToolBar()}
        <BootstrapTable
          remote={{ pagination: true }}
          keyField={keyField}
          data={tableData || []}
          columns={columns}
          defaultSorted={defaultSortOptions}
          striped
          hover
          pagination={paginationFactory(paginationOptions)}
          onTableChange={onTableChange}
          noDataIndication={noDataIndication}
          filter={filterFactory()}
        />
      </div>
    );
  }
}

DataTable.propTypes = propTypes;
DataTable.defaultProps = defaultProps;

export default DataTable;
