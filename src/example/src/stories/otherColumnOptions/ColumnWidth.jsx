import React from 'react';
import Story from '../../components/Story';

const tableSettings = {
  tableID: 'ColumnWidth',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      width: 120, // in pixels
    },
    {
      title: 'First Name',
      key: 'first_name',
      width: 50,
    },
    {
      title: 'Last Name',
      key: 'surname',
      width: 50,
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
  tableID: 'ColumnWidth',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      width: 140, // in pixels
    },
    {
      title: 'First Name',
      key: 'first_name',
      width: 40,
    },
    {
      title: 'Last Name',
      key: 'surname',
      width: 40,
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
