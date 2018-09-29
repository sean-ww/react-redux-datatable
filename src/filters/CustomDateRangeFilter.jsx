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
     * Retrieve the base default value
     *
     * @return {object}
     */
    getBaseDefault = () => {};

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
        this.column.defaultValue = this.getBaseDefault();
      }
      return this.column;
    };

    /**
     * Return a between values filter item
     *
     * @param {*} values The values of the filter.
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
    generateColumnFilter = value => ({
      key: this.column.key,
      type: 'between',
      value,
    });

    /**
     * Return a Date Range Filter
     *
     * @param {Function} filterHandler React-bootstrap-table filter handler.
     * @param {Object} filterOptions Filter options.
     * @return {jsx} The Date Range Filter component.
     */
    getCustomFilter = (filterHandler, filterOptions) => (
      <DateRangeFilter
        onFilter={filterHandler}
        columnKey={filterOptions.columnKey}
        defaultValue={filterOptions.defaultValue}
        getFilter={filterOptions.getFilter}
      />
    );

    /**
     * Get the column filter properties for displaying
     *
     * @param {object} defaultValue The default value of the column filter.
     * @return {Object} React-bootstrap-table column filter properties.
     */
    getColumnFilterProps = defaultValue => ({
      type: 'CustomFilter',
      getElement: this.getCustomFilter,
      columnKey: this.column.key,
      defaultValue,
    });
}

export default CustomDateRangeFilter;
