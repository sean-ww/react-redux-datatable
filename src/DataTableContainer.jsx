import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DataTable from './DataTable';
import { fetchTableData, resetExport } from './DataTable.actions';
import LoadingGif from './LoadingGif/LoadingGif';

function setFiltersFromStorage(tableColumns, previousFilters) {
    const updatedTableColumns = [];
    if (Object.prototype.toString.call(tableColumns) === '[object Array]') {
        tableColumns.forEach((col) => {
            const type = col.filter ? col.filter : 'TextFilter';
            if (previousFilters && previousFilters[col.key] && previousFilters[col.key].value) {
                if (type === 'CustomDateRangeFilter') {
                    const fromDate = new Date(previousFilters[col.key].value.values.from);
                    const toDate = new Date(previousFilters[col.key].value.values.to);
                    updatedTableColumns.push(
                        {
                            ...col,
                            defaultValue: {
                                from: fromDate,
                                to: toDate,
                            }, // replace default
                        },
                    );
                } else {
                    updatedTableColumns.push(
                        {
                            ...col,
                            defaultValue: previousFilters[col.key].value, // replace default
                        },
                    );
                }
            } else if (previousFilters) {
                if (type === 'NumberFilter') {
                    updatedTableColumns.push(
                        {
                            ...col,
                            defaultValue: {
                                comparator: col.defaultValue.comparator,
                            }, // keep default comparator
                        },
                    );
                } else {
                    const newCol = Object.assign({}, col);
                    delete newCol.defaultValue; // remove any defaults
                    updatedTableColumns.push({ ...newCol });
                }
            } else {
                updatedTableColumns.push({ ...col }); // no change
            }
        });
    }
    return updatedTableColumns;
}

function generateFilterObj(tableColumns) {
    const filterObj = {};
    if (Object.prototype.toString.call(tableColumns) === '[object Array]') {
        tableColumns.forEach((col) => {
            if (col.defaultValue) {
                let type = col.filter ? col.filter : 'TextFilter';
                if (type === 'NumberFilter') {
                    if (col.defaultValue.number) {
                        filterObj[col.key] = {
                            type: col.filter,
                            value: col.defaultValue,
                        };
                    }
                } else {
                    let value = '';
                    if (type === 'CustomDateRangeFilter') {
                        type = 'CustomFilter';
                        value = {
                            key: 'value',
                            type: 'between',
                            value: col.defaultValue,
                        };
                    } else {
                        value = col.defaultValue;
                    }
                    filterObj[col.key] = {
                        type,
                        value,
                    };
                }
            }
        });
    }
    return filterObj;
}

function generateColumnFilters(filterObj) {
    const columnFilters = [];
    if (Object.keys(filterObj).length > 0) {
        for (const key in filterObj) {
            if (filterObj[key].type) {
                switch (filterObj[key].type) {
                case 'TextFilter': {
                    columnFilters.push({
                        key,
                        type: 'like',
                        value: filterObj[key].value,
                    });
                    break;
                }
                case 'SelectFilter': {
                    columnFilters.push({
                        key,
                        type: 'eq',
                        value: filterObj[key].value,
                    });
                    break;
                }
                case 'NumberFilter': {
                    let type = 'like';
                    switch (filterObj[key].value.comparator) {
                    case '=':
                        type = 'eq';
                        break;
                    case '>':
                        type = 'gt';
                        break;
                    case '>=':
                        type = 'gteq';
                        break;
                    case '<':
                        type = 'lt';
                        break;
                    case '<=':
                        type = 'lteq';
                        break;
                    case '!=':
                        type = 'nteq';
                        break;
                    default:
                    }
                    columnFilters.push({
                        key,
                        type,
                        value: filterObj[key].value.number,
                    });
                    break;
                }
                case 'CustomFilter': {
                    let filterValue = '';
                    if (typeof filterObj[key].value.values !== 'undefined') {
                        filterValue = filterObj[key].value.values;
                    } else if (typeof filterObj[key].value.value !== 'undefined') {
                        filterValue = filterObj[key].value.value;
                    }
                    columnFilters.push({
                        key,
                        type: filterObj[key].value.type,
                        value: filterValue,
                    });
                    break;
                }
                default:
                }
            }
        }
    }
    return columnFilters;
}

class DataTableContainer extends React.Component {
    constructor(props) {
        super(props);
        this.makeFullscreen = this.makeFullscreen.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onSizePerPageList = this.onSizePerPageList.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.onExportToCSV = this.onExportToCSV.bind(this);
        this.resetPagination = this.resetPagination.bind(this);
        this.startClearingFilters = this.startClearingFilters.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.initiateTable = this.initiateTable.bind(this);
        this.refreshTable = this.refreshTable.bind(this);
        this.state = {
            isFullscreen: false,
            sizePerPage: 10,
            currentPage: 1,
            sortName: undefined,
            sortOrder: undefined,
            searchValue: `${(this.props.tableSettings.defaultSearch ? this.props.tableSettings.defaultSearch : '')}`,
            columnFilters: undefined,
            clearingFilters: false,
            filtersPristine: true,
            initReady: false,
            tableColumns: this.props.tableSettings.tableColumns,
        };
    }

