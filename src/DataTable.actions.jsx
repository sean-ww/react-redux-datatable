import axios from 'axios';
import 'url-search-params-polyfill';

const instance = axios.create();
instance.defaults.timeout = 60000;

const dispatchError = (dispatch, dispatchType, tableSettings, error) => dispatch({
    type: `${dispatchType}_REJECTED`,
    payload: {
        tableId: tableSettings.tableID,
        tableData: {
            [tableSettings.tableID]: {
                fetching: false,
                fetched: false,
                error,
                data: null,
                dataTotalSize: 0,
            },
        },
    },
});

// fetchTableData - search for table data
export function fetchTableData(
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
        let dispatchType = 'FETCH_TABLE_DATA';
        if (limit === 1000) dispatchType = 'FETCH_EXPORT_TABLE_DATA';
        dispatch({
            type: dispatchType,
            payload: {
                tableId: tableSettings.tableID,
                tableData: {
                    [tableSettings.tableID]: {
                        fetching: true,
                        fetched: false,
                        error: null,
                        data: null,
                        dataTotalSize: null,
                    },
                },
            },
        });

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
            if (response.data.searchSuccess) {
                console.log('data returned');
                dispatch({
                    type: `${dispatchType}_FULFILLED`,
                    payload: {
                        tableId: tableSettings.tableID,
                        tableData: {
                            [tableSettings.tableID]: {
                                fetching: false,
                                fetched: true,
                                error: null,
                                data: response.data.data,
                                dataTotalSize: response.data.dataTotalSize,
                            },
                        },
                    },
                });
            } else {
                dispatchError(dispatch, dispatchType, tableSettings, response);
            }
        }).catch((error) => {
            dispatchError(dispatch, dispatchType, tableSettings, error);
        });
    };
}

// resetExport - reset the export
export function resetExport(tableID) {
    return (dispatch) => {
        dispatch({
            type: 'FETCH_EXPORT_TABLE_DATA_RESET',
            payload: {
                tableId: tableID,
                tableData: {
                    [tableID]: {
                        fetching: false,
                        fetched: false,
                        error: null,
                        data: null,
                        dataTotalSize: 0,
                    },
                },
            },
        });
    };
}
