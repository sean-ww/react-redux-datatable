import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import PageButton from './PageButton/PageButton';
import PaginationList from './PaginationList';

describe('<PaginationList>', () => {
  let wrapper;
  const onPageChange = sinon.stub();
  const pages = [
    {
      page: 1,
      active: false,
      title: '1',
    },
    {
      page: 2,
      active: true,
      title: '2',
    },
    {
      page: 3,
      active: false,
      title: '3',
    },
  ];

  beforeEach(() => {
    wrapper = shallow(<PaginationList pages={pages} onPageChange={onPageChange} />);
  });

  it('should render PaginatonList correctly', () => {
    expect(wrapper.length).to.equal(1);
    expect(wrapper.find('ul.react-bootstrap-table-page-btns-ul').length).to.equal(1);
    expect(wrapper.find(PageButton).length).to.equal(3);
  });
});
