# react-redux-datatable

[![Build Status](https://travis-ci.org/sean-ww/react-redux-datatable.svg?branch=master)](https://travis-ci.org/sean-ww/react-redux-datatable)
[![Coverage Status](https://coveralls.io/repos/github/sean-ww/react-redux-datatable/badge.svg?branch=master)](https://coveralls.io/github/sean-ww/react-redux-datatable?branch=master)
[![Version](https://img.shields.io/npm/v/react-redux-datatable.svg)](https://www.npmjs.org/package/react-redux-datatable)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/sean-ww/react-redux-datatable/master/LICENSE)

Dynamic data table using React and Redux that fetches JSON from a predefined API. Designed to build asynchronous React-Redux tables quickly and consistently.

![Example](react-redux-datatable.png)

This builds upon [react-bootstrap-table](https://github.com/AllenFang/react-bootstrap-table).
* Filter and search data by text or by column values
* Built in ability to filter date ranges, number, text and select lists
* Paginate and Sort data
* Configurable table and column widths
* Ability to add custom filters and column formatters
* Optional local storage of filter data
* Uses React and Redux with a predefined API
* Add table headers
* Toggle full screen view
* Export to csv

### Usage Instructions

#### Install
```
npm i --save react-redux-datatable
```

#### Example Table Setup
```
// in ECMAScript 6
import DataTable from 'react-redux-datatable';
import 'react-redux-datatable/dist/styles.css';

const apiLocation = 'https://my.api/service';

const tableSettings = {
    tableID: 'DataTable',
    keyField: 'ref_id',
    tableColumns: [
        {
            title: 'Ref',
            key: 'ref_id',
            filter: 'NumberFilter',
            defaultValue: { comparator: '=' },
        },
        {
            title: 'First Name',
            key: 'first_name',
        },
        {
            title: 'Surname',
            key: 'surname',
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
    ],
};

const DataTable = () => (
    <DataTable
      tableSettings={tableSettings}
      apiLocation={apiLocation}
    />
);
```

#### Example API Success 2xx Response
Return json.
```json
{
  "searchSuccess": true,
  "dataTotalSize": 2,
  "data": [
    {
      "ref_id":"5",
      "first_name":"Ted",
      "surname":"Corkscrew",
      "type":"Add"
    },
    {
      "ref_id":"26",
      "first_name":"Edwina",
      "surname":"Hosepipe",
      "type":"Add"
    }
  ]
}
```

#### Example API Error Response
Return json with searchSuccess as false and/or a html status error code (4xx or 5xx).
```json
{
  "searchSuccess": false
}
```

### Notes

Use [babel-polyfill](https://www.npmjs.com/package/babel-polyfill) in your codebase to ensure the package works across older browsers.

### License

The MIT License (MIT). Please view the [License File](https://github.com/sean-ww/react-datatable/blob/master/LICENSE) for more information.
