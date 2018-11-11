import React from 'react';
import Story from '../../components/Story';

const tableSettings = {
  tableID: 'NumberFilter',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      filter: 'NumberFilter', // Set the number filter
      defaultValue: { comparator: '=' }, // You must also set the default comparator '=', '>', '>=', '<', '<=', '!='
    },
    {
      title: 'User ID',
      key: 'user_id',
      filter: 'NumberFilter',
      defaultValue: { comparator: '>', number: 50 }, // You can also set a default number value
    },
  ],
};

const sourceCode = `\
import DataTable from 'react-redux-datatable';
import 'react-redux-datatable/dist/styles.css';

const apiLocation = 'https://my.api/service';

const tableSettings = {
  tableID: 'NumberFilter',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      filter: 'NumberFilter', // Set the number filter
      defaultValue: { comparator: '>' }, // You must also set the default comparator '=', '>', '>=', '<', '<=', '!='
    },
    {
      title: 'User ID',
      key: 'user_id',
      filter: 'NumberFilter',
      defaultValue: { comparator: '>', number: 50 }, // You can also set a default number value
    },
  ],
};

const DataTable = () => (
    <DataTable
      tableSettings={tableSettings}
      apiLocation={apiLocation}
    />
);
`;

const DataTable = () => <Story sourceCode={sourceCode} tableSettings={tableSettings} />;

export default DataTable;
