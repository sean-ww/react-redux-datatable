import React from 'react';
import Story from '../../components/Story';

const tableSettings = {
  tableID: 'MinimalFeaturesTable',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      searchable: false,
      sortable: false,
      export: false,
    },
    {
      title: 'First Name',
      key: 'first_name',
      searchable: false,
      sortable: false,
      export: false,
    },
    {
      title: 'Last Name',
      key: 'surname',
      searchable: false,
      sortable: false,
      export: false,
    },
    {
      title: 'Email Address',
      key: 'email',
      searchable: false,
      sortable: false,
      export: false,
    },
  ],
};

const sourceCode = `\
import DataTable from 'react-redux-datatable';
import 'react-redux-datatable/dist/styles.css';

const apiLocation = 'https://my.api/service';

const tableSettings = {
  tableID: 'MinimalFeaturesTable',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      searchable: false,
      sortable: false,
      export: false,
    },
    {
      title: 'First Name',
      key: 'first_name',
      searchable: false,
      sortable: false,
      export: false,
    },
    {
      title: 'Last Name',
      key: 'surname',
      searchable: false,
      sortable: false,
      export: false,
    },
    {
      title: 'Email Address',
      key: 'email',
      searchable: false,
      sortable: false,
      export: false,
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
