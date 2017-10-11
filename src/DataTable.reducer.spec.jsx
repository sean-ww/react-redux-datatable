import { expect } from 'chai';
import reducer from './DataTable.reducer';

describe('Data Table Reducer', () => {
    let state;
    beforeEach(() => {
        state = {
            DataTableData: {},
        };
    });

    it('Should set the correct default state', () => {
        const newState = reducer(state, { type: 'DEFAULT' });
        expect(Object.keys(newState).length).to.equal(1);
        expect(newState).to.deep.equal({
            DataTableData: {},
        });
    });

    it('Should handle FETCH_TABLE_DATA', () => {
        const newState = reducer(state, { type: 'FETCH_TABLE_DATA' });
        expect(newState).to.deep.equal({
            DataTableData: undefined, // response
        });
    });

    it('Should handle FETCH_TABLE_DATA_REJECTED', () => {
        const newState = reducer(state, { type: 'FETCH_TABLE_DATA_REJECTED' });
        expect(newState).to.deep.equal({
            DataTableData: undefined, // response
        });
    });

    it('Should handle FETCH_TABLE_DATA_FULFILLED', () => {
        const newState = reducer(state, { type: 'FETCH_TABLE_DATA_FULFILLED' });
        expect(newState).to.deep.equal({
            DataTableData: undefined, // response
        });
    });
});
