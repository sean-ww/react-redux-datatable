import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import SizePerPageOption from './SizePerPageOption/SizePerPageOption';
import SizePerPageSelect from './SizePerPageSelect';

describe('<SizePerPageSelect>', () => {
  let wrapper;
  const currentSizePerPage = '25';
  const options = [10, 25];
  const onClick = sinon.stub();
  const onBlur = sinon.stub();
  const onSizePerPageChange = sinon.stub();
  const props = {
    currentSizePerPage,
    options,
    onClick,
    onBlur,
    onSizePerPageChange,
  };

  describe('default SizePerPageSelect component', () => {
    beforeEach(() => {
      wrapper = shallow(<SizePerPageSelect {...props} />);
    });

    it('should render SizePerPageSelect correctly', () => {
      expect(wrapper.length).to.equal(1);
      expect(wrapper.find('button').length).to.equal(1);
      expect(wrapper.find('button').text()).to.equal(`${currentSizePerPage} `);
    });

    it('should render SizePerPageOption successfully', () => {
      expect(wrapper.find('ul.dropdown-menu').length).to.equal(1);
      const sizePerPageOptions = wrapper.find(SizePerPageOption);
      expect(sizePerPageOptions.length).to.equal(options.length);
      sizePerPageOptions.forEach((sizePerPage, i) => {
        const option = options[i];
        expect(sizePerPage.prop('text')).to.equal(option);
        expect(sizePerPage.prop('page')).to.equal(option);
        expect(sizePerPage.prop('onSizePerPageChange')).to.equal(onSizePerPageChange);
      });
    });

    it('default drop down is not open', () => {
      expect(wrapper.hasClass('open show')).to.equal(false);
      expect(wrapper.find('[aria-expanded=false]').length).to.equal(1);
    });
  });

  describe('when isOpen prop is true', () => {
    beforeEach(() => {
      wrapper = shallow(<SizePerPageSelect {...props} isOpen />);
    });

    it('should render SizePerPageSelect correctly', () => {
      expect(wrapper.hasClass('open show')).to.equal(true);
      expect(wrapper.find('[aria-expanded=true]').length).to.equal(1);
    });
  });
});
