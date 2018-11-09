import PropTypes from 'prop-types';
import { nonNegativeInteger } from 'airbnb-prop-types';
import TableColumnsShape from './TableColumns.shape';

import { SORT_TYPES } from '../constants';

export default PropTypes.shape({
  keyField: PropTypes.string.isRequired,
  tableColumns: PropTypes.arrayOf(TableColumnsShape).isRequired,
  tableID: PropTypes.string.isRequired,
  defaultSearch: PropTypes.string,
  defaultSort: PropTypes.arrayOf(PropTypes.string, PropTypes.oneOf(SORT_TYPES)),
  displayTitle: PropTypes.string,
  extraToolbarItems: PropTypes.func,
  extraButtons: PropTypes.func,
  headers: PropTypes.object,
  minWidth: nonNegativeInteger,
  noDataIndication: PropTypes.node,
  useLocalStorage: PropTypes.bool,
  wrapperType: PropTypes.string,
});
