export default function reducer(state = {
    DataTableExportData: {},
}, action) {
    switch (action.type) {
    case 'FETCH_EXPORT_TABLE_DATA': {
        return {
            ...state,
            DataTableExportData: action.payload,
        };
    }
    case 'FETCH_EXPORT_TABLE_DATA_REJECTED': {
        return {
            ...state,
            DataTableExportData: action.payload,
        };
    }
    case 'FETCH_EXPORT_TABLE_DATA_FULFILLED': {
        return {
            ...state,
            DataTableExportData: action.payload,
        };
    }
    case 'FETCH_EXPORT_TABLE_DATA_RESET': {
        return {
            ...state,
            DataTableExportData: action.payload,
        };
    }
    default: {
        return {
            ...state,
        };
    }
    }
}
