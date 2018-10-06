import React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider } from 'react-redux';
import moment from 'moment/moment';
import DataTable from './DataTableContainer';
import store from '../example/store';

import '../dist/styles.css'; // import 'react-redux-datatable/dist/styles.css';

// const apiLocation = `${window.location.protocol}//${window.location.hostname}/datatable-service/search`;
const apiLocation = 'http://seanwallis.com/datatable-service/search';

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

// todo: try addDecorator?

// storiesOf('DataTable', module)
//   .add('with TEST1', () => (
//     <Provider store={store}><DataTable tableSettings={exampleTableSettings} apiLocation={apiLocation} /></Provider>
//   ))
//   .add('with some TEST2', () => (
//     <Provider store={store}><DataTable tableSettings={exampleTableSettings} apiLocation={apiLocation} /></Provider>
//   ));

storiesOf('DataTable', module).add('with TEST1', () => (
  <Provider store={store}>
    <DataTable tableSettings={exampleTableSettings} apiLocation={apiLocation} />
  </Provider>
));
