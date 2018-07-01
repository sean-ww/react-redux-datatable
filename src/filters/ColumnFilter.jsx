/**
 * Column Filter Base Class
 *
 * This base class provides column filter operations and defaults
 * for setting up react-bootstrap-table defaultValues, and converting
 * filter values to local storage, api input and display properties.
 */
class ColumnFilter {

    /**
     * Constructor
     *
     * Set the column object and default filter type.
     */
    constructor(column) {
        this.column = {
            ...column,
        };
        this.type = 'like';
    }

    /**
     * Retrieve the base default value
     *
     * @return {string}
     */
    getBaseDefault = () => '';

    /**
     * Retrieve the default column values
     *
     * @return {*|null}
     */
    getDefault = () => this.column.defaultValue;

    /**
     * Set the default value of the column filter
     *
     * @param {mixed} value The value to be set as default.
     * @return {Object} The updated column object.
     */
    setDefault = (value) => {
        this.column.defaultValue = value;
        return this.column;
    };

    /**
     * Reset the default value of the column filter to null
     *
     * @return {Object} The updated column object.
     */
    resetDefault = () => {
        this.column.defaultValue = this.getBaseDefault();
        return this.column;
    };

    /**
     * Check if the current column filter default value is null
     *
     * @return {boolean} True if the default value is null.
     */
    isDefaultNull = () => {
        if (this.column.defaultValue) {
            return false;
        }
        return true;
    };

    /**
     * Check if the filter has an empty value
     *
     * @param {string} value The value entered.
     * @return {boolean} True if the value is set.
     */
    hasEmptyValue = (value) => {
        if (!value || value === '') {
            return true;
        }
        return false;
    };

    /**
     * Return a filter item
     *
     * @param {mixed} value The value of the filter.
     * @return {{type: string, value: *}} A filter object item.
     */
    returnFilterItem = value => ({
        type: this.column.filter ? this.column.filter : 'TextFilter',
        value,
    });

    /**
     * Return a blank filter item
     *
     * @return {{type: string, value: *}} A filter object item.
     */
    returnBlankFilterItem = () => this.returnFilterItem('');

    /**
     * Convert a filter column to a filter item
     *
     * Return the filter type and value if set, else null.
     *
     * @return {{type: string, value: *}|null} A filter object item, or null.
     */
    toFilterItem = () => {
        if (this.isDefaultNull()) {
            return null;
        }
        return this.returnFilterItem(this.column.defaultValue);
    };

    /**
     * Generate a column filter object
     *
     * @param {*} value The value of the filter.
     * @return {{key, type: string, value: *}} A column filter object.
     */
    generateColumnFilter = value => ({
        key: this.column.key,
        type: this.type,
        value,
    });

    /**
     * Get the column filter properties for displaying
     *
     * @param {*} defaultValue The default value of the column filter.
     * @return {Object} React-bootstrap-table column filter properties.
     */
    getColumnFilterProps = defaultValue => ({
        type: this.column.filter ? this.column.filter : 'TextFilter',
        placeholder: ' ',
        defaultValue,
    });
}

export default ColumnFilter;