    componentWillMount() {
        if (this.props.tableSettings.useLocalStorage) {
            // set table search
            const previousTableSearch = JSON.parse(localStorage.getItem('tableSearch'));
            if (previousTableSearch && previousTableSearch[this.props.tableSettings.tableID]) {
                const updatedTableSearch = previousTableSearch[this.props.tableSettings.tableID];
                this.setState({
                    searchValue: updatedTableSearch,
                });
            }

            // set table filters
            const previousTableFilters = JSON.parse(localStorage.getItem('tableFilters'));
            if (previousTableFilters && previousTableFilters[this.props.tableSettings.tableID]) {
                const updatedTableColumns = setFiltersFromStorage(
                    this.props.tableSettings.tableColumns,
                    previousTableFilters[this.props.tableSettings.tableID],
                );

                this.setState({
                    tableColumns: updatedTableColumns,
                });
            }
        }
    }

    componentDidMount() {
        this.initiateTable();
    }

    onFilterChange(filterObj) {
        if (this.state.initReady) {
            this.setState({
                filtersPristine: false,
            });
            const columnFilters = generateColumnFilters(filterObj);

            // check: do not update individually while clearing all filters
            if (!this.state.clearingFilters) {
                if (this.props.tableSettings.useLocalStorage) {
                    const previousTableFilters = JSON.parse(localStorage.getItem('tableFilters'));
                    let newTableFilters;
                    if (previousTableFilters) {
                        newTableFilters = {
                            ...previousTableFilters,
                            [this.props.tableSettings.tableID]: filterObj,
                        };
                    } else {
                        newTableFilters = {
                            [this.props.tableSettings.tableID]: filterObj,
                        };
                    }
                    localStorage.setItem('tableFilters', JSON.stringify(newTableFilters));
                }
                this.resetPagination();
                this.props.dispatch(fetchTableData(
                    this.props,
                    this.props.tableSettings,
                    this.state.sizePerPage,
                    0,
                    this.state.sortName,
                    this.state.sortOrder,
                    this.state.searchValue,
                    columnFilters,
                    this.props.apiLocation,
                ));
                this.setState({
                    columnFilters,
                });
            }
        }
    }

    onSearchChange(e) {
        this.resetPagination();
        const text = e.target.value.trim();
        if (this.props.tableSettings.useLocalStorage) {
            const previousTableSearch = JSON.parse(localStorage.getItem('tableSearch'));
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
            localStorage.setItem('tableSearch', JSON.stringify(newTableSearch));
        }
        this.props.dispatch(fetchTableData(
            this.props,
            this.props.tableSettings,
            this.state.sizePerPage,
            0,
            this.state.sortName,
            this.state.sortOrder,
            text,
            this.state.columnFilters,
            this.props.apiLocation,
        ));
        this.setState({
            searchValue: text,
        });
    }

    onSortChange(sortName, sortOrder) {
        const offset = (this.state.currentPage - 1) * this.state.sizePerPage;
        this.props.dispatch(fetchTableData(
            this.props,
            this.props.tableSettings,
            this.state.sizePerPage,
            offset,
            sortName,
            sortOrder,
            this.state.searchValue,
            this.state.columnFilters,
            this.props.apiLocation,
        ));
        this.setState({
            sortName,
            sortOrder,
        });
    }

    onPageChange(page, sizePerPage) {
        const offset = (page - 1) * sizePerPage;
        this.props.dispatch(fetchTableData(
            this.props,
            this.props.tableSettings,
            sizePerPage,
            offset,
            this.state.sortName,
            this.state.sortOrder,
            this.state.searchValue,
            this.state.columnFilters,
            this.props.apiLocation,
        ));
        this.setState({
            currentPage: page,
        });
    }

    onSizePerPageList(sizePerPage) {
        this.setState({
            sizePerPage,
        });
    }

    onExportToCSV() {
        const tableID = this.props.tableSettings.tableID;
        if (this.props.DataTableExportData &&
            this.props.DataTableExportData[tableID] &&
            this.props.DataTableExportData[tableID].fetched) {
            const exportData = this.props.DataTableExportData[tableID].data;
            this.props.dispatch(resetExport(this.props, tableID));
            return exportData;
        } else if (!this.props.DataTableExportData ||
            !this.props.DataTableExportData[tableID] ||
            !this.props.DataTableExportData[tableID].fetching) {
            this.props.dispatch(fetchTableData(
                this.props,
                this.props.tableSettings,
                1000,
                0,
                this.state.sortName,
                this.state.sortOrder,
                this.state.searchValue,
                this.state.columnFilters,
                this.props.apiLocation,
            ));
        }
        return false;
    }

