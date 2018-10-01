import ColumnFilter from './ColumnFilter';

/**
 * Select Filter
 *
 * A class providing supporting operations to a select
 * filter, extending the column filter base class.
 */
class SelectFilter extends ColumnFilter {
  /**
   * Constructor
   *
   * Call the parent construct and set the default filter type.
   */
  constructor(column) {
    super(column);
    this.type = 'eq';
  }

  /**
   * Get the column filter properties for displaying
   *
   * @param {*} defaultValue The default value of the column filter.
   * @return {Object} React-bootstrap-table column filter properties.
   */
  getColumnFilterProps = defaultValue => ({
    type: this.column.filter,
    options: this.column.filterOptions,
    defaultValue,
  });
}

export default SelectFilter;
