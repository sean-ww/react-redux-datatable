#### Table API Methods

In order to access the underlying table methods, you will need to set a reference:
```
<DataTable
  setRef={(c) => { this.myTable = c; }}
  ...
/>
```

You can then use this reference to call methods:
```
this.myTable.method();
```

#### Example
```
class MyTable extends React.Component {
    render() {
        const MyLink = () =>
            <span onClick={() => this.myTable.refreshTable()}>
                Click Me
            </span>;

        const tableSettings = {
            tableID: 'MyTable',
            wrapperType: 'section',
            displayTitle: 'Example',
            extraToolbarItems: MyLink,
            keyField: 'requestId',
            defaultSort: ['requestId', 'desc'],
            tableColumns: [
                {
                    title: 'Ref',
                    key: 'requestId',
                },
                {
                    title: 'Training Course',
                    key: 'course',
                },
            ],
        };

        return (
            <DataTable
              setRef={(c) => { this.myTable = c; }}
              tableSettings={tableSettings}
              apiLocation={apiLocation}
            />
        );
    }
}
```

#### Available Methods

###### makeFullscreen
Call to toggle the table between full-screen and standard view.
```
this.myTable.makeFullscreen()
```

###### onPageChange
Call to change the page, giving (pageNumber, sizePerPage).
```
this.myTable.onPageChange(2, 10) // Go to page 2 starting from result 11
```

###### onSizePerPageList
Call to change the size per page value, giving (sizePerPage).
This must match an option value in the select list.
```
this.myTable.onSizePerPageList(25) // Change to 25 results per page
```
This alone will not update the table data, but can be used alongside ```onPageChange``` to update the data.

###### resetPagination
Call to go back to the first page.
```
this.myTable.resetPagination()
```

###### refreshTable
Call to refresh the table data.
```
this.myTable.refreshTable()
```
