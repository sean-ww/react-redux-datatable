import 'url-search-params-polyfill';
import { REQUEST_HEADERS } from './constants';

const dispatchError = (dispatch, tableSettings, error) =>
  dispatch({
    type: 'FETCH_TABLE_DATA_REJECTED',
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

const prepareFetchTableParams = (tableSettings, limit, offset, sortName, sortOrder, searchValue, columnFilters) => {
  const params = new URLSearchParams();
  params.append('tableSettings', JSON.stringify(tableSettings));
  params.append('limit', limit);
  params.append('offset', offset);
  if (typeof sortName !== 'undefined') params.append('sortName', sortName);
  if (typeof sortOrder !== 'undefined') params.append('sortOrder', sortOrder);
  if (typeof searchValue !== 'undefined') params.append('searchValue', searchValue);
  if (typeof columnFilters !== 'undefined') params.append('columnFilters', JSON.stringify(columnFilters));
  return params;
};

export const fetchExportData = (
  tableSettings,
  sortName,
  sortOrder,
  searchValue,
  columnFilters,
  apiLocation,
  axiosInstance,
) => {
  const params = prepareFetchTableParams(tableSettings, 1000, 0, sortName, sortOrder, searchValue, columnFilters);
  return axiosInstance
    .post(apiLocation, params, {
      headers: tableSettings.headers || REQUEST_HEADERS,
    })
    .then(response => {
      if (response.data.searchSuccess) {
        return response.data.data;
      }
      return 'error';
    })
    .catch(() => 'error');
};

export const fetchTableData = (
  tableSettings,
  limit,
  offset,
  sortName,
  sortOrder,
  searchValue,
  columnFilters,
  apiLocation,
  axiosInstance,
) => dispatch => {
  dispatch({
    type: 'FETCH_TABLE_DATA',
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

  const params = prepareFetchTableParams(tableSettings, limit, offset, sortName, sortOrder, searchValue, columnFilters);
  axiosInstance
    .post(apiLocation, params, {
      headers: tableSettings.headers || REQUEST_HEADERS,
    })
    .then(response => {
      if (response.data.searchSuccess) {
        dispatch({
          type: 'FETCH_TABLE_DATA_FULFILLED',
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
        dispatchError(dispatch, tableSettings, response);
      }
    })
    .catch(error => {
      dispatchError(dispatch, tableSettings, error);
    });
};
