import { expect } from 'chai';
import { LIST_ITEMS } from './constants';
import { calculatePageCount, calculateFromTo, createListItems } from './Pagination.helpers';

describe('Pagination Helpers', () => {
  describe('calculatePageCount', () => {
    const tests = [
      { sizePerPage: undefined, dataSize: undefined, willEqual: 0 },
      { sizePerPage: 1, dataSize: undefined, willEqual: 0 },
      { sizePerPage: undefined, dataSize: 10, willEqual: 0 },
      { sizePerPage: 1, dataSize: 'text', willEqual: 0 },
      { sizePerPage: 'text', dataSize: 10, willEqual: 0 },
      { sizePerPage: 1, dataSize: 0, willEqual: 0 },
      { sizePerPage: 0, dataSize: 1, willEqual: 0 },
      { sizePerPage: 0, dataSize: 0, willEqual: 0 },
      { sizePerPage: '1', dataSize: '10', willEqual: 10 },
      { sizePerPage: 1, dataSize: '10', willEqual: 10 },
      { sizePerPage: '1', dataSize: 10, willEqual: 10 },
      { sizePerPage: 1, dataSize: 10, willEqual: 10 },
      { sizePerPage: 10, dataSize: 10, willEqual: 1 },
      { sizePerPage: 15, dataSize: 10, willEqual: 1 },
      { sizePerPage: 10, dataSize: 150, willEqual: 15 },
      { sizePerPage: 10, dataSize: 151, willEqual: 16 },
    ];
    tests.forEach(test => {
      it(`sizePerPage ${test.sizePerPage} and dataSize ${test.dataSize} should return ${test.willEqual}`, () => {
        expect(calculatePageCount(test.sizePerPage, test.dataSize)).to.equal(test.willEqual);
      });
    });
  });

  describe('calculateFromTo', () => {
    const tests = [
      { currentPage: undefined, sizePerPage: undefined, dataSize: undefined, willEqual: [0, 0] },
      { currentPage: 'text', sizePerPage: 'text', dataSize: 'text', willEqual: [0, 0] },
      { currentPage: 0, sizePerPage: 0, dataSize: 0, willEqual: [0, 0] },
      { currentPage: 1, sizePerPage: 10, dataSize: 156, willEqual: [1, 10] },
      { currentPage: 4, sizePerPage: 10, dataSize: 156, willEqual: [31, 40] },
      { currentPage: 10, sizePerPage: 10, dataSize: 156, willEqual: [91, 100] },
      { currentPage: 16, sizePerPage: 10, dataSize: 156, willEqual: [151, 156] },
      { currentPage: '16', sizePerPage: '10', dataSize: '156', willEqual: [151, 156] },
      { currentPage: 100, sizePerPage: 10, dataSize: 156, willEqual: [991, 156] },
    ];
    tests.forEach(test => {
      it(`currentPage ${test.currentPage}, sizePerPage ${test.sizePerPage} and dataSize ${
        test.dataSize
      } should return ${test.willEqual}`, () => {
        expect(calculateFromTo(test.currentPage, test.sizePerPage, test.dataSize)[0]).to.equal(test.willEqual[0]);
        expect(calculateFromTo(test.currentPage, test.sizePerPage, test.dataSize)[1]).to.equal(test.willEqual[1]);
      });
    });
  });

  describe('createListItems', () => {
    const tests = [
      { currentPage: 0, pageCount: 0, hasPages: [], hasTitles: [] },
      { currentPage: 1, pageCount: 1, hasPages: [1], hasTitles: [] },
      { currentPage: 2, pageCount: 2, hasPages: ['<', 1, 2], hasTitles: ['previous page'] },
      { currentPage: 1, pageCount: 7, hasPages: [1, 2, 3, 4, 5, '>', '>>'], hasTitles: ['next page', 'last page'] },
      { currentPage: 1, pageCount: 3, hasPages: [1, 2, 3, '>'], hasTitles: ['next page'] },
      { currentPage: 1, pageCount: 5, hasPages: [1, 2, 3, 4, 5, '>'], hasTitles: ['next page'] },
      { currentPage: 4, pageCount: 5, hasPages: ['<', 1, 2, 3, 4, 5, '>'], hasTitles: ['previous page', 'next page'] },
      { currentPage: 5, pageCount: 5, hasPages: ['<', 1, 2, 3, 4, 5], hasTitles: ['previous page'] },
      {
        currentPage: 2,
        pageCount: 7,
        hasPages: ['<', 1, 2, 3, 4, 5, '>', '>>'],
        hasTitles: ['previous page', 'next page', 'last page'],
      },
      {
        currentPage: 40,
        pageCount: 500,
        hasPages: ['<<', '<', 38, 39, 40, 41, 42, '>', '>>'],
        hasTitles: ['first page', 'previous page', 'next page', 'last page'],
      },
      {
        currentPage: 40,
        pageCount: 41,
        hasPages: ['<<', '<', 37, 38, 39, 40, 41, '>'],
        hasTitles: ['first page', 'previous page', 'next page'],
      },
    ];
    tests.forEach(test => {
      const listItems = createListItems(test.currentPage, test.pageCount);
      it(`currentPage ${test.currentPage} and pageCount ${test.pageCount} should have pages ${test.hasPages}`, () => {
        const listItemsPages = listItems.map(item => item.page);
        expect(listItemsPages).to.eql(test.hasPages);
      });

      if (test.currentPage > 0) {
        it(`currentPage ${test.currentPage} and pageCount ${test.pageCount} should have active page ${
          test.currentPage
        }`, () => {
          const activeListItems = listItems.filter(item => item.active).map(item => item.page);
          expect(activeListItems).to.eql([test.currentPage]);
        });
      }

      it(`currentPage ${test.currentPage} and pageCount ${test.pageCount} should have correct titles ${
        test.hasTitles
      }`, () => {
        const textListItems = Object.values(LIST_ITEMS).map(item => item.TEXT);
        const listItemsTitles = listItems.filter(item => textListItems.includes(item.page)).map(item => item.title);
        expect(listItemsTitles).to.eql(test.hasTitles);
      });
    });
  });
});
