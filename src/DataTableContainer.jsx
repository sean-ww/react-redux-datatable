import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DataTable from './DataTable';
import { fetchTableData, resetExport } from './DataTable.actions';
import LoadingGif from './LoadingGif/LoadingGif';
import {
    setupTableColumns,
    clearDefaultFilterValues,
    setDefaultFilters,
    setStorageFilters,
    generateFilterObj,
    getFilterValues,
    generateColumnFilters,
} from './ColumnFilters';

export class DataTableContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFullscreen: false,
            sizePerPage: 0,
            currentPage: 0,
            sortField: undefined,
            sortOrder: undefined,
            clearingFilters: false,
            lastRefresh: 0,
        };
        this.searchValue = `${(this.props.tableSettings.defaultSearch ? this.props.tableSettings.defaultSearch : '')}`;
        this.columnFilters = undefined;
        this.setupTable();
    }

    componentDidMount() {
        if (typeof this.props.ownProps.setRef !== 'undefined') {
            this.props.ownProps.setRef(this);
        }
    }

    componentWillUnmount() {
        if (typeof this.props.ownProps.setRef !== 'undefined') {
            this.props.ownProps.setRef(null);
        }
    }

    onTableChange = (type, { page = 1, sizePerPage = 10, filters, sortField, sortOrder }) => {
        // console.log('onTableChange');
        // todo: test multiple tables on a page
        // if (this.props.DataTableData && this.props.DataTableData[this.props.tableSettings.tableID]) {
        console.log(
                'onTableChange',
                type,
                page,
                sizePerPage,
                filters,
                sortField,
                sortOrder,
            );
        console.log(
                'clear test',
                this.state.clearingFilters,
            );
        console.log('filters', filters);
        const filterValues = getFilterValues(this.tableColumns, filters);
        console.log('filterValues', filterValues);
        this.columnFilters = generateColumnFilters(this.tableColumns, filterValues);
        const offset = (page - 1) * sizePerPage;
        this.props.dispatch(fetchTableData(
                this.props.tableSettings,
                sizePerPage,
                offset,
                sortField,
                sortOrder,
                this.searchValue,
                this.columnFilters,
                this.props.apiLocation,
            ));
        this.setState({
            sizePerPage,
            currentPage: page,
            sortField,
            sortOrder,
            lastRefresh: Date.now(),
        });
        // }
    };

    onFilterChange = (filterObj) => {
        console.log('onFilterChange', filterObj);
        if (this.props.DataTableData && this.props.DataTableData[this.props.tableSettings.tableID]) {
            // check: do not update individually while clearing all filters
            if (!this.state.clearingFilters) {
                this.columnFilters = generateColumnFilters(this.tableColumns, filterObj);
                if (this.props.tableSettings.useLocalStorage) {
                    const storageFilters = setStorageFilters(this.tableColumns, filterObj);
                    const previousTableFilters = JSON.parse(global.window.localStorage.getItem('tableFilters'));
                    let newTableFilters;
                    if (previousTableFilters) {
                        newTableFilters = {
                            ...previousTableFilters,
                            [this.props.tableSettings.tableID]: storageFilters,
                        };
                    } else {
                        newTableFilters = {
                            [this.props.tableSettings.tableID]: storageFilters,
                        };
                    }
                    global.window.localStorage.setItem('tableFilters', JSON.stringify(newTableFilters));
                }
                this.resetPagination();
                this.props.dispatch(fetchTableData(
                    this.props.tableSettings,
                    this.state.sizePerPage,
                    0,
                    this.state.sortField,
                    this.state.sortOrder,
                    this.searchValue,
                    this.columnFilters,
                    this.props.apiLocation,
                ));
            }
        }
    };

    onSearchChange = (e) => {
        console.log('onSearchChange');
        this.resetPagination();
        const text = e.target.value.trim();
        if (this.props.tableSettings.useLocalStorage) {
            const previousTableSearch = JSON.parse(global.window.localStorage.getItem('tableSearch'));
            let newTableSearch;
            if (previousTableSearch) {
                newTableSearch = {
                    ...previousTableSearch,
                    [this.props.tableSettings.tableID]: text,
                };
            } else {
                newTableSearch = {
                    [this.props.tableSettings.tableID]: text,
                };
            }
            global.window.localStorage.setItem('tableSearch', JSON.stringify(newTableSearch));
        }
        this.searchValue = text;
        this.props.dispatch(fetchTableData(
            this.props.tableSettings,
            this.state.sizePerPage,
            0,
            this.state.sortField,
            this.state.sortOrder,
            this.searchValue,
            this.columnFilters,
            this.props.apiLocation,
        ));
    };

    onSortChange = (sortField, sortOrder) => {
        const offset = (this.state.currentPage - 1) * this.state.sizePerPage;
        this.props.dispatch(fetchTableData(
            this.props.tableSettings,
            this.state.sizePerPage,
            offset,
            sortField,
            sortOrder,
            this.searchValue,
            this.columnFilters,
            this.props.apiLocation,
        ));
        this.setState({
            sortField,
            sortOrder,
        });
    };

    onPageChange = (page, sizePerPage) => {
        const offset = (page - 1) * sizePerPage;
        this.props.dispatch(fetchTableData(
            this.props.tableSettings,
            sizePerPage,
            offset,
            this.state.sortField,
            this.state.sortOrder,
            this.searchValue,
            this.columnFilters,
            this.props.apiLocation,
        ));
        this.setState({
            currentPage: page,
        });
    };

    onSizePerPageChange = (sizePerPage) => {
        this.setState({
            sizePerPage,
        });
    };

    onExportToCSV = () => {
        const tableID = this.props.tableSettings.tableID;
        if (this.props.DataTableExportData &&
            this.props.DataTableExportData[tableID] &&
            this.props.DataTableExportData[tableID].fetched) {
            const exportData = this.props.DataTableExportData[tableID].data;
            this.props.dispatch(resetExport(tableID));
            return exportData;
        } else if (!this.props.DataTableExportData ||
            !this.props.DataTableExportData[tableID] ||
            !this.props.DataTableExportData[tableID].fetching) {
            this.props.dispatch(fetchTableData(
                this.props.tableSettings,
                1000,
                0,
                this.state.sortField,
                this.state.sortOrder,
                this.searchValue,
                this.columnFilters,
                this.props.apiLocation,
            ));
        }
        return false;
    };

    setupTable = () => {
        console.log('setup');
        const { tableColumns } = this.props.tableSettings;
        this.tableColumns = setupTableColumns(tableColumns);

        if (this.props.tableSettings.useLocalStorage) {
            // set table search
            const previousTableSearch = JSON.parse(global.window.localStorage.getItem('tableSearch'));
            if (previousTableSearch && previousTableSearch[this.props.tableSettings.tableID]) {
                this.searchValue = previousTableSearch[this.props.tableSettings.tableID];
            }

            // set table filters
            const previousTableFilters = JSON.parse(global.window.localStorage.getItem('tableFilters'));
            if (previousTableFilters && previousTableFilters[this.props.tableSettings.tableID]) {
                setDefaultFilters(
                    this.tableColumns,
                    previousTableFilters[this.props.tableSettings.tableID],
                );
            }
        }
    };

    refreshTable = () => {
        const offset = (this.state.currentPage - 1) * this.state.sizePerPage;
        this.props.dispatch(fetchTableData(
            this.props.tableSettings,
            this.state.sizePerPage,
            offset,
            this.state.sortField,
            this.state.sortOrder,
            this.searchValue,
            this.columnFilters,
            this.props.apiLocation,
        ));
        this.setState({
            lastRefresh: Date.now(),
        });
    };

    startClearingFilters = () => {
        this.setState({
            clearingFilters: true,
        });
    };

    clearFilters = () => {
        if (this.props.tableSettings.useLocalStorage) {
            const blankFilters = setStorageFilters(this.tableColumns, {});
            const previousTableFilters = JSON.parse(global.window.localStorage.getItem('tableFilters'));
            let newTableFilters;
            if (previousTableFilters) {
                newTableFilters = {
                    ...previousTableFilters,
                    [this.props.tableSettings.tableID]: blankFilters,
                };
            } else {
                newTableFilters = {
                    [this.props.tableSettings.tableID]: blankFilters,
                };
            }
            global.window.localStorage.setItem('tableFilters', JSON.stringify(newTableFilters));
        }
        clearDefaultFilterValues(this.tableColumns);
        this.props.dispatch(fetchTableData(
            this.props.tableSettings,
            this.state.sizePerPage,
            0,
            this.state.sortField,
            this.state.sortOrder,
            this.searchValue,
            undefined,
            this.props.apiLocation,
        ));
        this.setState({
            currentPage: 1,
            clearingFilters: false,
        });
        this.columnFilters = undefined;
    };

    resetPagination = () => {
        this.setState({
            currentPage: 1,
        });
    };

    makeFullscreen = () => {
        this.setState({ isFullscreen: !this.state.isFullscreen });
    };

    render() {
        const {
            tableSettings,
            DataTableData,
            DataTableExportData,
        } = this.props;
        const minWidth = tableSettings.minWidth;
        const tableID = tableSettings.tableID;

        if (!tableID || (DataTableData && DataTableData[tableID] && DataTableData[tableID].error)) {
            return (
                <div class="status_message offline">
                    <p>
                        The table failed to initialise. Please check you are connected to the internet and try again.
                    </p>
                </div>
            );
        }

        let isLoading = false;
        if (!DataTableData || !DataTableData[tableID] || !DataTableData[tableID].fetched) isLoading = true;

        let isFiltered = false;
        if (this.columnFilters && this.columnFilters.length > 0) {
            isFiltered = true;
        }

        let tableData = null;
        if (DataTableData && DataTableData[tableID] && DataTableData[tableID].data) {
            tableData = DataTableData[tableID].data;
        }

        let tableDataSize = 0;
        if (DataTableData && DataTableData[tableID] && DataTableData[tableID].dataTotalSize) {
            tableDataSize = DataTableData[tableID].dataTotalSize;
        }

        let exportData = null;
        if (DataTableExportData && DataTableExportData[tableID]) {
            exportData = DataTableExportData[tableID];
        }

        if (!tableSettings.extraToolbarItems) tableSettings.extraToolbarItems = null;
        return (
            <div
              class={`
                  ${tableSettings.wrapperType}
                  ${(this.state.isFullscreen ? 'section-isFullscreen' : '')}
                  react-datatable
              `}
            >
                { tableSettings.displayTitle &&
                <div class="section-toolbar">
                    <span class="section-toolbar-title">
                        {tableSettings.displayTitle}
                    </span>
                    { tableSettings.extraToolbarItems && tableSettings.extraToolbarItems() }
                    <div class="section-toolbar-group">
                        <div
                          class={`
                              section-toolbar-icon
                              section-toolbar-fullscreen
                              ${(this.state.isFullscreen ? 'section-toolbar-isFullscreen' : '')}
                          `}
                          title="Toggle Fullscreen"
                          onClick={this.makeFullscreen}
                        >
                            Fullscreen
                        </div>
                    </div>
                </div>
                }
                <div class="inner" style={{ overflow: 'auto' }}>
                    <div style={{ minWidth }}>
                        { isLoading &&
                        <div class="loadingContainer" style={{ opacity: 0.3 }}>
                            <LoadingGif />
                        </div>
                        }
                        <DataTable
                          keyField={tableSettings.keyField}
                          noDataIndication={tableSettings.noDataIndication}
                          extraButtons={tableSettings.extraButtons}
                          defaultSort={tableSettings.defaultSort}
                          tableColumns={this.tableColumns}
                          tableData={tableData}
                          DataTableExportData={exportData}
                          dataTotalSize={tableDataSize}
                          onTableChange={this.onTableChange}
                          onPageChange={this.onPageChange}
                          onSizePerPageChange={this.onSizePerPageChange}
                          onSortChange={this.onSortChange}
                          onSearchChange={this.onSearchChange}
                          onFilterChange={this.onFilterChange}
                          onExportToCSV={this.onExportToCSV}
                          currentPage={this.state.currentPage}
                          sizePerPage={this.state.sizePerPage}
                          refreshTable={this.refreshTable}
                          sortField={this.state.sortField}
                          sortOrder={this.state.sortOrder}
                          searchValue={this.searchValue}
                          isFiltered={isFiltered}
                          startClearingFilters={this.startClearingFilters}
                          clearFilters={this.clearFilters}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

DataTableContainer.propTypes = {
    dispatch: PropTypes.func.isRequired,
    tableSettings: PropTypes.object.isRequired,
    apiLocation: PropTypes.string.isRequired,
    DataTableData: PropTypes.any,
    DataTableExportData: PropTypes.object,
    ownProps: PropTypes.func,
};

DataTableContainer.defaultProps = {
    DataTableExportData: null,
    DataTableData: null,
    ownProps: () => {},
};

const mapStateToProps = (state, ownProps) => ({
    DataTableData: state.DataTableReducer.DataTableData,
    DataTableExportData: state.DataTableExportReducer.DataTableExportData,
    ownProps,
});

export default connect(mapStateToProps)(DataTableContainer);
