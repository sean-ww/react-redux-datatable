import TextFilter from './filters/TextFilter';
import SelectFilter from './filters/SelectFilter';
import NumberFilter from './filters/NumberFilter';
import CustomDateRangeFilter from './filters/CustomDateRangeFilter';

/* eslint-disable no-param-reassign */
/**
 * Setup Data Table Column Filters
 *
 * This function converts each table column setting into a column filter object.
 *
 * @param {Array} tableSettingsColumns The data table table column settings.
 * @return {Object} An object containing key: value column filter objects.
 */
export const setupTableColumns = tableSettingsColumns =>
  tableSettingsColumns.reduce((object, column) => {
    switch (column.filter) {
      case 'SelectFilter': {
        object[column.key] = new SelectFilter(column);
        break;
      }
      case 'NumberFilter': {
        object[column.key] = new NumberFilter(column);
        break;
      }
      case 'CustomDateRangeFilter': {
        object[column.key] = new CustomDateRangeFilter(column);
        break;
      }
      default: {
        object[column.key] = new TextFilter(column);
        break;
      }
    }
    return object;
  }, {});
/* eslint-enable no-param-reassign */

/**
 * Set the table column default filter values
 *
 * @param {Object} tableColumns An object containing key: value column filter objects.
 * @param {Object} filters An object containing filter type and value pairs.
 */
export const setDefaultFilters = (tableColumns, filters) =>
  Object.entries(tableColumns).forEach(([key, filter]) => {
    if (filters && filters[filter.column.key]) {
      filter.setDefault(filters[key].value);
    }
  });

/**
 * Set Local Storage filters
 *
 * This function takes the column filters, removes any non-searchable columns
 * and creates amended objects {key: { type: 'filterType', value: 'value' },..}.
 * Blank filters will be stored also to override defaults.
 *
 * @param {Object} tableColumns An object containing key: value column filter objects.
 * @param {Object} filters An object containing filter type and value pairs.
 * @return {Object} An object containing amended filter type and value pairs.
 */
export const setStorageFilters = (tableColumns, filters) =>
  Object.values(tableColumns)
    .filter(filter => typeof filter.column.searchable === 'undefined' || filter.column.searchable !== false)
    .reduce((object, filter) => {
      if (typeof filters[filter.column.key] === 'undefined') {
        return {
          ...object,
          [filter.column.key]: filter.returnBlankFilterItem(),
        };
      }
      if (!filters[filter.column.key].values) {
        return {
          ...object,
          [filter.column.key]: filter.returnFilterItem(filters[filter.column.key]),
        };
      }
      return {
        ...object,
        [filter.column.key]: filter.returnFilterItem(filters[filter.column.key].values),
      };
    }, {});

/**
 * Get all filtered columns where the default is not null
 *
 * @param {Object} tableColumns An object containing key: value column filter objects.
 * @return {Object} An object containing column filters where the default is not null.
 */
export const getDefaultFilteredColumns = tableColumns =>
  Object.values(tableColumns).filter(filter => !filter.isDefaultNull());

/**
 * Get all filter values where they are not empty
 *
 * @param {Object} tableColumns An object containing key: value column filter objects.
 * @param {Object} filters Filter objects matching react-bootstrap-table2.
 * @return {Object} Filter value objects where the value is set.
 */
export const getFilterValues = (tableColumns, filters) =>
  Object.keys(filters).reduce((object, filter) => {
    if (tableColumns[filter].hasEmptyValue(filters[filter].filterVal)) {
      return object;
    }
    return {
      ...object,
      [filter]: filters[filter].filterVal,
    };
  }, {});

/**
 * Get all default filter values where they are not empty
 *
 * @param {Object} tableColumns An object containing key: value column filter objects.
 * @return {Object} Filter value objects where the value is set.
 */
export const getDefaultFilterValues = tableColumns =>
  Object.keys(tableColumns).reduce((object, filter) => {
    if (tableColumns[filter].hasEmptyValue(tableColumns[filter].getDefault())) {
      return object;
    }
    return {
      ...object,
      [filter]: tableColumns[filter].getDefault(),
    };
  }, {});

/**
 * Generate column filters
 *
 * This function converts the table column filters in combination
 * with the react-bootstrap-table filter object to a column filter
 * array for fetching table data from an api.
 *
 * @param {Object} tableColumns An object containing key: value column filter objects.
 * @param {Object} filters A filter object matching react-bootstrap-table.
 * @return {({key, type, value}|*)[]} An array of column filters.
 */
export const generateColumnFilters = (tableColumns, filters) =>
  Object.entries(filters).map(([key, filter]) => tableColumns[key].generateColumnFilter(filter));