    initiateTable() {
        const offset = (this.state.currentPage - 1) * this.state.sizePerPage;
        const filterObj = generateFilterObj(this.state.tableColumns);
        const columnFilters = generateColumnFilters(filterObj);
        this.props.dispatch(fetchTableData(
            this.props,
            this.props.tableSettings,
            this.state.sizePerPage,
            offset,
            this.state.sortName,
            this.state.sortOrder,
            this.state.searchValue,
            columnFilters,
            this.props.apiLocation,
        ));
        this.setState({
            initReady: true,
            columnFilters,
        });
    }

    refreshTable() {
        const offset = (this.state.currentPage - 1) * this.state.sizePerPage;
        this.props.dispatch(fetchTableData(
            this.props,
            this.props.tableSettings,
            this.state.sizePerPage,
            offset,
            this.state.sortName,
            this.state.sortOrder,
            this.state.searchValue,
            this.state.columnFilters,
            this.props.apiLocation,
        ));
    }

    startClearingFilters() {
        this.setState({
            clearingFilters: true,
        });
    }

    clearFilters() {
        if (this.props.tableSettings.useLocalStorage) {
            const previousTableFilters = JSON.parse(localStorage.getItem('tableFilters'));
            let newTableFilters;
            if (previousTableFilters) {
                newTableFilters = {
                    ...previousTableFilters,
                    [this.props.tableSettings.tableID]: {},
                };
            } else {
                newTableFilters = {
                    [this.props.tableSettings.tableID]: {},
                };
            }
            localStorage.setItem('tableFilters', JSON.stringify(newTableFilters));
        }
        this.props.dispatch(fetchTableData(
            this.props,
            this.props.tableSettings,
            this.state.sizePerPage,
            0,
            this.state.sortName,
            this.state.sortOrder,
            this.state.searchValue,
            undefined,
            this.props.apiLocation,
        ));
        this.setState({
            currentPage: 1,
            columnFilters: undefined,
            clearingFilters: false,
        });
    }

    resetPagination() {
        this.setState({
            currentPage: 1,
        });
    }

    makeFullscreen() {
        this.setState({ isFullscreen: !this.state.isFullscreen });
    }

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
                <div class="applicationError status_message offline">
                    <p>
                        The table failed to initialise. Please check you are connected to the internet and try again.
                    </p>
                </div>
            );
        }

        let isLoading = false;
        if (!DataTableData || !DataTableData[tableID] || !DataTableData[tableID].fetched) isLoading = true;

        let tableData = null;
        if (DataTableData && DataTableData[tableID] && DataTableData[tableID].data) {
            tableData = DataTableData[tableID].data;
        }

        let tableDataSize = 0;
        if (DataTableData && DataTableData[tableID] && DataTableData[tableID].dataTotalSize) {
            tableDataSize = DataTableData[tableID].dataTotalSize;
        }

        if (!tableSettings.extraToolbarItems) {
            tableSettings.extraToolbarItems = () => {};
        }

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
                    { tableSettings.extraToolbarItems() }
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
                        <div class="absLoadingContainer" style={{ opacity: 0.3 }}>
                            <LoadingGif />
                        </div>
                        }
                        <DataTable
                          keyField={tableSettings.keyField}
                          extraButtons={tableSettings.extraButtons}
                          defaultSort={tableSettings.defaultSort}
                          tableColumns={this.state.tableColumns}
                          tableData={tableData}
                          DataTableExportData={DataTableExportData[tableID]}
                          dataTotalSize={tableDataSize}
                          onPageChange={this.onPageChange}
                          onSizePerPageList={this.onSizePerPageList}
                          onSortChange={this.onSortChange}
                          onSearchChange={this.onSearchChange}
                          onFilterChange={this.onFilterChange}
                          onExportToCSV={this.onExportToCSV}
                          currentPage={this.state.currentPage}
                          sizePerPage={this.state.sizePerPage}
                          refreshTable={this.refreshTable}
                          sortName={this.state.sortName}
                          sortOrder={this.state.sortOrder}
                          searchValue={this.state.searchValue}
                          columnFilters={this.state.columnFilters}
                          startClearingFilters={this.startClearingFilters}
                          clearFilters={this.clearFilters}
                          filtersPristine={this.state.filtersPristine}
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
};

DataTableContainer.defaultProps = {
    DataTableExportData: null,
    DataTableData: null,
};

export default connect(store => ({
    DataTableData: store.DataTableReducer.DataTableData,
    DataTableExportData: store.DataTableExportReducer.DataTableExportData,
}))(DataTableContainer);
