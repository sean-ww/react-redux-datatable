import React from 'react';
import ColumnFilter from './ColumnFilter';
import DateRangeFilter from './CustomDateRangeFilter/CustomDateRangeFilter';

/**
 * Custom Date Range Filter
 *
 * A class providing supporting operations to a custom date
 * range filter, extending the column filter base class.
 */
class CustomDateRangeFilter extends ColumnFilter {
    /**
     * Set the default value of the column filter
     *
     * @param {{values: {to: date, from: date}}|*} value An object containing from and to values.
     * @return {Object} The updated column object.
     */
    setDefault = (value) => {
        if (value.values) {
            const from = new Date(value.values.from);
            const to = new Date(value.values.to);
            this.column.defaultValue = {
                from,
                to,
            };
        } else {
            this.column.defaultValue = '';
        }
        return this.column;
    };

    /**
     * Return a between values filter item
     *
     * @param {mixed} value The value of the filter.
     * @return {{type: string, value: {key: string, type: string, values: *}}} A filter object item.
     */
    returnFilterItem = values => ({
        type: 'CustomFilter',
        value: {
            key: 'value',
            type: 'between',
            values,
        },
    });

    /**
     * Return a blank custom filter item
     *
     * @return {{type: string, value: string}} A filter object item.
     */
    returnBlankFilterItem = () => ({
        type: 'CustomFilter',
        value: '',
    });

    /**
     * Generate a column filter object
     *
     * @param {Object} value The value of the custom filter.
     * @return {{key, type: string, value: *}} A column filter object.
     */
    generateColumnFilter = value => this.generateCustomFilter(value);

    /**
     * Return a Date Range Filter
     *
     * @param {Function} filterHandler React-bootstrap-table filter handler.
     * @param {{columnKey: string, defaultValue: *}} customFilterParameters Filter key and default values.
     * @return {jsx} The Date Range Filter component.
     */
    getCustomFilter = (filterHandler, customFilterParameters) => (
        <DateRangeFilter
          filterHandler={filterHandler}
          columnKey={customFilterParameters.columnKey}
          defaultValue={customFilterParameters.defaultValue}
        />
    );

    /**
     * Get the column filter properties for displaying
     *
     * @param {mixed} defaultValue The default value of the column filter.
     * @return {Object} React-bootstrap-table column filter properties.
     */
    getColumnFilterProps = defaultValue => ({
        type: 'CustomFilter',
        getElement: this.getCustomFilter,
        customFilterParameters: {
            columnKey: this.column.key,
            defaultValue,
        },
    });
}

export default CustomDateRangeFilter;
