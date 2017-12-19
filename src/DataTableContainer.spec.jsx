import React from 'react';
import 'babel-polyfill';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DataTableContainer } from './DataTableContainer';
import LoadingGif from './LoadingGif/LoadingGif';

function actionFormatter() {
    return (
        <div class="table-icons">
            <span class="view link" />
        </div>
    );
}

const testTableSettings = {
    tableID: 'ExampleDataTable',
    wrapperType: 'section',
    displayTitle: 'Requests Table',
    keyField: 'request_id',
    defaultSort: ['request_id', 'desc'],
    minWidth: 880,
    useLocalStorage: true,
    tableColumns: [
        {
            title: 'Ref',
            key: 'request_id',
            filter: 'NumberFilter',
            defaultValue: { comparator: '=' },
            width: 74,
        },
        {
            title: 'User ID',
            key: 'user_id',
            filter: 'NumberFilter',
            defaultValue: { comparator: '=' },
            width: 74,
            export: false,
        },
        {
            title: 'First Name',
            key: 'first_name',
            width: 90,
        },
        {
            title: 'Last Name',
            key: 'surname',
            width: 90,
        },
        {
            title: 'Email Address',
            key: 'email',
            width: 164,
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
        {
            title: 'System',
            key: 'system_type',
            filter: 'SelectFilter',
            filterOptions: {
                training: 'training',
                staging: 'staging',
                production: 'production',
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            searchable: false,
            sortable: false,
            export: false,
            dataFormat: actionFormatter,
        },
    ],
};

describe('<DataTableContainer>', () => {
    let Component;
    beforeEach(() => {
        Component = shallow(
            <DataTableContainer
              dispatch={() => {}}
              tableSettings={testTableSettings}
              apiLocation="fake/location"
            />,
        );
    });

    it('should display a section toolbar title', () => {
        expect(Component.find('.section-toolbar-title').first().text()).to.equal('Requests Table');
    });

    it('should display a Fullscreen toggle', () => {
        expect(Component.find('.section-toolbar-fullscreen').first().text()).to.equal('Fullscreen');
    });

    it('should NOT display full screen', () => {
        expect(Component.find('.section-isFullscreen')).to.have.length(0);
    });

    it('should display a LoadingGif', () => {
        expect(Component.contains(<LoadingGif />)).to.equal(true);
    });

    it('should NOT display a DataTable', () => {
        expect(Component.find('.inner div').first().text()).to.not.equal('<DataTable />');
    });

    describe('The table data has loaded', () => {
        beforeEach(() => {
            Component.setProps({
                DataTableData: {
                    ExampleDataTable: {
                        fetched: true,
                    },
                },
            });
        });

        it('should NOT display a LoadingGif', () => {
            expect(Component.contains(<LoadingGif />)).to.equal(false);
        });

        it('should display a DataTable', () => {
            expect(Component.find('.inner div').first().text()).to.equal('<DataTable />');
        });
    });

    describe('The table data is switched to fullscreen', () => {
        beforeEach(() => {
            Component.setState({
                isFullscreen: true,
            });
        });

        it('should display full screen', () => {
            expect(Component.find('.section-isFullscreen')).to.have.length(1);
        });
    });
});
