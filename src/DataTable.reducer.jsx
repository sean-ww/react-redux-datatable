import update from './updateReducerState';

export default function reducer(
  state = {
    DataTableData: {},
  },
  action,
) {
  switch (action.type) {
    case 'FETCH_TABLE_DATA': {
      return update(state, action);
    }
    case 'FETCH_TABLE_DATA_REJECTED': {
      return update(state, action);
    }
    case 'FETCH_TABLE_DATA_FULFILLED': {
      return update(state, action);
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
