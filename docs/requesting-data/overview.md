#### Table API Request Parameters
The datatable will send the following post parameters to the api.

| Name          | Type    | Description                                                   |
| ----          | ------  | -----------                                                   |
| tableSettings | object  | The global table settings.                                    |
| limit         | integer | The number of table rows to return at once.                   |
| offset        | integer | Starting from 0, offset results by this value for pagination. |
| searchValue   | string  | The value from the global search box.                         |
| columnFilters | array   | Array of column filter settings.                              |
| sortName      | string  | The name of the column to be sorted by.                       |
| sortOrder     | string  | Asc or desc.                                                  |

#### Response

Your api should take these parameters and return data in the following json format:
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

The data keys should correspond to each column in your table. The dataTotalSize value should be a count of all available data without pagination.
