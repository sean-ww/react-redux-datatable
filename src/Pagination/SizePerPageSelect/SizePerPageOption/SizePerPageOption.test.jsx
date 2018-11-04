import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import SizePerPageOption from './SizePerPageOption';

describe('<SizePerPageOption>', () => {
  let wrapper;
  const text = 'page1';
  const page = 1;
  const onSizePerPageChange = sinon.stub();

  beforeEach(() => {
    onSizePerPageChange.reset();
    const props = { text, page, onSizePerPageChange };
    wrapper = shallow(<SizePerPageOption {...props} />);
  });

  it('should render SizePerPageOption correctly', () => {
    expect(wrapper.length).to.equal(1);
    expect(wrapper.find('li.dropdown-item').length).to.equal(1);
    expect(wrapper.find(`[data-page=${page}]`).length).to.equal(1);
    expect(wrapper.text()).to.equal(text);
  });

  describe('when MouseDown event happens', () => {
    const preventDefault = sinon.stub();
    beforeEach(() => {
      wrapper.find('button').simulate('mousedown', { preventDefault });
    });

    it('should calling props.onSizePerPageChange correctly', () => {
      expect(preventDefault.calledOnce).to.equal(true);
      expect(onSizePerPageChange.calledOnce).to.equal(true);
      expect(onSizePerPageChange.calledWith(page)).to.equal(true);
    });
  });
});
