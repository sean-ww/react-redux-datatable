import React from 'react';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, selectFilter, numberFilter, customFilter } from 'react-bootstrap-table2-filter';
import moment from 'moment';

const menuButtonClass = {
    className: 'table-button table-button-menu-item',
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

    createCustomExportCSVButton = () => {
        const { DataTableExportData } = this.props;
        if (DataTableExportData && DataTableExportData.fetching) {
            return (
                <div
                  btnText=""
                  {...menuButtonClass}
                >
                    <span class="export-icon"><b /></span>Preparing
                </div>
            );
        } else if (DataTableExportData && DataTableExportData.fetched) {
            return (
                <ExportCSVButton
                  btnText=""
                  {...menuButtonClass}
                >
                    <span class="export-icon"><b /></span>Download
                </ExportCSVButton>
            );
        }
        return (
            <ExportCSVButton
              btnText=""
              {...menuButtonClass}
            >
                <span class="export-icon"><b /></span>Export
            </ExportCSVButton>
        );
    };

    startClearingAllFilters = () => {
        this.props.startClearingFilters();
        this.setState({
            clearFilters: true,
        });
    };

    clearAllFilters = () => {
        Object.values(this.props.tableColumns).forEach((filter) => {
            if (filter.column.filter && filter.column.filter.substring(0, 6) === 'Custom') {
                this.colRef[filter.column.key].refs.customFilter.customCleanFiltered();
            } else if (filter.column.filter && filter.column.filter === 'NumberFilter') {
                this.colRef[filter.column.key].applyFilter({
                    comparator: filter.column.defaultValue.comparator,
                }); // retain comparator
            } else if (filter.column.filter && filter.column.filter === 'SelectFilter') {
                this.colRef[filter.column.key].applyFilter('');
            } else {
                this.colRef[filter.column.key].cleanFiltered();
            }
        });
        this.setState({
            clearFilters: false,
        });
        this.props.clearFilters();
    };

    toggleFilters = () => {
        this.setState({
            showFilters: !this.state.showFilters,
        });
    };

    renderCustomButtonGroup = (props) => {
        let filtersType = 'hidden';
        if (this.state.showFilters) {
            if (this.props.isFiltered) {
                filtersType = 'filtered';
            } else {
                filtersType = 'shown';
            }
        }
        return (
            <div className="table-button-menu" sizeClass="btn-group-md">
                <button
                  {...menuButtonClass}
                  onClick={() => this.props.refreshTable()}
                >
                    <span class="refresh-icon"><b /></span>
                </button>
                {filtersType === 'shown' &&
                <button
                  {...menuButtonClass}
                  onClick={() => this.toggleFilters()}
                >
                    <span class="filter-icon filter-icon-shown"><b /></span>Filter
                </button>
                }
                {filtersType === 'filtered' &&
                <button
                  {...menuButtonClass}
                  onClick={() => this.startClearingAllFilters()}
                >
                    <span class="filter-icon filter-icon-clear"><b /></span>Clear Filters
                </button>
                }
                {filtersType === 'hidden' &&
                <button
                  {...menuButtonClass}
                  onClick={() => this.toggleFilters()}
                >
                    <span class="filter-icon"><b /></span>Filter
                </button>
                }
                {/* { props.exportCSVBtn } */}
                { this.props.extraButtons && this.props.extraButtons() }
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
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-8">
                    { this.renderCustomButtonGroup() }
                </div>
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4">
                    { this.renderSearchBox() }
                </div>
            </div>
        </div>
    );

    renderShowsTotal = (start, to, total) => (
        <div style={{ float: 'right', fontSize: '10px', marginTop: '4px', marginRight: '-66px' }}>
            Showing { start } to { to } of { total } Results
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
            onPageChange,
            onSizePerPageChange,
            onSortChange,
            currentPage,
            sizePerPage,
            sortField,
            sortOrder,
        } = this.props;

        const options = {
            paginationShowsTotal: this.renderShowsTotal,
            sizePerPage,
            sizePerPageList: [10, 25, 50, 100],
            onSizePerPageChange,
            onSortChange,
            searchField: this.searchBox,
            page: currentPage,
            sortField,
            sortOrder,
            onPageChange,
            btnGroup: this.createCustomButtonGroup,
            onFilterChange: this.props.onFilterChange,
            exportCSVBtn: this.createCustomExportCSVButton,
            onExportToCSV: this.props.onExportToCSV,
        };

        // Add sort options
        // if (defaultSort) {
        //     options.defaultsortField = defaultSort[0];
        //     options.defaultSortOrder = defaultSort[1].toLowerCase();
        // }

        const tableHeaderColumns = Object.values(tableColumns).map((filter) => {
            // Set column defaults
            const thisRef = (c) => { this.colRef[filter.column.key] = c; };
            const colProps = {
                ref: thisRef,
                dataField: filter.column.key,
                key: filter.column.key,
                dataAlign: 'center',
                // dataSort: true,
                // sortFunc: () => false,
                hidden: false,
                width: undefined,
                filter: undefined,
                className: `${(this.state.showFilters ? '' : 'hide-filter')}`,
            };

            // add data formatting
            if (filter.column.dataFormat) colProps.dataFormat = filter.column.dataFormat;

            // add data formatting extra data
            if (filter.column.formatExtraData) colProps.formatExtraData = filter.column.formatExtraData;

            // make column unsortable
            // if (filter.column.sortable === false) colProps.dataSort = false;

            // make column hidden
            if (filter.column.hidden) colProps.hidden = true;

            // set column width
            if (filter.column.width) colProps.width = filter.column.width.toString();

            // prevent column csv export
            if (typeof filter.column.export !== 'undefined' && !filter.column.export) colProps.export = false;

            // set column filter, if searchable
            if (filter.column.searchable !== false) {
                let defaultValue = '';
                if (filter.column.defaultValue) defaultValue = filter.column.defaultValue;
                colProps.filter = filter.getColumnFilterProps(defaultValue);
            }

            return false;

            // return (
            //     <TableHeaderColumn {...colProps}>
            //         {filter.column.title}
            //     </TableHeaderColumn>
            // );
        });

        const csvFileName = `exportDownload_${moment().format('YYYY-MM-DD_HH-mm')}.csv`;


        // Add sort options
        let defaultSortOptions = null;
        if (defaultSort) {
            defaultSortOptions = [{
                dataField: defaultSort[0],
                order: defaultSort[1].toLowerCase(),
            }];
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

        const columns = Object.values(tableColumns).map((tableColumn) => {
            // console.log(tableColumn);
            // TODO: get filter local storage working
            // TODO: test clear filters
            // TODO: column formatters
            // TODO: get export working
            // set column filter, if searchable
            let columnFilter;
            let filterRenderer;
            if (tableColumn.column.searchable !== false) {
                let defaultValue = '';
                if (tableColumn.column.defaultValue) defaultValue = tableColumn.column.defaultValue;
                const filterOptions = tableColumn.getColumnFilterProps(defaultValue);
                console.log('filterOptions', filterOptions);
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
                    filterRenderer = onFilter =>
                        tableColumn.getCustomFilter(onFilter, filterOptions.customFilterParameters);
                }
            }
            return {
                dataField: tableColumn.column.key,
                text: tableColumn.column.title,
                sort: !(tableColumn.column.sortable === false),
                filter: columnFilter,
                ...filterRenderer && { filterRenderer },
                headerClasses: `${(this.state.showFilters ? '' : 'hide-filter')}`,
            };
        });

        return (
            <div style={{ position: 'relative' }}>
                { this.renderToolBar() }
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
                {/* <BootstrapTable */}
                {/* data={tableData || []} */}
                {/* exportCSV */}
                {/* csvFileName={csvFileName} */}
                {/* remote */}
                {/* search */}
                {/* striped */}
                {/* hover */}
                {/* pagination */}
                {/* fetchInfo={{ dataTotalSize }} */}
                {/* options={options} */}
                {/* keyField={keyField} */}
                {/* > */}
                {/* { tableHeaderColumns } */}
                {/* </BootstrapTable> */}
            </div>
        );
    }
}

DataTable.propTypes = {
    DataTableExportData: PropTypes.object,
    keyField: PropTypes.string.isRequired,
    noDataIndication: PropTypes.any,
    extraButtons: PropTypes.func,
    defaultSort: PropTypes.array,
    tableColumns: PropTypes.object.isRequired,
    tableData: PropTypes.any,
    dataTotalSize: PropTypes.number.isRequired,
    onTableChange: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onSizePerPageChange: PropTypes.func.isRequired,
    onSortChange: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onExportToCSV: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    sizePerPage: PropTypes.number.isRequired,
    refreshTable: PropTypes.func.isRequired,
    sortField: PropTypes.string,
    sortOrder: PropTypes.string,
    searchValue: PropTypes.string,
    startClearingFilters: PropTypes.func.isRequired,
    clearFilters: PropTypes.func.isRequired,
    isFiltered: PropTypes.bool,
};

DataTable.defaultProps = {
    DataTableExportData: null,
    noDataIndication: 'There is no data to display',
    extraButtons: null,
    defaultSort: null,
    tableData: null,
    sortField: undefined,
    sortOrder: undefined,
    searchValue: undefined,
    isFiltered: false,
};

export default DataTable;
