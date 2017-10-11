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
