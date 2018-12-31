import React from 'react';
import Story from '../../components/Story';

const PaginationTotal = (start, to, total) => (
  <div style={{ float: 'right' }}>
    {start}-{to} of {total}
  </div>
);

const tableSettings = {
  tableID: 'CustomPaginationTable',
  keyField: 'request_id',
  displayTitle: 'Requests Table',
  customPaginationTotal: PaginationTotal,
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

const PaginationTotal = (start, to, total) => (
  <div style={{ float: 'right' }}>
    {start}-{to} of {total}
  </div>
);

const tableSettings = {
  tableID: 'CustomPaginationTable',
  keyField: 'request_id',
  displayTitle: 'Requests Table',
  customPaginationTotal: PaginationTotal,
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
