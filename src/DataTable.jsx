import React from 'react';
import PropTypes from 'prop-types';
import {
    BootstrapTable,
    TableHeaderColumn,
    ButtonGroup,
    ExportCSVButton,
} from 'react-bootstrap-table';
import moment from 'moment';
import CustomDateRangeFilter from './filters/CustomDateRangeFilter/CustomDateRangeFilter';

function getCustomFilter(filterHandler, customFilterParameters) {
    return (
        <CustomDateRangeFilter
          filterHandler={filterHandler}
          columnKey={customFilterParameters.columnKey}
          defaultValue={customFilterParameters.defaultValue}
        />
    );
}

class DataTable extends React.Component {

    constructor(props) {
        super(props);
        this.toggleFilters = this.toggleFilters.bind(this);
        this.startClearingAllFilters = this.startClearingAllFilters.bind(this);
        this.clearAllFilters = this.clearAllFilters.bind(this);
        this.checkFilters = this.checkFilters.bind(this);
        this.state = {
            showFilters: false,
            clearFilters: false,
            defaultFiltersSet: false,
        };
        this.colRef = {};
        this._hasMounted = false;
    }

    componentWillMount() {
        this.checkFilters();
    }

    componentDidMount() {
        this._hasMounted = true;
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.clearFilters) this.clearAllFilters();
    }

    createCustomExportCSVButton = () => {
        const { DataTableExportData } = this.props;
        if (DataTableExportData && DataTableExportData.fetching) {
            return (
                <div
                  btnText=""
                  className="table-button table-button-menu-item"
                >
                    <span class="export-icon"><b /></span>Preparing
                </div>
            );
        } else if (DataTableExportData && DataTableExportData.fetched) {
            return (
                <ExportCSVButton
                  btnText=""
                  className="table-button table-button-menu-item"
                >
                    <span class="export-icon"><b /></span>Download
                </ExportCSVButton>
            );
        }
        return (
            <ExportCSVButton
              btnText=""
              className="table-button table-button-menu-item"
            >
                <span class="export-icon"><b /></span>Export
            </ExportCSVButton>
        );
    }

    checkFilters() {
        let showFilters = false;
        if (Object.prototype.toString.call(this.props.tableColumns) === '[object Array]') {
            this.props.tableColumns.forEach((col) => {
                if (!showFilters) {
                    if (col.filter && col.filter === 'NumberFilter') {
                        if (col.defaultValue && col.defaultValue.number) showFilters = true;
                    } else if (col.defaultValue) showFilters = true;
                }
            });
        }
        this.state = {
            showFilters,
            defaultFiltersSet: showFilters,
        };
    }

    startClearingAllFilters() {
        this.props.startClearingFilters(); // - this to stop firing, but doesn't update until too late
        this.setState({
            clearFilters: true,
        });
    }

    clearAllFilters() {
        if (Object.prototype.toString.call(this.props.tableColumns) === '[object Array]') {
            this.props.tableColumns.forEach((col) => {
                if (col.filter && col.filter.substring(0, 6) === 'Custom') {
                    this.colRef[col.key].refs.customFilter.customCleanFiltered();
                } else if (col.filter && col.filter === 'NumberFilter') {
                    this.colRef[col.key].applyFilter({
                        comparator: col.defaultValue.comparator,
                    }); // retain comparator
                } else {
                    this.colRef[col.key].cleanFiltered();
                }
            });
        }
        this.setState({
            clearFilters: false,
        });
        this.props.clearFilters();
    }

    toggleFilters() {
        this.setState({
            showFilters: !this.state.showFilters,
        });
    }

    createCustomButtonGroup = (props) => {
        let filtersType = 'hidden';
        if (this.state.showFilters) {
            if (
                (this.props.columnFilters && this.props.columnFilters.length > 0) ||
                (this.props.filtersPristine && this.state.defaultFiltersSet)
            ) {
                filtersType = 'filtered';
            } else {
                filtersType = 'shown';
            }
        }
        return (
            <ButtonGroup className="table-button-menu" sizeClass="btn-group-md">
                <button
                  class="table-button table-button-menu-item"
                  onClick={this.props.refreshTable}
                >
                    <span class="refresh-icon"><b /></span>
                </button>
                {filtersType === 'shown' &&
                <button
                  class="table-button table-button-menu-item"
                  onClick={this.toggleFilters}
                >
                    <span class="filter-icon filter-icon-shown"><b /></span>Filter
                </button>
                }
                {filtersType === 'filtered' &&
                <button
                  class="table-button table-button-menu-item"
                  onClick={this.startClearingAllFilters}
                >
                    <span class="filter-icon filter-icon-clear"><b /></span>Clear Filters
                </button>
                }
                {filtersType === 'hidden' &&
                <button
                  class="table-button table-button-menu-item"
                  onClick={this.toggleFilters}
                >
                    <span class="filter-icon"><b /></span>Filter
                </button>
                }
                { props.exportCSVBtn }
                { this.props.extraButtons && this.props.extraButtons() }
            </ButtonGroup>
        );
    }

    searchBox = () => (
        <input
          type="text"
          defaultValue={this.props.searchValue}
          placeholder="Search"
          onChange={this.props.onSearchChange}
        />
    )

    /* eslint-disable class-methods-use-this */
    preventClientSideSort() {
        return false;
    }

    renderShowsTotal(start, to, total) {
        return (
            <div style={{ float: 'right', fontSize: '10px', marginTop: '4px', marginRight: '-66px' }}>
                Showing { start } to { to } of { total } Results
            </div>
        );
    }
    /* eslint-enable class-methods-use-this */

    render() {
        const {
            keyField,
            defaultSort,
            tableColumns,
            tableData,
            dataTotalSize,
            onPageChange,
            onSizePerPageList,
            onSortChange,
            currentPage,
            sizePerPage,
            sortName,
            sortOrder,
        } = this.props;

        const options = {
            paginationShowsTotal: this.renderShowsTotal,
            sizePerPage,
            sizePerPageList: [10, 25, 50, 100],
            onSizePerPageList,
            onSortChange,
            searchField: this.searchBox,
            page: currentPage,
            sortName,
            sortOrder,
            onPageChange,
            btnGroup: this.createCustomButtonGroup,
            onFilterChange: this.props.onFilterChange,
            exportCSVBtn: this.createCustomExportCSVButton,
            onExportToCSV: this.props.onExportToCSV,
        };

        // Add sort options
        if (defaultSort) {
            options.defaultSortName = defaultSort[0];
            options.defaultSortOrder = defaultSort[1].toLowerCase();
        }

        const tableHeaderColumns =
            Object.prototype.toString.call(tableColumns) === '[object Array]' ?
                tableColumns.map((column) => {
                    // Set column defaults
                    const thisRef = (c) => { this.colRef[column.key] = c; };
                    const colProps = {
                        ref: thisRef,
                        dataField: column.key,
                        key: column.key,
                        dataAlign: 'center',
                        dataSort: true,
                        sortFunc: this.preventClientSideSort,
                        hidden: false,
                        width: undefined,
                        filter: undefined,
                        className: `${(this.state.showFilters ? '' : 'hide-filter')}`,
                    };

                    // add data formatting
                    if (column.dataFormat) colProps.dataFormat = column.dataFormat;

                    // add data formatting extra data
                    if (column.formatExtraData) colProps.formatExtraData = column.formatExtraData;

                    // make column unsortable
                    if (column.searchable === false) colProps.dataSort = false;

                    // make column hidden
                    if (column.hidden) colProps.hidden = true;

                    // set column width
                    if (column.width) colProps.width = column.width.toString();

                    // prevent column csv export
                    if (typeof column.export !== 'undefined' && !column.export) colProps.export = false;

                    // set column filter
                    let defaultValue = '';
                    if (!this._hasMounted && column.defaultValue) defaultValue = column.defaultValue;
                    let colFilter = column.filter;
                    if (typeof colFilter === 'undefined') {
                        colFilter = '';
                        if (column.searchable !== false) colFilter = 'TextFilter'; // default, if searchable
                    }
                    switch (colFilter) {
                    case 'TextFilter': {
                        colProps.filter = {
                            type: 'TextFilter',
                            placeholder: ' ',
                            defaultValue,
                        };
                        break;
                    }
                    case 'SelectFilter': {
                        colProps.filter = {
                            type: 'SelectFilter',
                            options: column.filterOptions,
                            defaultValue,
                        };
                        break;
                    }
                    case 'NumberFilter': {
                        colProps.filter = {
                            type: 'NumberFilter',
                            placeholder: ' ',
                            numberComparators: ['=', '>', '>=', '<', '<=', '!=', '...'],
                            withoutEmptyComparatorOption: true,
                            defaultValue,
                        };
                        break;
                    }
                    case 'CustomDateRangeFilter': {
                        colProps.filter = {
                            type: 'CustomFilter',
                            getElement: getCustomFilter,
                            customFilterParameters: {
                                columnKey: column.key,
                                defaultValue,
                            },
                        };
                        break;
                    }
                    default: {
                        break;
                    }
                    }

                    return (
                        <TableHeaderColumn {...colProps}>
                            {column.title}
                        </TableHeaderColumn>
                    );
                })
                : [];

        const csvFileName = `exportDownload_${moment().format('YYYY-MM-DD_HH-mm')}.csv`;

        return (
            <div style={{ position: 'relative' }}>
                <BootstrapTable
                  data={tableData || []}
                  exportCSV
                  csvFileName={csvFileName}
                  remote
                  search
                  striped
                  hover
                  pagination
                  fetchInfo={{ dataTotalSize }}
                  options={options}
                  keyField={keyField}
                >
                    { tableHeaderColumns }
                </BootstrapTable>
            </div>
        );
    }
}

DataTable.propTypes = {
    DataTableExportData: PropTypes.object,
    keyField: PropTypes.string.isRequired,
    extraButtons: PropTypes.func,
    defaultSort: PropTypes.array,
    tableColumns: PropTypes.array.isRequired,
    tableData: PropTypes.any,
    dataTotalSize: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onSizePerPageList: PropTypes.func.isRequired,
    onSortChange: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onExportToCSV: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    sizePerPage: PropTypes.number.isRequired,
    refreshTable: PropTypes.func.isRequired,
    sortName: PropTypes.string,
    sortOrder: PropTypes.string,
    searchValue: PropTypes.string,
    startClearingFilters: PropTypes.func.isRequired,
    clearFilters: PropTypes.func.isRequired,
    filtersPristine: PropTypes.bool.isRequired,
    columnFilters: PropTypes.array,
};

DataTable.defaultProps = {
    DataTableExportData: null,
    extraButtons: null,
    defaultSort: null,
    tableData: null,
    sortName: undefined,
    sortOrder: undefined,
    searchValue: undefined,
    columnFilters: undefined,
};

export default DataTable;
