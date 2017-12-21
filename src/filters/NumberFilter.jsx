import ColumnFilter from './ColumnFilter';

class NumberFilter extends ColumnFilter {

    /**
     * Reset the default number value of the column filter to null
     *
     * @return {Object} The updated column object.
     */
    resetDefault = () => {
        this.column.defaultValue = {
            comparator: this.column.defaultValue.comparator,
        };
        return this.column;
    };

    /**
     * Check if the current number filter default value is null
     *
     * @return {boolean} True if the default value is null.
     */
    isDefaultNull = () => {
        if (this.column.defaultValue.number) {
            return false;
        }
        return true;
    };

    /**
     * Return a blank number filter item
     *
     * @return {{type: string, value: *}} A filter object item.
     */
    returnBlankFilterItem = () => this.returnFilterItem({
        comparator: this.column.defaultValue.comparator,
    });

    /**
     * Generate a column filter object
     *
     * @param {number} value The numeric value of the filter.
     * @return {{key, type: string, value}} A column filter object.
     */
    generateColumnFilter = (value) => {
        let type = 'like';
        switch (value.comparator) {
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
        return {
            key: this.column.key,
            type,
            value: value.number,
        };
    };

    /**
     * Get the column filter properties for displaying
     *
     * @param {mixed} defaultValue The default value of the column filter.
     * @return {{type, placeholder: string, numberComparators: string[], withoutEmptyComparatorOption: boolean, defaultValue: *}}
     */
    getColumnFilterProps = defaultValue => ({
        type: this.column.filter,
        placeholder: ' ',
        numberComparators: ['=', '>', '>=', '<', '<=', '!=', '...'],
        withoutEmptyComparatorOption: true,
        defaultValue,
    });
}

export default NumberFilter;
