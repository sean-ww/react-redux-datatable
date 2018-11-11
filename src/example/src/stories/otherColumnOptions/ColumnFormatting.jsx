import React from 'react';
import moment from 'moment/moment';
import Story from '../../components/Story';

const dateFormatter = cell => moment(cell).format('ddd, Do MMM YYYY HH:mm');

const actionFormatter = (cell, row, index, extraData) => (
  <div class="table-icons">
    <span class="view link" />
    {`Example: ${cell} ${row.first_name} ${index} ${extraData}`}
  </div>
);

const tableSettings = {
  tableID: 'ColumnFormatting',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
    },
    {
      title: 'Request Date',
      key: 'created_at',
      filter: 'CustomDateRangeFilter',
      disableSearchAll: true,
      dataFormat: dateFormatter,
    },
    {
      title: 'Actions',
      key: 'actions',
      searchable: false,
      sortable: false,
      export: false,
      dataFormat: actionFormatter,
      formatExtraData: 'Some data', // the extra data can be in any format
    },
  ],
};

const sourceCode = `\
import DataTable from 'react-redux-datatable';
import moment from 'moment/moment';
import 'react-redux-datatable/dist/styles.css';

const apiLocation = 'https://my.api/service';

const dateFormatter = cell => moment(cell).format('ddd, Do MMM YYYY HH:mm');

const actionFormatter = (cell, row, index, extraData) => (
  <div class="table-icons">
    <span class="view link" />
    {'Example: ' + cell + ' ' + row.first_name + ' ' + index + ' ' + extraData}
  </div>
);

const tableSettings = {
  tableID: 'ColumnFormatting',
  keyField: 'request_id',
  tableColumns: [
    {
      title: 'Ref',
      key: 'request_id',
    },
    {
      title: 'Request Date',
      key: 'created_at',
      filter: 'CustomDateRangeFilter',
      disableSearchAll: true,
      dataFormat: dateFormatter,
    },
    {
      title: 'Actions',
      key: 'actions',
      searchable: false,
      sortable: false,
      export: false,
      dataFormat: actionFormatter,
      formatExtraData: 'Some data', // the extra data can be in any format
    },
  ],
};
`;

const DataTable = () => <Story sourceCode={sourceCode} tableSettings={tableSettings} />;

export default DataTable;
