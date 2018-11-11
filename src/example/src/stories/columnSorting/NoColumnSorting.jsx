import React from 'react';
import Story from '../../components/Story';

const tableSettings = {
  tableID: 'NoColumnSorting',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      sortable: false,
    },
    {
      title: 'First Name',
      key: 'first_name',
      sortable: false,
    },
    {
      title: 'Last Name',
      key: 'surname',
      sortable: false,
    },
    {
      title: 'Email Address',
      key: 'email',
      sortable: false,
    },
  ],
};

const sourceCode = `\
import DataTable from 'react-redux-datatable';
import 'react-redux-datatable/dist/styles.css';

const apiLocation = 'https://my.api/service';

const tableSettings = {
  tableID: 'NoColumnSorting',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      sortable: false, // Each column is sortable by default
    },
    {
      title: 'First Name',
      key: 'first_name',
      sortable: false,
    },
    {
      title: 'Last Name',
      key: 'surname',
      sortable: false,
    },
    {
      title: 'Email Address',
      key: 'email',
      sortable: false,
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
