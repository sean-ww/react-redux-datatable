import React from 'react';
import { storiesOf } from '@storybook/react';

import BasicTable from './stories/tableSettings/BasicTable';
import DisplayTitle from './stories/tableSettings/DisplayTitle';
import ExtraToolbarItems from './stories/tableSettings/ExtraToolbarItems';
import ExtraButtons from './stories/tableSettings/ExtraButtons';
import CustomHeaders from './stories/tableSettings/CustomHeaders';
import MinWidthTable from './stories/tableSettings/MinWidthTable';
import NoDataIndication from './stories/tableSettings/NoDataIndication';
import UseLocalStorage from './stories/tableSettings/UseLocalStorage';
import SetWrapperClass from './stories/tableSettings/SetWrapperClass';
import CustomApiError from './stories/tableSettings/CustomApiError';

import DefaultSearch from './stories/globalSearch/DefaultSearch';
import NoSearch from './stories/globalSearch/NoSearch';

import TextFilter from './stories/columnFilters/TextFilter';
import NumberFilter from './stories/columnFilters/NumberFilter';
import SelectFilter from './stories/columnFilters/SelectFilter';
import DateRangeFilter from './stories/columnFilters/DateRangeFilter';
import NoColumnFilter from './stories/columnFilters/NoColumnFilter';

import DefaultSort from './stories/columnSorting/DefaultSort';
import NoColumnSorting from './stories/columnSorting/NoColumnSorting';

import ColumnFormatting from './stories/otherColumnOptions/ColumnFormatting';
import HideColumns from './stories/otherColumnOptions/HideColumns';
import ColumnWidth from './stories/otherColumnOptions/ColumnWidth';

import NoColumnExport from './stories/exporting/NoColumnExport';
import NoExport from './stories/exporting/NoExport';

import MinimalFeaturesTable from './stories/combinedExample/MinimalFeaturesTable';
import AdvancedFeaturesTable from './stories/combinedExample/AdvancedFeaturesTable';

storiesOf('Table Settings', module)
  .add('Basic Table', () => <BasicTable />)
  .add('Display Title', () => <DisplayTitle />)
  .add('Extra Toolbar Items', () => <ExtraToolbarItems />)
  .add('Extra Buttons', () => <ExtraButtons />)
  .add('Custom Headers', () => <CustomHeaders />)
  .add('Min Width Table', () => <MinWidthTable />)
  .add('No Data Indication', () => <NoDataIndication />)
  .add('Use Local Storage', () => <UseLocalStorage />)
  .add('Set Wrapper Class', () => <SetWrapperClass />)
  .add('Custom Api Error', () => <CustomApiError />);

storiesOf('Global Search', module)
  .add('Default Search', () => <DefaultSearch />)
  .add('No Search', () => <NoSearch />);

storiesOf('Column Filters', module)
  .add('Text Filter', () => <TextFilter />)
  .add('Number Filter', () => <NumberFilter />)
  .add('Select Filter', () => <SelectFilter />)
  .add('Date Range Filter', () => <DateRangeFilter />)
  .add('No Column Filter', () => <NoColumnFilter />);

storiesOf('Column Sorting', module)
  .add('Default Sort', () => <DefaultSort />)
  .add('No Column Sorting', () => <NoColumnSorting />);

storiesOf('Other Column Options', module)
  .add('Column Formatting', () => <ColumnFormatting />)
  .add('Hide Columns', () => <HideColumns />)
  .add('Column Width', () => <ColumnWidth />);

storiesOf('Exporting', module)
  .add('No Column Export', () => <NoColumnExport />)
  .add('No Export', () => <NoExport />);

storiesOf('General Demo', module)
  .add('Minimal Features', () => <MinimalFeaturesTable />)
  .add('Advanced Features', () => <AdvancedFeaturesTable />);
