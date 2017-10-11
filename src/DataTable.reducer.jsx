export default function reducer(state = {
    DataTableData: {},
}, action) {
    switch (action.type) {
    case 'FETCH_TABLE_DATA': {
        return {
            ...state,
            DataTableData: action.payload,
        };
    }
    case 'FETCH_TABLE_DATA_REJECTED': {
        return {
            ...state,
            DataTableData: action.payload,
        };
    }
    case 'FETCH_TABLE_DATA_FULFILLED': {
        return {
            ...state,
            DataTableData: action.payload,
        };
    }
    default: {
        return {
            ...state,
        };
    }
    }
}
