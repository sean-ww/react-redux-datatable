import React from 'react';
import Story from '../../components/Story';

const tableSettings = {
  tableID: 'SelectFilter',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      searchable: false,
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
      defaultValue: 'training',
    },
  ],
};

const sourceCode = `\
import DataTable from 'react-redux-datatable';
import 'react-redux-datatable/dist/styles.css';

const apiLocation = 'https://my.api/service';

const tableSettings = {
  tableID: 'SelectFilter',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      searchable: false,
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
      defaultValue: 'training',
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
