import React from 'react';
import Story from '../../components/Story';

// If all columns are not searchable, there will be no filters or global search
const tableSettings = {
  tableID: 'NoSearch',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      searchable: false,
    },
    {
      title: 'First Name',
      key: 'first_name',
      searchable: false,
    },
    {
      title: 'Last Name',
      key: 'surname',
      searchable: false,
    },
    {
      title: 'Email Address',
      key: 'email',
      searchable: false,
    },
  ],
};

const sourceCode = `\
import DataTable from 'react-redux-datatable';
import 'react-redux-datatable/dist/styles.css';

const apiLocation = 'https://my.api/service';

const tableSettings = {
  tableID: 'NoSearch',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      searchable: false,
    },
    {
      title: 'First Name',
      key: 'first_name',
      searchable: false,
    },
    {
      title: 'Last Name',
      key: 'surname',
      searchable: false,
    },
    {
      title: 'Email Address',
      key: 'email',
      searchable: false,
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
