import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import PageButton from './PageButton';

describe('<PageButton>', () => {
  let wrapper;
  const onPageChangeCallback = sinon.stub();
  const props = {
    onPageChange: onPageChangeCallback,
    page: 2,
  };

  describe('default PageButton', () => {
    beforeEach(() => {
      wrapper = shallow(<PageButton {...props} active />);
    });

    it('should render a PageButton correctly', () => {
      expect(wrapper.find('button.page-link').length).to.equal(1);
      expect(wrapper.text()).to.equal(`${props.page}`);
      expect(wrapper.prop('title')).to.equal('');
    });

    describe('when clicking', () => {
      let preventDefault;
      beforeEach(() => {
        preventDefault = sinon.stub();
        wrapper.find('button.page-link').simulate('click', { preventDefault });
      });

      afterEach(() => {
        onPageChangeCallback.reset();
      });

      it('should call e.preventDefault', () => {
        expect(preventDefault.calledOnce).to.equal(true);
      });

      it('should call onPageChange prop', () => {
        expect(onPageChangeCallback.calledOnce).to.equal(true);
      });

      it('should call onPageChange prop with the correct argument', () => {
        expect(onPageChangeCallback.calledWith(props.page)).to.equal(true);
      });
    });
  });

  describe('when active prop is true', () => {
    beforeEach(() => {
      wrapper = shallow(<PageButton {...props} active />);
    });

    it('should render PageButton correctly', () => {
      expect(wrapper.length).to.equal(1);
      expect(wrapper.hasClass('active')).to.equal(true);
    });
  });

  describe('when active prop is false', () => {
    beforeEach(() => {
      wrapper = shallow(<PageButton {...props} active={false} />);
    });

    it('should render PageButton correctly', () => {
      expect(wrapper.length).to.equal(1);
      expect(wrapper.hasClass('active')).to.equal(false);
    });
  });

  describe('when title prop is defined', () => {
    const title = 'aTitle';
    beforeEach(() => {
      wrapper = shallow(<PageButton {...props} active title={title} />);
    });

    it('should render PageButton correctly', () => {
      expect(wrapper.length).to.equal(1);
      expect(wrapper.prop('title')).to.equal(title);
    });
  });
});
