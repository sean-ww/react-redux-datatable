import React from 'react';
import Story from '../../components/Story';

const tableSettings = {
  tableID: 'TextFilter',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      defaultValue: 'Set a default filter value',
    },
    {
      title: 'First Name',
      key: 'first_name',
      filter: 'TextFilter', // a text filter is applied by default, so this is not needed
    },
    {
      title: 'Last Name',
      key: 'surname',
    },
    {
      title: 'Email Address',
      key: 'email',
    },
  ],
};

const sourceCode = `\
import DataTable from 'react-redux-datatable';
import 'react-redux-datatable/dist/styles.css';

const apiLocation = 'https://my.api/service';

const tableSettings = {
  tableID: 'TextFilter',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      defaultValue: 'Set a default filter value',
    },
    {
      title: 'First Name',
      key: 'first_name',
      filter: 'TextFilter', // a text filter is applied by default, so this is not needed
    },
    {
      title: 'Last Name',
      key: 'surname',
    },
    {
      title: 'Email Address',
      key: 'email',
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
