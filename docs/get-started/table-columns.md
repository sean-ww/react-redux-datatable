#### Available Options

| Name            | Type     | Required? | Description                                                                                       |
| ----            | ----     | --------- | -----------                                                                                       |
| key             | string   | Yes       | The column key.                                                                                   |
| title           | string   | Yes       | The column heading to be displayed.                                                               |
| dataFormat      | function | -         | A function can be used to format cell values eg. (cell) => { return cell; }                       |
| defaultValue    | object   | -         | The default value specific to the filter type.                                                    |
| export          | bool     | -         | If false, the column will get excluded from the export.                                           |
| filter          | string   | -         | The filter type to be used by the column.                                                         |
| filterOptions   | object   | -         | Key-value paris of filter options eg. { key: 'value', key: 'value' }. [See More](#filter-options) |
| formatExtraData | any      | -         | This can be used to provide extra data to dataFormat.                                             |
| hidden          | bool     | -         | If true, hides the column. Defaults to false.                                                     |
| searchable      | bool     | -         | If false, the column cannot be searched.                                                          |
| sortable        | bool     | -         | If false, the column cannot be sorted by.                                                         |
| width           | integer  | -         | Define a fixed width for the column.                                                              |

##### Filter Options

###### Text Filter
This is the default filter and does not need to be named.
```
{
    title: 'First Name',
    key: 'first_name',
},
```
Text Filter will post:
```json
{
  "key":"first_name",
  "type":"like",
  "value":"search value"
}
```

###### Select Filter
This provides a select box with predefined options.
```
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
```
Select Filter will post:
```json
{
  "key":"type",
  "type":"eq",
  "value":"Amend"
}
```

###### Number Filter
This allows your to filter using a number with a logical comparator.
```
{
    title: 'Ref',
    key: 'ref_id',
    filter: 'NumberFilter',
    defaultValue: { comparator: '=' }, // define the default comparator
},
```
Number Filter will post:
```json
{
  "key":"ref_id",
  "type":"eq", // eq, gt, gteq, lt, lteq, nteq, like
  "value":"119"
}
```

###### Date Range Filter
This provides a select box with predefined options.
```
{
    title: 'Date Created',
    key: 'created_at',
    filter: 'CustomDateRangeFilter',
},
```
Date Range Filter will post:
```json
{
  "key":"created_at",
  "type":"between",
  "value":{"from":"2017-10-01","to":"2017-10-05"}
}
```
