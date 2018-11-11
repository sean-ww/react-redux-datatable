import React from 'react';
import Story from '../../components/Story';

const AddLink = () => (
  <a
    class="table-icons"
    href="/"
    style={{
      padding: '4px 0px 2px 6px',
      lineHeight: '23px',
    }}
  >
    <span
      class="add link"
      data-tip="Add New"
      style={{
        display: 'inline-block',
        marginBottom: '-4px',
        marginRight: '2px',
      }}
    />
    Add New
  </a>
);

const tableSettings = {
  tableID: 'ExtraToolbarItemsTable',
  keyField: 'request_id',
  displayTitle: 'Requests Table',
  extraToolbarItems: AddLink,
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

const AddLink = () => (
  <a
    class="table-icons"
    href="/"
    style={{
      padding: '4px 0px 2px 6px',
      lineHeight: '23px',
    }}
  >
    <span
      class="add link"
      data-tip="Add New"
      style={{
        display: 'inline-block',
        marginBottom: '-4px',
        marginRight: '2px',
      }}
    />
    Add New
  </a>
);

const tableSettings = {
  tableID: 'ExtraToolbarItemsTable',
  keyField: 'request_id',
  displayTitle: 'Requests Table',
  extraToolbarItems: AddLink,
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
