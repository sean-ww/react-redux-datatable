import React from 'react';
import Story from '../../components/Story';

const from = new Date('2016-01-01');
const to = new Date('2020-01-01');

const tableSettings = {
  tableID: 'DateRangeFilter',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      searchable: false,
    },
    {
      title: 'Request Date',
      key: 'created_at',
      filter: 'CustomDateRangeFilter',
      defaultValue: { from, to }, // You can also set default values
    },
  ],
};

const sourceCode = `\
import DataTable from 'react-redux-datatable';
import 'react-redux-datatable/dist/styles.css';

const apiLocation = 'https://my.api/service';

const from = new Date('2017-01-01');
const to = new Date('2018-01-01');

const tableSettings = {
  tableID: 'DateRangeFilter',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
      searchable: false,
    },
    {
      title: 'Request Date',
      key: 'created_at',
      filter: 'CustomDateRangeFilter',
      defaultValue: { from, to }, // You can also set default values
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
