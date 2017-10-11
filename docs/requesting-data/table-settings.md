#### Example Table Settings
If our table settings were:
```
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
```

Then the tableSettings post parameter would contain a corresponding json object:
```json
{
  "tableID":"DataTable",
  "keyField":"ref_id",
  "tableColumns":[
    {
      "title":"Ref",
      "key":"ref_id",
      "filter":"NumberFilter",
      "defaultValue":{"comparator":"="}
    },
    {
      "title":"First Name",
      "key":"first_name"
    },
    {
      "title":"Surname",
      "key":"surname"
    },
    {
      "title":"Type",
      "key":"type",
      "filter":"SelectFilter",
      "filterOptions": {
        "Add": "Add",
        "Amend": "Amend",
        "Remove": "Remove"
      }
    }
  ]
}
```

#### Available Options

| Name            | Type    | Description                                                                      |
| ----            | ------  | -----------                                                                      |
| tableID         | string  | Required: An ID for the table.                                                   |
| keyField        | string  | Required: A column key must be selected as the key field.                        |
| tableColumns    | array   | Required: An array of objects with at least a key and title.                     |
| wrapperType     | string  | This string adds a class or classes to the wrapper div around the table.         |
| displayTitle    | string  | This adds a title above the table.                                               |
| defaultSort     | array   | The default column to sort by, and if it is asc or desc e.g. ['ref_id', 'desc']. |
| minWidth        | integer | Define a minimum width for the table.                                            |
| useLocalStorage | bool    | If true the table filters will be stored using local storage.                    |
