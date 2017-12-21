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
export const setupTableColumns = tableSettingsColumns => tableSettingsColumns.reduce((object, column) => {
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
 * Clear all default values from the table column filters
 *
 * @param {Object} tableColumns An object containing key: value column filter objects.
 */
export const clearDefaultFilterValues = tableColumns => Object.values(tableColumns).forEach((filter) => {
    filter.resetDefault();
});

/**
 * Set the table column default filter values
 *
 * @param {Object} tableColumns An object containing key: value column filter objects.
 * @param {Object} filters An object containing filter type and value pairs.
 */
export const setDefaultFilters = (tableColumns, filters) => Object.entries(tableColumns).forEach(([key, filter]) => {
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
export const setStorageFilters = (tableColumns, filters) => Object.values(tableColumns).filter(
    filter => (typeof filter.column.searchable === 'undefined' ||
        filter.column.searchable !== false
    ),
).reduce(
    (object, filter) => {
        if (typeof filters[filter.column.key] === 'undefined') {
            return {
                ...object,
                [filter.column.key]: filter.returnBlankFilterItem(),
            };
        }
        return {
            ...object,
            [filter.column.key]: filters[filter.column.key],
        };
    },
    {},
);

/**
 * Get all filtered columns where the default is not null
 *
 * @param {Object} tableColumns An object containing key: value column filter objects.
 * @return {Object} An object containing column filters where the default is not null.
 */
export const getDefaultFilteredColumns = tableColumns => Object.values(tableColumns).filter(
    filter => !filter.isDefaultNull(),
);

/**
 * Generate a filter object
 *
 * This functions converts table column filters to filter objects
 * (matching react-bootstrap-table).
 *
 * @param {Object} tableColumns An object containing key: value column filter objects.
 * @return {Object} A filter object matching react-bootstrap-table.
 */
export const generateFilterObj = tableColumns => getDefaultFilteredColumns(tableColumns).reduce(
    (object, filter) => ({ ...object, [filter.column.key]: filter.toFilterItem() }), {},
);

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
export const generateColumnFilters = (tableColumns, filters) => Object.entries(filters)
    .map(([key, filter]) => tableColumns[key].generateColumnFilter(filter.value));
