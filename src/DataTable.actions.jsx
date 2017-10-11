import axios from 'axios';
import 'url-search-params-polyfill';

const instance = axios.create();
instance.defaults.timeout = 60000;

// fetchTableData - search for table data
export function fetchTableData(
        props,
        tableSettings,
        limit,
        offset,
        sortName,
        sortOrder,
        searchValue,
        columnFilters,
        apiLocation,
    ) {
    return (dispatch) => {
        if (tableSettings.tableID) {
            if (limit === 1000) {
                const prevDataTableExportData = props.DataTableExportData ?
                    Object.assign({}, props.DataTableExportData)
                    : {};
                let existingTableDataData = null;
                let existingTableDataDataTotalSize = null;
                if (prevDataTableExportData && prevDataTableExportData[tableSettings.tableID]) {
                    existingTableDataData = prevDataTableExportData[tableSettings.tableID].data;
                    existingTableDataDataTotalSize = prevDataTableExportData[tableSettings.tableID].dataTotalSize;
                }
                const tableData = {};
                tableData[tableSettings.tableID] = {
                    fetching: true,
                    fetched: false,
                    error: null,
                    data: existingTableDataData,
                    dataTotalSize: existingTableDataDataTotalSize,
                };
                const newDataTableData = Object.assign(prevDataTableExportData, tableData);

                dispatch({
                    type: 'FETCH_EXPORT_TABLE_DATA',
                    payload: newDataTableData,
                });
            } else {
                const prevDataTableData = props.DataTableData ? Object.assign({}, props.DataTableData) : {};
                let existingTableDataData = null;
                let existingTableDataDataTotalSize = null;
                if (prevDataTableData && prevDataTableData[tableSettings.tableID]) {
                    existingTableDataData = prevDataTableData[tableSettings.tableID].data;
                    existingTableDataDataTotalSize = prevDataTableData[tableSettings.tableID].dataTotalSize;
                }
                const tableData = {};
                tableData[tableSettings.tableID] = {
                    fetching: true,
                    fetched: false,
                    error: null,
                    data: existingTableDataData,
                    dataTotalSize: existingTableDataDataTotalSize,
                };
                const newDataTableData = Object.assign(prevDataTableData, tableData);

                dispatch({
                    type: 'FETCH_TABLE_DATA',
                    payload: newDataTableData,
                });
            }
            const params = new URLSearchParams();
            params.append('tableSettings', JSON.stringify(tableSettings));
            params.append('limit', limit);
            params.append('offset', offset);
            if (typeof sortName !== 'undefined') params.append('sortName', sortName);
            if (typeof sortOrder !== 'undefined') params.append('sortOrder', sortOrder);
            if (typeof searchValue !== 'undefined') params.append('searchValue', searchValue);
            if (typeof columnFilters !== 'undefined') params.append('columnFilters', JSON.stringify(columnFilters));
            instance.post(apiLocation, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                },
            }).then((response) => {
                const prevDataTableExportData = props.DataTableExportData ?
                    Object.assign({}, props.DataTableExportData)
                    : {};
                const prevDataTableData = props.DataTableData ? Object.assign({}, props.DataTableData) : {};
                if (response.data.searchSuccess) {
                    const tableData = {};
                    tableData[tableSettings.tableID] = {
                        fetching: false,
                        fetched: true,
                        error: null,
                        data: response.data.data,
                        dataTotalSize: response.data.dataTotalSize,
                    };

                    if (limit === 1000) {
                        const newDataTableData = Object.assign(prevDataTableExportData, tableData);
                        dispatch({
                            type: 'FETCH_EXPORT_TABLE_DATA_FULFILLED',
                            payload: newDataTableData,
                        });
                    } else {
                        const newDataTableData = Object.assign(prevDataTableData, tableData);
                        dispatch({
                            type: 'FETCH_TABLE_DATA_FULFILLED',
                            payload: newDataTableData,
                        });
                    }
                } else {
                    const tableData = {};
                    tableData[tableSettings.tableID] = {
                        fetching: false,
                        fetched: false,
                        error: response,
                        data: null,
                        dataTotalSize: 0,
                    };

                    if (limit === 1000) {
                        const newDataTableData = Object.assign(prevDataTableExportData, tableData);
                        dispatch({
                            type: 'FETCH_EXPORT_TABLE_DATA_REJECTED',
                            payload: newDataTableData,
                        });
                    } else {
                        const newDataTableData = Object.assign(prevDataTableData, tableData);
                        dispatch({
                            type: 'FETCH_TABLE_DATA_REJECTED',
                            payload: newDataTableData,
                        });
                    }
                }
            }).catch((err) => {
                const prevDataTableData = props.DataTableData ? Object.assign({}, props.DataTableData) : {};
                const tableData = {};
                tableData[tableSettings.tableID] = {
                    fetching: false,
                    fetched: false,
                    error: err,
                    data: null,
                    dataTotalSize: 0,
                };
                const newDataTableData = Object.assign(prevDataTableData, tableData);

                dispatch({
                    type: 'FETCH_TABLE_DATA_REJECTED',
                    payload: newDataTableData,
                });
            });
        }
    };
}

// resetExport - reset the export
export function resetExport(props, tableID) {
    return (dispatch) => {
        const prevDataTableExportData = props.DataTableExportData ?
            Object.assign({}, props.DataTableExportData)
            : {};
        const tableData = {};
        tableData[tableID] = {
            fetching: false,
            fetched: false,
            error: null,
            data: null,
            dataTotalSize: 0,
        };
        const newDataTableData = Object.assign(prevDataTableExportData, tableData);
        dispatch({ type: 'FETCH_EXPORT_TABLE_DATA_RESET', payload: newDataTableData });
    };
}
