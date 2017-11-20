import { updateExportState } from './updateReducerState';

export default function reducer(state = {
    DataTableExportData: {},
}, action) {
    switch (action.type) {
    case 'FETCH_EXPORT_TABLE_DATA': {
        return updateExportState(state, action);
    }
    case 'FETCH_EXPORT_TABLE_DATA_REJECTED': {
        return updateExportState(state, action);
    }
    case 'FETCH_EXPORT_TABLE_DATA_FULFILLED': {
        return updateExportState(state, action);
    }
    case 'FETCH_EXPORT_TABLE_DATA_RESET': {
        return updateExportState(state, action);
    }
    default: {
        return {
            ...state,
        };
    }
    }
}
