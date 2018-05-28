import React from 'react';
import PropTypes from 'prop-types';
import {
    TableHeaderColumn,
    ButtonGroup,
    ExportCSVButton,
} from 'react-bootstrap-table-next';
import BootstrapTable from 'react-bootstrap-table-next';
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

    createCustomButtonGroup = (props) => {
        let filtersType = 'hidden';
        if (this.state.showFilters) {
            if (this.props.isFiltered) {
                filtersType = 'filtered';
            } else {
                filtersType = 'shown';
            }
        }
        return (
            <ButtonGroup className="table-button-menu" sizeClass="btn-group-md">
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
                { props.exportCSVBtn }
                { this.props.extraButtons && this.props.extraButtons() }
            </ButtonGroup>
        );
    };

    searchBox = () => (
        <input
          type="text"
          defaultValue={this.props.searchValue}
          placeholder="Search"
          onChange={this.props.onSearchChange}
        />
    );

    renderShowsTotal = (start, to, total) => (
        <div style={{ float: 'right', fontSize: '10px', marginTop: '4px', marginRight: '-66px' }}>
            Showing { start } to { to } of { total } Results
        </div>
    );

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
        // if (defaultSort) {
        //     options.defaultSortName = defaultSort[0];
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

            return (
                <TableHeaderColumn {...colProps}>
                    {filter.column.title}
                </TableHeaderColumn>
            );
        });

        const csvFileName = `exportDownload_${moment().format('YYYY-MM-DD_HH-mm')}.csv`;


        // Add sort options
        let defaultSortOptions = null;
        if (defaultSort) {
            defaultSortOptions = [{
                dataField: defaultSort[0],
                order: defaultSort[1].toLowerCase(), // todo: fix styling that goes with this and get it to update
            }];
        }

        const columns = Object.values(tableColumns).map((filter) => {
            return {
                dataField: filter.column.key,
                text: filter.column.title,
                sort: !(filter.column.sortable === false),
            };
        });
        console.log(columns, tableHeaderColumns);

        return (
            <div style={{ position: 'relative' }}>
                <BootstrapTable
                    keyField='id'
                    data={tableData || []}
                    columns={columns}
                    defaultSorted={defaultSortOptions}
                />
                {/*<BootstrapTable*/}
                  {/*data={tableData || []}*/}
                  {/*exportCSV*/}
                  {/*csvFileName={csvFileName}*/}
                  {/*remote*/}
                  {/*search*/}
                  {/*striped*/}
                  {/*hover*/}
                  {/*pagination*/}
                  {/*fetchInfo={{ dataTotalSize }}*/}
                  {/*options={options}*/}
                  {/*keyField={keyField}*/}
                {/*>*/}
                    {/*{ tableHeaderColumns }*/}
                {/*</BootstrapTable>*/}
            </div>
        );
    }
}

DataTable.propTypes = {
    DataTableExportData: PropTypes.object,
    keyField: PropTypes.string.isRequired,
    extraButtons: PropTypes.func,
    defaultSort: PropTypes.array,
    tableColumns: PropTypes.object.isRequired,
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
    isFiltered: PropTypes.bool,
};

DataTable.defaultProps = {
    DataTableExportData: null,
    extraButtons: null,
    defaultSort: null,
    tableData: null,
    sortName: undefined,
    sortOrder: undefined,
    searchValue: undefined,
    isFiltered: false,
};

export default DataTable;
