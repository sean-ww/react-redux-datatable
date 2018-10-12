import React, { Component } from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import pageResolver from '../src/page-resolver';

const extendTo = Base =>
  class MockComponent extends Base {
    constructor(props) {
      super(props);
      // this.state = this.initialState();
    }
    render() { return null; }
  };

describe('PageResolver', () => {
  const ExtendBase = pageResolver(Component);
  const MockComponent = extendTo(ExtendBase);

  const createMockProps = () => ({
    dataSize: 100,
    sizePerPageList: [10, 20, 30, 50],
    currPage: 1,
    currSizePerPage: 10,
    paginationSize: 5,
  });

  let wrapper;

  describe('initialize', () => {
    beforeEach(() => {
      const mockElement = React.createElement(MockComponent, createMockProps(), null);
      wrapper = shallow(mockElement);
    });

    it('should creating initial state correctly', () => {
      const instance = wrapper.instance();
      expect(instance.state.totalPages).toBeDefined();
      expect(instance.state.totalPages).toEqual(instance.calculateTotalPage());
      expect(instance.state.lastPage).toBeDefined();
      expect(instance.state.lastPage).toEqual(instance.state.totalPages);
      expect(instance.state.dropdownOpen).toBeDefined();
      expect(instance.state.dropdownOpen).toBeFalsy();
    });
  });

  describe('calculateFromTo', () => {
    const props = createMockProps();
    beforeEach(() => {
      const mockElement = React.createElement(MockComponent, props, null);
      wrapper = shallow(mockElement);
    });

    it('should return correct array with from and to value', () => {
      const instance = wrapper.instance();
      expect(instance.calculateFromTo()).toEqual([1, props.currSizePerPage]);
    });

    describe('if data is empty', () => {
      beforeEach(() => {
        props.dataSize = 87;
        props.currPage = 9;
        const mockElement = React.createElement(MockComponent, props, null);
        wrapper = shallow(mockElement);
      });

      it('should return correct array with from and to value', () => {
        const instance = wrapper.instance();
        expect(instance.calculateFromTo()).toEqual([81, props.dataSize]);
      });
    });

    describe('if current page is last page', () => {
      beforeEach(() => {
        props.dataSize = 0;
        const mockElement = React.createElement(MockComponent, props, null);
        wrapper = shallow(mockElement);
      });

      it('should return correct array with from and to value', () => {
        const instance = wrapper.instance();
        expect(instance.calculateFromTo()).toEqual([0, 0]);
      });
    });
  });

  describe('calculateTotalPage', () => {
    const props = createMockProps();

    describe('when missing sizePerPage argument', () => {
      beforeEach(() => {
        const mockElement = React.createElement(MockComponent, props, null);
        wrapper = shallow(mockElement);
      });

      it('should getting total pages correctly by default props.currSizePerPage', () => {
        const instance = wrapper.instance();
        expect(instance.calculateTotalPage()).toEqual(10);
      });
    });

    describe('when sizePerPage argument given', () => {
      beforeEach(() => {
        const mockElement = React.createElement(MockComponent, props, null);
        wrapper = shallow(mockElement);
      });

      it('should getting total pages correctly by sizePerPage argument', () => {
        const instance = wrapper.instance();
        expect(instance.calculateTotalPage(25)).toEqual(4);
      });
    });
  });

  describe('generatePagination', () => {
    describe('calculate by state.totalPages and state.lastPage', () => {
      const props = createMockProps();
      beforeEach(() => {
        const mockElement = React.createElement(MockComponent, props, null);
        wrapper = shallow(mockElement);
      });

      /*

      // could put pagination calc things in own package?
      change function name to generatePagination
      (combine with other function? calculatePageStatus)
      (or even see render/other components)

      1 2 3 4 5 > >>
      currentPage: 1
      pageCount: 7
      paginationSize: 5

      use provider (each or foreach)... with labels...
      see GW / space etc...


       */

      it('should getting pages list correctly', () => {
        const instance = wrapper.instance();
        // expect(instance.generatePagination()).to.equal(
        //   [props.prePageText, 1, 2, 3, 4, 5, props.nextPageText, props.lastPageText]);

        expect(instance.generatePagination(1, 7, 5)).to.eql(
          [1, 2, 3, 4, 5, '>', '>>']
        );
        expect(instance.generatePaginationPages(1, 7, 5)).to.eql(
          [1, 2, 3, 4, 5]
        );

        expect(instance.generatePagination(1, 3, 5)).to.eql(
          [1, 2, 3, '>']
        );
        expect(instance.generatePaginationPages(1, 3, 5)).to.eql(
          [1, 2, 3]
        );

        expect(instance.generatePagination(1, 5, 5)).to.eql(
          [1, 2, 3, 4, 5, '>']
        );
        expect(instance.generatePaginationPages(1, 5, 5)).to.eql(
          [1, 2, 3, 4, 5]
        );

        expect(instance.generatePagination(4, 5, 5)).to.eql(
          ['<', 1, 2, 3, 4, 5, '>']
        );
        expect(instance.generatePaginationPages(40, 500, 5)).to.eql(
          [38, 39, 40, 41, 42]
        );
        expect(instance.generatePaginationPages(40, 41, 5)).to.eql(
          [37, 38, 39, 40, 41]
        );

        expect(instance.generatePaginationPages(4, 5, 5)).to.eql(
          [1, 2, 3, 4, 5]
        );

        expect(instance.generatePagination(5, 5, 5)).to.eql(
          ['<', 1, 2, 3, 4, 5]
        );
        expect(instance.generatePaginationPages(5, 5, 5)).to.eql(
          [1, 2, 3, 4, 5]
        );

        expect(instance.generatePagination(2, 7, 5)).to.eql(
          ['<', 1, 2, 3, 4, 5, '>', '>>']
        );
        expect(instance.generatePaginationPages(2, 7, 5)).to.eql(
          [1, 2, 3, 4, 5]
        );

        expect(instance.generatePagination(4, 7, 5)).to.eql(
          ['<<', '<', 2, 3, 4, 5, 6, '>', '>>']
        );
        expect(instance.generatePagination(5, 7, 5)).to.eql(
          ['<<', '<', 3, 4, 5, 6, 7, '>']
        );
        expect(instance.generatePaginationPages(4, 7, 5)).to.eql(
          [2, 3, 4, 5, 6]
        );
      });
    });

    describe('calculate by props.currPage', () => {
      const props = createMockProps();
      const { firstPageText, prePageText, nextPageText, lastPageText } = props;

      it('should getting pages list correctly', () => {
        const currPages = Array.from(Array(10).keys());
        currPages.forEach((currPage) => {
          props.currPage = currPage + 1;
          wrapper = shallow(<MockComponent { ...props } />);
          const pageList = wrapper.instance().generatePagination();

          if (props.currPage < 4) {
            expect(pageList).toEqual(
              [prePageText, 1, 2, 3, 4, 5, nextPageText, lastPageText]);
          } else if (props.currPage > 7) {
            expect(pageList).toEqual(
              [firstPageText, prePageText, 6, 7, 8, 9, 10, nextPageText]);
          } else if (props.currPage === 4) {
            expect(pageList).toEqual(
              [firstPageText, prePageText, 2, 3, 4, 5, 6, nextPageText, lastPageText]);
          } else if (props.currPage === 5) {
            expect(pageList).toEqual(
              [firstPageText, prePageText, 3, 4, 5, 6, 7, nextPageText, lastPageText]);
          } else if (props.currPage === 6) {
            expect(pageList).toEqual(
              [firstPageText, prePageText, 4, 5, 6, 7, 8, nextPageText, lastPageText]);
          } else {
            expect(pageList).toEqual(
              [firstPageText, prePageText, 5, 6, 7, 8, 9, nextPageText, lastPageText]);
          }
        });
      });
    });

    describe('the quantity of pages is calculated by props.paginationSize', () => {
      const props = createMockProps();
      const indicators = [
        props.firstPageText, props.prePageText, props.lastPageText, props.nextPageText
      ];

      it('should getting pages list correctly', () => {
        [1, 3, 5, 8, 10].forEach((paginationSize) => {
          props.paginationSize = paginationSize;
          wrapper = shallow(<MockComponent { ...props } />);
          const pageList = wrapper.instance().generatePagination();
          const result = pageList.filter(p => indicators.indexOf(p) === -1);
          expect(result.length).toEqual(props.paginationSize);
        });
      });
    });

    describe('when state.totalPages is zero', () => {
      const props = createMockProps();
      props.dataSize = 0;

      beforeEach(() => {
        const mockElement = React.createElement(MockComponent, props, null);
        wrapper = shallow(mockElement);
      });

      it('should getting empty array', () => {
        expect(wrapper.instance().generatePagination()).toEqual([]);
      });
    });
  });

  describe('calculatePageStatus', () => {
    let instance;
    let pageStatus;

    describe('default case', () => {
      const props = createMockProps();
      beforeEach(() => {
        const mockElement = React.createElement(MockComponent, props, null);
        wrapper = shallow(mockElement);
        instance = wrapper.instance();
        pageStatus = instance.calculatePageStatus(instance.generatePagination());
      });

      it('should returning correct format for page status', () => {
        pageStatus.forEach((p) => {
          expect(Object.prototype.hasOwnProperty.call(p, 'page')).toBeTruthy();
          expect(Object.prototype.hasOwnProperty.call(p, 'active')).toBeTruthy();
          expect(Object.prototype.hasOwnProperty.call(p, 'disabled')).toBeTruthy();
          expect(Object.prototype.hasOwnProperty.call(p, 'title')).toBeTruthy();
        });
      });

      it('should mark active status as true when it is props.currPage', () => {
        expect(pageStatus.find(p => p.page === props.currPage).active).toBeTruthy();
      });

      it('only have one page\'s active status is true', () => {
        expect(pageStatus.filter(p => p.page === props.currPage).length).toEqual(1);
      });
    });
  });

  describe('calculateSizePerPageStatus', () => {
    describe('when props.sizePerPageList is an number array', () => {
      const props = createMockProps();
      beforeEach(() => {
        const mockElement = React.createElement(MockComponent, props, null);
        wrapper = shallow(mockElement);
      });

      it('should getting correctly sizePerPage status', () => {
        const instance = wrapper.instance();
        const result = instance.calculateSizePerPageStatus();
        expect(result.length).toEqual(props.sizePerPageList.length);
        result.forEach((sizePerPage, i) => {
          expect(sizePerPage.text).toEqual(`${props.sizePerPageList[i]}`);
          expect(sizePerPage.page).toEqual(props.sizePerPageList[i]);
        });
      });
    });

    describe('when props.sizePerPageList is an object array', () => {
      const props = createMockProps();
      props.sizePerPageList = [{
        text: 'ten', value: 10
      }, {
        text: 'thirty', value: 30
      }];

      beforeEach(() => {
        const mockElement = React.createElement(MockComponent, props, null);
        wrapper = shallow(mockElement);
      });

      it('should getting correctly sizePerPage status', () => {
        const instance = wrapper.instance();
        const result = instance.calculateSizePerPageStatus();
        expect(result.length).toEqual(props.sizePerPageList.length);
        result.forEach((sizePerPage, i) => {
          expect(sizePerPage.text).toEqual(props.sizePerPageList[i].text);
          expect(sizePerPage.page).toEqual(props.sizePerPageList[i].value);
        });
      });
    });
  });
});
