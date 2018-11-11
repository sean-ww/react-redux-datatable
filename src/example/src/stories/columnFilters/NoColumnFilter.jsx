import React from 'react';
import Story from '../../components/Story';

const tableSettings = {
  tableID: 'NoColumnFilter',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      searchable: false, // set searchable to false to remove the default text column filter
    },
    {
      title: 'First Name',
      key: 'first_name',
      searchable: false,
    },
    {
      title: 'Last Name',
      key: 'surname',
    },
    {
      title: 'Email Address',
      key: 'email',
      defaultValue: 'gmail',
    },
  ],
};

const sourceCode = `\
import DataTable from 'react-redux-datatable';
import 'react-redux-datatable/dist/styles.css';

const apiLocation = 'https://my.api/service';

const tableSettings = {
  tableID: 'NoColumnFilter',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      searchable: false, // set searchable to false to remove the default text column filter
    },
    {
      title: 'First Name',
      key: 'first_name',
      searchable: false,
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
