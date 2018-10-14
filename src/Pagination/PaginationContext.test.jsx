import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Pagination from './Pagination';
import createPaginationContext from './PaginationContext';

const data = [];
for (let i = 0; i < 100; i += 1) {
  data.push({
    id: i,
    name: `itme name ${i}`,
  });
}

describe('PaginationContext', () => {
  let wrapper;
  let PaginationContext;

  const columns = [
    {
      dataField: 'id',
      text: 'ID',
    },
    {
      dataField: 'name',
      text: 'Name',
    },
  ];

  const defaultPaginationOptions = {
    options: {
      onSizePerPageChange: () => {},
      page: 1,
      sizePerPage: 10,
      totalSize: data.length,
    },
  };

  const mockBase = props => <div {...props} />;

  const handleRemotePaginationChange = () => {};

  function shallowContext(customPagination = defaultPaginationOptions, enableRemote = true) {
    PaginationContext = createPaginationContext(enableRemote, handleRemotePaginationChange);

    return (
      <PaginationContext.Provider pagination={customPagination} columns={columns} data={data}>
        <PaginationContext.Consumer>{paginationProps => mockBase(paginationProps)}</PaginationContext.Consumer>
      </PaginationContext.Provider>
    );
  }

  describe('default render', () => {
    beforeEach(() => {
      wrapper = shallow(shallowContext());
      wrapper.render();
    });

    it('should have correct Provider property after calling createPaginationContext', () => {
      expect(PaginationContext.Provider).to.be.defined;
    });

    it('should have correct Consumer property after calling createPaginationContext', () => {
      expect(PaginationContext.Consumer).to.be.defined;
    });

    it('should render Pagination component correctly', () => {
      expect(wrapper.length).to.equal(1);
      const pagination = wrapper.find(Pagination);
      expect(pagination).to.have.length(1);
    });
  });
});
