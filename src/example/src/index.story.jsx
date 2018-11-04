import React from 'react';
import { storiesOf } from '@storybook/react';

import ExampleTable from './stories/ExampleTable';

storiesOf('DataTable', module).add('Example', () => <ExampleTable />);
