import React from 'react';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, selectFilter, numberFilter, customFilter } from 'react-bootstrap-table2-filter';

class DataTable extends React.Component {
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
  renderCustomButtonGroup = () => {
    let filtersType = 'hidden';
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
        {filtersType === 'shown' && (
          <button type="button" {...this.menuButtonClass()} onClick={() => this.toggleFilters()}>
            <span class="filter-icon filter-icon-shown">
              <b />
            </span>
            Filter
          </button>
        )}
        {filtersType === 'filtered' && (
          <button type="button" {...this.menuButtonClass()} onClick={() => this.startClearingAllFilters()}>
            <span class="filter-icon filter-icon-clear">
              <b />
            </span>
            Clear Filters
          </button>
        )}
        {filtersType === 'hidden' && (
          <button type="button" {...this.menuButtonClass()} onClick={() => this.toggleFilters()}>
            <span class="filter-icon">
              <b />
            </span>
            Filter
          </button>
        )}
        {this.renderExportCSVButton()}
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
        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4">{this.renderSearchBox()}</div>
      </div>
    </div>
  );
  renderShowsTotal = (start, to, total) => (
    <div
      style={{
        float: 'right',
        fontSize: '10px',
        marginTop: '4px',
        marginRight: '-66px',
      }}
    >
      Showing {start} to {Math.max(to + 1, 0)} of {total} Results
    </div>
  );

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
      paginationTotalRenderer: this.renderShowsTotal,
      showTotal: true,
      page: currentPage,
      sizePerPage,
      sizePerPageList: [10, 25, 50, 100],
      onSizePerPageChange,
      totalSize: dataTotalSize,
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

DataTable.propTypes = {
  keyField: PropTypes.string.isRequired,
  noDataIndication: PropTypes.any,
  extraButtons: PropTypes.func,
  defaultSort: PropTypes.array,
  tableColumns: PropTypes.object.isRequired,
  tableData: PropTypes.any,
  dataTotalSize: PropTypes.number.isRequired,
  onTableChange: PropTypes.func.isRequired,
  onSizePerPageChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onExportToCSV: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  sizePerPage: PropTypes.number.isRequired,
  refreshTable: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
  startClearingFilters: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  isFiltered: PropTypes.bool,
};

DataTable.defaultProps = {
  noDataIndication: 'There is no data to display',
  extraButtons: null,
  defaultSort: null,
  tableData: null,
  searchValue: undefined,
  isFiltered: false,
};

export default DataTable;
