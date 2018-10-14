import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import SizePerPageSelect from './SizePerPageSelect/SizePerPageSelect';
import PaginationList from './PaginationList/PaginationList';
import Pagination from './Pagination';

describe('<Pagination>', () => {
  let wrapper;
  let instance;

  const createMockProps = props => ({
    dataSize: 100,
    currentPage: 1,
    currentSizePerPage: 10,
    onPageChange: sinon.stub(),
    onSizePerPageChange: sinon.stub(),
    ...props,
  });

  describe('default pagination', () => {
    const props = createMockProps();

    beforeEach(() => {
      wrapper = shallow(<Pagination {...props} />);
      instance = wrapper.instance();
    });

    it('should render correctly', () => {
      expect(wrapper.length).to.equal(1);
      expect(wrapper.hasClass('react-bootstrap-table-pagination')).to.equal(true);
      expect(wrapper.find('.react-bootstrap-table-pagination-list-hidden').length).to.equal(0);
    });

    it('should have the correct state', () => {
      expect(instance.state).to.be.defined;
      expect(instance.state.isDropDownOpen).to.equal(false);
    });

    it('should render the PaginationList component successfully', () => {
      const paginationList = wrapper.find(PaginationList);
      expect(paginationList.length).to.equal(1);
      expect(paginationList.prop('pages').length).to.equal(7);
      expect(paginationList.prop('onPageChange')).to.equal(instance.handleChangePage);
    });

    it('should render the SizePerPageDropDown component successfully', () => {
      const sizePerPageDropDown = wrapper.find(SizePerPageSelect);
      expect(sizePerPageDropDown.length).to.equal(1);

      expect(sizePerPageDropDown.prop('currentSizePerPage')).to.equal(`${props.currentSizePerPage}`);
      expect(sizePerPageDropDown.prop('options')).to.eql([10, 25, 50, 100]);
      expect(sizePerPageDropDown.prop('onSizePerPageChange')).to.equal(instance.handleChangeSizePerPage);
      expect(sizePerPageDropDown.prop('onClick')).to.equal(instance.toggleDropDown);
      expect(sizePerPageDropDown.prop('isOpen')).to.equal(false);
    });
  });

  describe('toggleDropDown', () => {
    beforeEach(() => {
      const props = createMockProps();
      wrapper = shallow(<Pagination {...props} />);
      instance = wrapper.instance();
    });

    it('should set state.isDropDownOpen as true when it is false', () => {
      instance.toggleDropDown();
      expect(instance.state.isDropDownOpen).to.equal(true);
    });

    it('should set state.isDropDownOpen as false when it is true', () => {
      instance.toggleDropDown();
      instance.toggleDropDown();
      expect(instance.state.isDropDownOpen).to.equal(false);
    });
  });

  describe('closeDropDown', () => {
    beforeEach(() => {
      const props = createMockProps();
      wrapper = shallow(<Pagination {...props} />);
      instance = wrapper.instance();
    });

    it('should always set state.isDropDownOpen as false', () => {
      instance.closeDropDown();
      expect(instance.state.isDropDownOpen).to.equal(false);
      instance.closeDropDown();
      expect(instance.state.isDropDownOpen).to.equal(false);
    });
  });

  describe('handleChangeSizePerPage', () => {
    const props = createMockProps();

    beforeEach(() => {
      wrapper = shallow(<Pagination {...props} />);
      instance = wrapper.instance();
    });

    it('should always set state.isDropDownOpen to false', () => {
      instance.handleChangeSizePerPage(10);
      expect(instance.state.isDropDownOpen).to.equal(false);
    });

    describe('when new sizePerPage is same as current one', () => {
      it('should not call props.onSizePerPageChange', () => {
        instance.handleChangeSizePerPage(10);
        expect(props.onSizePerPageChange.callCount).to.equal(0);
      });
    });

    describe('when new sizePerPage is different than current one', () => {
      it('should call props.onSizePerPageChange', () => {
        instance.handleChangeSizePerPage(30);
        expect(props.onSizePerPageChange.callCount).to.equal(1);
      });

      describe('new current page is still in the new pagination list', () => {
        it('should call props.onSizePerPageChange with the correct arguments', () => {
          expect(props.onSizePerPageChange.calledWith(30, props.currentPage));
        });
      });

      describe('new current page is still in the new pagination list', () => {
        beforeEach(() => {
          wrapper = shallow(<Pagination {...createMockProps({ currentPage: 10 })} />);
          instance = wrapper.instance();
        });

        it('should call props.onSizePerPageChange with the correct arguments', () => {
          expect(props.onSizePerPageChange.calledWith(30, 4));
        });
      });
    });
  });

  describe('handleChangePage', () => {
    const props = createMockProps();

    beforeEach(() => {
      props.currentPage = 6;
      wrapper = shallow(<Pagination {...props} />);
      instance = wrapper.instance();
    });

    afterEach(() => {
      props.onPageChange.reset();
    });

    it('should call props.onPageChange correctly when new page is equal to <', () => {
      instance.handleChangePage('<');
      expect(props.onPageChange.callCount).to.equal(1);
      expect(props.onPageChange.calledWith(5)).to.equal(true);
    });

    it('should call props.onPageChange correctly when new page is equal to >', () => {
      instance.handleChangePage('>');
      expect(props.onPageChange.callCount).to.equal(1);
      expect(props.onPageChange.calledWith(7)).to.equal(true);
    });

    it('should call props.onPageChange correctly when new page is equal to >>', () => {
      instance.handleChangePage('>>');
      expect(props.onPageChange.callCount).to.equal(1);
      expect(props.onPageChange.calledWith(10)).to.equal(true);
    });

    it('should call props.onPageChange correctly when new page is equal to <<', () => {
      instance.handleChangePage('<<');
      expect(props.onPageChange.callCount).to.equal(1);
      expect(props.onPageChange.calledWith(1)).to.equal(true);
    });

    it('should call props.onPageChange correctly when new page is a numeric page', () => {
      const newPage = '8';
      instance.handleChangePage(newPage);
      expect(props.onPageChange.callCount).to.equal(1);
      expect(props.onPageChange.calledWith(parseInt(newPage, 10))).to.equal(true);
    });

    it('should not call props.onPageChange when page is not changed', () => {
      const newPage = props.currentPage;
      instance.handleChangePage(newPage);
      expect(props.onPageChange.callCount).to.equal(0);
    });
  });
});
