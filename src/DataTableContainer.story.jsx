import React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider } from 'react-redux';
import moment from 'moment/moment';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import SEARCH_DATA from '../.storybook/mocks/api/search.json';
import search from '../.storybook/mocks/api/search'; // eslint-disable-line import/no-unresolved
import DataTable from './DataTableContainer';
import store from '../example/store';

import './assets/sass/styles.scss';

const mock = new MockAdapter(axios);
const MOCK_API_LOCATION = 'http://localhost/api/search';

const dateFormatter = cell => moment(cell).format('ddd, Do MMM YYYY HH:mm');

const actionFormatter = () => (
  <div class="table-icons">
    <span class="view link" />
  </div>
);

const exampleTableSettings = {
  tableID: 'ExampleDataTable',
  wrapperType: 'section',
  displayTitle: 'Requests Table',
  keyField: 'request_id',
  defaultSort: ['request_id', 'desc'],
  minWidth: 880,
  useLocalStorage: true,
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      filter: 'NumberFilter',
      defaultValue: { comparator: '=' },
      width: 74,
    },
    {
      title: 'User ID',
      key: 'user_id',
      filter: 'NumberFilter',
      defaultValue: { comparator: '=' },
      width: 74,
      export: false,
    },
    {
      title: 'First Name',
      key: 'first_name',
      width: 90,
    },
    {
      title: 'Last Name',
      key: 'surname',
      width: 90,
    },
    {
      title: 'Email Address',
      key: 'email',
      width: 164,
    },
    {
      title: 'Request Date',
      key: 'created_at',
      filter: 'CustomDateRangeFilter',
      disableSearchAll: true,
      dataFormat: dateFormatter,
      width: 120,
    },
    {
      title: 'Type',
      key: 'type',
      filter: 'SelectFilter',
      filterOptions: {
        Add: 'Add',
        Amend: 'Amend',
        Remove: 'Remove',
      },
    },
    {
      title: 'System',
      key: 'system_type',
      filter: 'SelectFilter',
      filterOptions: {
        training: 'training',
        staging: 'staging',
        production: 'production',
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      searchable: false,
      sortable: false,
      export: false,
      dataFormat: actionFormatter,
    },
  ],
};

storiesOf('DataTable', module).add('Basic Example', () => {
  mock.onPost(MOCK_API_LOCATION).reply(config => {
    const params = new URLSearchParams(decodeURIComponent(config.data));
    return [200, search(SEARCH_DATA, params)];
  });
  return (
    <Provider store={store}>
      <DataTable tableSettings={exampleTableSettings} apiLocation={MOCK_API_LOCATION} axiosInstance={axios} />
    </Provider>
  );
});
