import { expect } from 'chai';
import reducer from './DataTableExport.reducer';

describe('Data Table Export Reducer', () => {
    let state;
    beforeEach(() => {
        state = {
            DataTableExportData: {},
        };
    });

    it('Should set the correct default state', () => {
        const newState = reducer(state, { type: 'DEFAULT' });
        expect(Object.keys(newState).length).to.equal(1);
        expect(newState).to.deep.equal({
            DataTableExportData: {},
        });
    });

    it('Should handle FETCH_EXPORT_TABLE_DATA', () => {
        const newState = reducer(state, { type: 'FETCH_EXPORT_TABLE_DATA' });
        expect(Object.keys(newState).length).to.equal(1);
        expect(newState).to.deep.equal({
            DataTableExportData: undefined, // response
        });
    });

    it('Should handle FETCH_EXPORT_TABLE_DATA_REJECTED', () => {
        const newState = reducer(state, { type: 'FETCH_EXPORT_TABLE_DATA_REJECTED' });
        expect(Object.keys(newState).length).to.equal(1);
        expect(newState).to.deep.equal({
            DataTableExportData: undefined, // response
        });
    });

    it('Should handle FETCH_EXPORT_TABLE_DATA_FULFILLED', () => {
        const newState = reducer(state, { type: 'FETCH_EXPORT_TABLE_DATA_FULFILLED' });
        expect(Object.keys(newState).length).to.equal(1);
        expect(newState).to.deep.equal({
            DataTableExportData: undefined, // response
        });
    });

    it('Should handle FETCH_EXPORT_TABLE_DATA_RESET', () => {
        const newState = reducer(state, { type: 'FETCH_EXPORT_TABLE_DATA_RESET' });
        expect(Object.keys(newState).length).to.equal(1);
        expect(newState).to.deep.equal({
            DataTableExportData: undefined, // response
        });
    });
});
