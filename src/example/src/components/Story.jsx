import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { forbidExtraProps } from 'airbnb-prop-types';
import { Provider } from 'react-redux';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Code from './CodeBlock';
import store from '../store';
import TableSettingsShape from '../../../shapes/TableSettings.shape';
import SEARCH_DATA from '../../../../.storybook/mocks/api/search.json'; // eslint-disable-line import/no-unresolved
import search from '../../../../.storybook/mocks/api/search';
import DataTable from '../../../DataTableContainer';

import '../../../assets/sass/styles.scss';
import '../assets/sass/CodeBlock.scss';

const propTypes = forbidExtraProps({
  sourceCode: PropTypes.string.isRequired,
  tableSettings: TableSettingsShape.isRequired,
});

const mock = new MockAdapter(axios);
const MOCK_API_LOCATION = 'http://localhost/api/search';

mock.onPost(MOCK_API_LOCATION).reply(config => {
  const params = new URLSearchParams(decodeURIComponent(config.data));
  return [200, search(SEARCH_DATA, params)];
});

const Story = ({ sourceCode, tableSettings }) => (
  <Provider store={store}>
    <Fragment>
      <DataTable tableSettings={tableSettings} apiLocation={MOCK_API_LOCATION} axiosInstance={axios} />
      <Code>{sourceCode}</Code>
    </Fragment>
  </Provider>
);

Story.propTypes = propTypes;

export default Story;
