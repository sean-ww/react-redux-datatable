import { combineReducers } from 'redux';
import DataTableReducer from '../src/DataTable.reducer';
import DataTableExportReducer from '../src/DataTableExport.reducer';

export default combineReducers({
    DataTableReducer,
    DataTableExportReducer,
});
