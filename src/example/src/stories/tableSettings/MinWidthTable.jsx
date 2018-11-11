import React from 'react';
import Story from '../../components/Story';

const tableSettings = {
  tableID: 'MinWidthTable',
  keyField: 'request_id',
  minWidth: 2000,
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
    },
    {
      title: 'First Name',
      key: 'first_name',
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
  tableID: 'MinWidthTable',
  keyField: 'request_id',
  minWidth: 2000,
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
    },
    {
      title: 'First Name',
      key: 'first_name',
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
