import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { canUseDOM, exportToCSVFile } from './csvExport';
import DataTable from './DataTable';
import { fetchTableData, fetchExportData } from './DataTable.actions';
import LoadingGif from './LoadingGif/LoadingGif';
import {
    setLocalStorageItem,
    getLocalStorageItem,
    updateLocalStorageItem,
} from './localStorage';
import {
    setupTableColumns,
    setDefaultFilters,
    setStorageFilters,
    getDefaultFilterValues,
    getFilterValues,
    generateColumnFilters,
} from './ColumnFilters';

export class DataTableContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFullscreen: false,
            sizePerPage: 10,
            currentPage: 1,
            sortField: undefined,
            sortOrder: undefined,
            clearingFilters: false,
            lastRefresh: 0,
        };
        this.isSetup = false;
        this.searchValue = `${(this.props.tableSettings.defaultSearch ? this.props.tableSettings.defaultSearch : '')}`;
        this.columnFilters = undefined;
        this.setupTable();
        this.initiateTable();
    }

    componentDidMount() {
        if (typeof this.props.ownProps.setRef !== 'undefined') {
            this.props.ownProps.setRef(this);
        }
        this.isSetup = true;
    }

    componentWillUnmount() {
        if (typeof this.props.ownProps.setRef !== 'undefined') {
            this.props.ownProps.setRef(null);
        }
    }

    onTableChange = (type, { page = 1, sizePerPage = 10, filters, sortField, sortOrder }) => {
        if (!this.isSetup || this.state.clearingFilters) return;

        const filterValues = getFilterValues(this.tableColumns, filters);
        this.columnFilters = generateColumnFilters(this.tableColumns, filterValues);

        if (this.props.tableSettings.useLocalStorage) {
            updateLocalStorageItem('tableFilters', {
                [this.props.tableSettings.tableID]: setStorageFilters(
                    this.tableColumns,
                    filterValues,
                ),
            });
        }

        this.getTableData({
            sizePerPage,
            page,
            sortField,
            sortOrder,
        });

        this.setState({
            sizePerPage,
            currentPage: page,
            sortField,
            sortOrder,
            lastRefresh: Date.now(),
        });
    };

    onSearchChange = (e) => {
        const text = e.target.value.trim();
        if (this.props.tableSettings.useLocalStorage) {
            updateLocalStorageItem('tableSearch', {
                [this.props.tableSettings.tableID]: text,
            });
        }
        this.searchValue = text;
        this.getTableData({});
        this.setState({
            currentPage: 1,
        });
    };

    onSizePerPageChange = (sizePerPage) => {
        this.setState({
            sizePerPage,
        });
    };

    onExportToCSV = () => {
        if (canUseDOM()) {
            fetchExportData(
                this.props.tableSettings,
                this.state.sortField,
                this.state.sortOrder,
                this.searchValue,
                this.columnFilters,
                this.props.apiLocation,
            ).then((data) => {
                const fields = Object.values(this.tableColumns)
                    .filter(filter => filter.column.export !== false)
                    .map(tableColumn => tableColumn.column.key);

                exportToCSVFile(
                    fields,
                    data,
                    `exportDownload_${moment().format('YYYY-MM-DD_HH-mm')}.csv`,
                );
            });
        }
    };

    getTableData = ({
        sizePerPage = this.state.sizePerPage,
        page = 1,
        sortField = this.state.sortField,
        sortOrder = this.state.sortOrder,
    }) => {
        this.props.dispatch(fetchTableData(
            this.props.tableSettings,
            sizePerPage,
            (page - 1) * sizePerPage,
            sortField,
            sortOrder,
            this.searchValue,
            this.columnFilters,
            this.props.apiLocation,
        ));
    };

    setupTable = () => {
        const { tableColumns } = this.props.tableSettings;
        this.tableColumns = setupTableColumns(tableColumns);

        if (this.props.tableSettings.useLocalStorage) {
            // set table search
            const previousTableSearch = getLocalStorageItem('tableSearch');
            if (previousTableSearch && previousTableSearch[this.props.tableSettings.tableID]) {
                this.searchValue = previousTableSearch[this.props.tableSettings.tableID];
            }

            // set table filters
            const previousTableFilters = getLocalStorageItem('tableFilters');
            if (previousTableFilters && previousTableFilters[this.props.tableSettings.tableID]) {
                setDefaultFilters(
                    this.tableColumns,
                    previousTableFilters[this.props.tableSettings.tableID],
                );
            }
        }
    };

    initiateTable = () => {
        const filterValues = getDefaultFilterValues(this.tableColumns);
        this.columnFilters = generateColumnFilters(this.tableColumns, filterValues);
        this.getTableData({
            page: this.state.currentPage,
        });
    };

    refreshTable = () => {
        this.getTableData({
            page: this.state.currentPage,
        });
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
            const previousTableFilters = getLocalStorageItem('tableFilters');
            if (previousTableFilters) {
                const newTableFilters = { ...previousTableFilters };
                delete newTableFilters[this.props.tableSettings.tableID];
                setLocalStorageItem('tableFilters', newTableFilters);
            }
        }
        this.columnFilters = undefined;
        this.getTableData({});
        this.setState({
            currentPage: 1,
            clearingFilters: false,
        });
    };

    makeFullscreen = () => {
        this.setState({ isFullscreen: !this.state.isFullscreen });
    };

    render() {
        const {
            tableSettings,
            DataTableData,
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
                          dataTotalSize={tableDataSize}
                          onTableChange={this.onTableChange}
                          onSizePerPageChange={this.onSizePerPageChange}
                          onSearchChange={this.onSearchChange}
                          onExportToCSV={this.onExportToCSV}
                          currentPage={this.state.currentPage}
                          sizePerPage={this.state.sizePerPage}
                          refreshTable={this.refreshTable}
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
    ownProps: PropTypes.func,
};

DataTableContainer.defaultProps = {
    DataTableData: null,
    ownProps: () => {},
};

const mapStateToProps = (state, ownProps) => ({
    DataTableData: state.DataTableReducer.DataTableData,
    ownProps,
});

export default connect(mapStateToProps)(DataTableContainer);
