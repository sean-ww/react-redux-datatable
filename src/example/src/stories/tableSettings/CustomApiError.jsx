import React from 'react';
import Story from '../../components/Story';

const customApiError = errorObject => {
  if (errorObject.response.status === 400) {
    return (
      <div className="status_message offline">
        <p>{errorObject.message}</p>
      </div>
    );
  }
  return (
    <div className="status_message offline">
      <p>Something went wrong!</p>
    </div>
  );
};

const tableSettings = {
  tableID: 'CustomApiError',
  keyField: 'request_id',
  customApiError,
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

const customApiError = errorObject => {
  if (errorObject.response.status === 400) {
    return (
      <div className="status_message offline">
        <p>{errorObject.message}</p>
      </div>
    );
  }
  return (
    <div className="status_message offline">
      <p>Something went wrong!</p>
    </div>
  );
};

const tableSettings = {
  tableID: 'CustomApiError',
  keyField: 'request_id',
  customApiError,
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

const DataTable = () => <Story responseCode={400} sourceCode={sourceCode} tableSettings={tableSettings} />;

export default DataTable;
