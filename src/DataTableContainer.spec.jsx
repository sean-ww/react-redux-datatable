import React from 'react';
import 'babel-polyfill';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';
import { DataTableContainer } from './DataTableContainer';
import LoadingGif from './LoadingGif/LoadingGif';

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
            title: 'Request Date',
            key: 'created_at',
            filter: 'CustomDateRangeFilter',
            disableSearchAll: true,
            width: 120,
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
        },
    ],
};

describe('<DataTableContainer>', () => {
    it('should call componentDidMount', () => {
        sinon.spy(DataTableContainer.prototype, 'componentDidMount');
        mount(
            <DataTableContainer
              dispatch={() => {}}
              tableSettings={testTableSettings}
              apiLocation="fake/location"
            />,
        );
        expect(DataTableContainer.prototype.componentDidMount.calledOnce).to.equal(true);
    });

    let Component;
    beforeEach(() => {
        Component = mount(
            <DataTableContainer
              dispatch={() => {}}
              tableSettings={testTableSettings}
              apiLocation="fake/location"
            />,
        );
    });

    it('should render', () => {
        expect(Component).to.have.length(1);
    });

    it('should display a section toolbar title', () => {
        expect(Component.find('.section-toolbar-title').first().text()).to.equal('Requests Table');
    });

    it('should display a Fullscreen toggle', () => {
        expect(Component.find('.section-toolbar-fullscreen').first().text()).to.equal('Fullscreen');
    });

    it('should display a LoadingGif', () => {
        expect(Component.contains(<LoadingGif />)).to.equal(true);
    });

    it('should toggle full screen when clicking Toggle Fullscreen', () => {
        expect(Component.find('.section-isFullscreen')).to.have.length(0);
        Component.find('.section-toolbar-fullscreen').first().simulate('click');
        expect(Component.find('.section-isFullscreen')).to.have.length(1);
        Component.find('.section-toolbar-fullscreen').first().simulate('click');
        expect(Component.find('.section-isFullscreen')).to.have.length(0);
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
    });

    it('should refresh the table on refresh click', () => {
        expect(Component.state().lastRefresh).to.equal(0);
        Component.find('.refresh-icon').parents().at(0).simulate('click');
        expect(Component.state().lastRefresh).to.be.greaterThan(0);
    });

    it('should hide/show column filters when clicking hide/show Filters', () => {
        expect(Component.find('.hide-filter')).to.have.length(9);
        Component.find('.filter-icon').parents().at(0).simulate('click');
        expect(Component.find('.hide-filter')).to.have.length(0);
        Component.find('.filter-icon').parents().at(0).simulate('click');
        expect(Component.find('.hide-filter')).to.have.length(9);
    });

    it('should display an export button', () => {
        expect(Component.find('.export-icon').first().parents().at(0).text()).to.equal('Export');
    });

    it('should display an empty search input', () => {
        expect(Component.find('.react-bs-table-search-form input').first().props().defaultValue).to.equal('');
    });

    it('should display a search input with a default search term', () => {
        const newTableSettings = Object.assign({}, Component.props().tableSettings, {
            defaultSearch: 'my search term',
        });
        const NewComponent = mount(
            <DataTableContainer
              dispatch={() => {}}
              tableSettings={newTableSettings}
              apiLocation="fake/location"
            />,
        );
        expect(NewComponent.find('.react-bs-table-search-form input').first().props().defaultValue)
            .to.equal('my search term');
    });

    it('should display empty column filters', () => {
        expect(Component.find('.number-filter-input').first().prop('defaultValue')).to.be.undefined;
        expect(Component.find('TextFilter').first().prop('defaultValue')).to.equal('');
        expect(Component.find('CustomDateFilter').first().prop('defaultValue')).to.deep.equal({});
        expect(Component.find('SelectFilter').first().prop('defaultValue')).to.equal('');
    });

    describe('Default values are set', () => {
        let NewComponent;
        const fromDate = new Date('2017-01-01');
        const toDate = new Date('2017-01-02');
        const dateRangeDefault = { from: fromDate, to: toDate };
        beforeEach(() => {
            const newTableSettings = Object.assign({}, Component.props().tableSettings, {
                tableColumns: [
                    {
                        title: 'Ref',
                        key: 'request_id',
                        filter: 'NumberFilter',
                        defaultValue: { comparator: '=', number: 66 },
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
                        defaultValue: 'Dave',
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
                        title: 'Request Date',
                        key: 'created_at',
                        filter: 'CustomDateRangeFilter',
                        disableSearchAll: true,
                        width: 120,
                        defaultValue: dateRangeDefault,
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
                        defaultValue: 'Amend',
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
                    },
                ],
            });
            NewComponent = mount(
                <DataTableContainer
                  dispatch={() => {}}
                  tableSettings={newTableSettings}
                  apiLocation="fake/location"
                />,
            );
        });

        it('should display column filters with default values', () => {
            expect(NewComponent.find('.number-filter-input').first().prop('defaultValue'))
                .to.equal(66);
            expect(NewComponent.find('TextFilter').first().prop('defaultValue'))
                .to.equal('Dave');
            expect(NewComponent.find('CustomDateFilter').first().prop('defaultValue'))
                .to.equal(dateRangeDefault);
            expect(NewComponent.find('SelectFilter').first().prop('defaultValue'))
                .to.equal('Amend');
        });

        it('should clear all filters when clear filters is clicked', () => {
            NewComponent.find('.filter-icon-clear').first().simulate('click');
            expect(NewComponent.find('.number-filter-input').first().prop('defaultValue')).to.equal('');
            expect(NewComponent.find('TextFilter').first().prop('defaultValue')).to.equal('');
            expect(NewComponent.find('CustomDateFilter').first().prop('defaultValue')).to.deep.equal({});
            expect(NewComponent.find('SelectFilter').first().prop('defaultValue')).to.equal('');
        });
    });
});
